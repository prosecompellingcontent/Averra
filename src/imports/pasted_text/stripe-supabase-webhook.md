What You’re Trying to Do (Simplified)

When payment is successful:

Stripe confirms payment

Stripe sends a webhook

Supabase receives it

Supabase runs logic:

store customer info

trigger email / access

optionally trigger Calendly

Step-by-Step Setup (Exact Flow)
1. Create a Stripe Webhook

Go to Stripe Dashboard:

Developers → Webhooks → Add endpoint

Endpoint URL will be your Supabase function:

https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook
2. Select Events to Listen For

You want:

checkout.session.completed

This fires when payment is successful.

3. Create a Supabase Edge Function

In Supabase:

Go to → Functions → Create new

Name it:

stripe-webhook

Basic structure:

import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const body = await req.json();

  if (body.type === "checkout.session.completed") {
    const session = body.data.object;

    const email = session.customer_details.email;
    const name = session.customer_details.name;

    // Example: store in database
    // await supabase.from("customers").insert({ email, name });

    return new Response("Success", { status: 200 });
  }

  return new Response("Ignored", { status: 200 });
});
4. Add Stripe Webhook Secret (IMPORTANT)

Stripe will give you a signing secret.

Store it in Supabase environment variables:

STRIPE_WEBHOOK_SECRET=whsec_XXXX

Then verify requests (prevents fake calls).

5. What You Can Trigger in Supabase

Once the webhook hits, you can automate:

For Digital Products

save customer to database

trigger download email (via Resend, SMTP, etc.)

track purchases

For Strategy Sessions (Calendly)

You have two options:

Option A (simpler):
Send them to Calendly in Stripe success URL

Option B (advanced):
Trigger logic in Supabase → send booking email automatically

6. Stripe Checkout Setup (Important)

In Stripe checkout, set:

Success URL:

https://yourdomain.com/success

This is what shows your confirmation message.

Important Reality Check

Supabase can handle automation, but:

It does NOT replace Stripe events

It does NOT replace Calendly scheduling

It acts as the logic layer in between

Clean Architecture (What You Should Have)

Stripe
→ handles payment
→ triggers webhook

Supabase
→ receives webhook
→ runs logic
→ stores data
→ triggers emails

Calendly
→ handles booking UI

Common Mistakes (Avoid These)

❌ Trying to trigger Supabase without a webhook
❌ Relying only on Stripe success page (not reliable)
❌ Not verifying webhook signature
❌ Not storing customer data