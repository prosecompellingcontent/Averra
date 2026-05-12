import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log('Webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  const customerId = session.customer as string;
  const email = session.customer_email || session.customer_details?.email;

  if (!email) {
    console.error('No email found in checkout session');
    return;
  }

  // Get or create user profile
  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (profileError || !profile) {
    console.log('Creating new profile for:', email);
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        email,
        stripe_customer_id: customerId,
        full_name: session.customer_details?.name,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
      return;
    }
    profile = newProfile;
  } else if (!profile.stripe_customer_id) {
    // Update existing profile with Stripe customer ID
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', profile.id);
  }

  // If it's a subscription checkout
  if (session.mode === 'subscription' && session.subscription) {
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionChange(subscription);
  }

  // If it's a one-time payment (e.g., ebook purchase)
  if (session.mode === 'payment') {
    // Handle one-time purchase
    console.log('One-time payment completed for:', email);
    // You can add logic here to unlock specific content
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Processing subscription change:', subscription.id);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;

  // Find user by Stripe customer ID
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (profileError || !profile) {
    console.error('Profile not found for customer:', customerId);
    return;
  }

  // Determine membership type from price ID
  const membershipType = priceId.includes('blueprint') ? 'blueprint' : 'gold-standard';
  const isFounderPricing = priceId.includes('founder');

  // Update or create subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: profile.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      price_id: priceId,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    });

  if (subError) {
    console.error('Error upserting subscription:', subError);
    return;
  }

  // Update profile with membership details
  const membershipStatus = subscription.status === 'active' ? 'active' :
                          subscription.status === 'past_due' ? 'past_due' :
                          subscription.status === 'trialing' ? 'trialing' : 'canceled';

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      membership_type: membershipType,
      membership_status: membershipStatus,
      founder_pricing: isFounderPricing,
    })
    .eq('id', profile.id);

  if (updateError) {
    console.error('Error updating profile:', updateError);
  }

  console.log(`Updated ${profile.email} to ${membershipType} (${membershipStatus})`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deletion:', subscription.id);

  const customerId = subscription.customer as string;

  // Find user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (profileError || !profile) {
    console.error('Profile not found for customer:', customerId);
    return;
  }

  // Update profile to canceled status
  await supabase
    .from('profiles')
    .update({
      membership_status: 'canceled',
    })
    .eq('id', profile.id);

  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Canceled subscription for ${profile.email}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Processing invoice.paid:', invoice.id);

  const customerId = invoice.customer as string;

  // Find user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (profileError || !profile) {
    console.error('Profile not found for customer:', customerId);
    return;
  }

  // If was past_due, reactivate
  if (profile.membership_status === 'past_due') {
    await supabase
      .from('profiles')
      .update({ membership_status: 'active' })
      .eq('id', profile.id);

    console.log(`Reactivated membership for ${profile.email}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id);

  const customerId = invoice.customer as string;

  // Find user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (profileError || !profile) {
    console.error('Profile not found for customer:', customerId);
    return;
  }

  // Update to past_due status
  await supabase
    .from('profiles')
    .update({ membership_status: 'past_due' })
    .eq('id', profile.id);

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      user_id: profile.id,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: 'Your membership payment needs attention. Please update your payment method.',
      link: '/members/billing',
    });

  console.log(`Marked ${profile.email} as past_due`);
}
