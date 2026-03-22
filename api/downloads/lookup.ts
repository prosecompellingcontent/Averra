import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.Stripe_Secret_Key || '', {
  apiVersion: '2026-02-25.clover',
});

// Product ID to ZIP URL mapping
const PRODUCT_MAP: Record<string, { name: string; zipUrl: string }> = {
  'prod_U4tjELgIEdNp8R': {
    name: 'The Map Pack',
    zipUrl: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-map-pack/the-map-pack.zip'
  },
  'prod_U4tj3TpmVuEi6v': {
    name: 'The Base Bundle',
    zipUrl: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-base-bundle/the-base-bundle.zip'
  },
  'prod_U4tjFfvIwptjfn': {
    name: 'The Cuticle Collection',
    zipUrl: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-cuticle-collection/the-cuticle-collection.zip'
  },
  'prod_U4tjvZqmdppfZE': {
    name: 'You Glow Girl Bundle',
    zipUrl: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/you-glow-girl-bundle/you-glow-girl-bundle.zip'
  },
  'prod_UAlmvz04pAYbco': {
    name: 'Fresh Out The Chair',
    zipUrl: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/fresh-out-the-chair/fresh-out-the-chair.zip'
  },
  'prod_UAlnkF1MY2zjzW': {
    name: 'The Lash Collection',
    zipUrl: 'https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip'
  }
};

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 DOWNLOAD LOOKUP REQUEST", new Date().toISOString());

  try {
    const { session_id, email } = req.body;

    // Validate inputs
    if (!session_id) {
      console.error("❌ Missing session_id");
      return res.status(400).json({ error: 'session_id is required' });
    }

    if (!email) {
      console.error("❌ Missing email");
      return res.status(400).json({ error: 'email is required' });
    }

    console.log("📧 Lookup for email:", email);
    console.log("🔑 Session ID:", session_id);

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Supabase credentials not configured");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to fetch order from Supabase
    console.log("🔍 Checking Supabase for existing order record...");
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('session_id', session_id)
      .single();

    let orderData = existingOrder;

    // If order doesn't exist in Supabase, fetch from Stripe and create it
    if (!orderData) {
      console.log("⚠️ No order found in Supabase, fetching from Stripe...");
      
      try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (!session) {
          console.error("❌ Session not found in Stripe");
          return res.status(404).json({ error: 'Order not found' });
        }

        console.log("✅ Stripe session retrieved");
        console.log("📧 Stripe customer email:", session.customer_details?.email);

        // Get line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session_id, {
          limit: 100,
          expand: ['data.price.product'],
        });

        console.log(`📦 Found ${lineItems.data.length} line items`);

        // Build items array with product IDs
        const items = lineItems.data.map((item: any) => {
          const productId = typeof item.price?.product === 'object' 
            ? item.price.product.id 
            : item.price?.product;
          
          return {
            productId,
            priceId: item.price?.id,
            name: item.description || 
                  (typeof item.price?.product === 'object' ? item.price.product.name : 'Unknown Product'),
            quantity: item.quantity || 1,
            price: ((item.amount_total ?? item.amount_subtotal ?? 0) / 100)
          };
        });

        console.log("📋 Line items:", JSON.stringify(items, null, 2));

        // Determine if order has digital products or service tiers
        const hasDigital = items.some(item => item.productId && PRODUCT_MAP[item.productId]);
        const hasService = items.some(item => 
          item.name?.toLowerCase().includes('averra') && 
          (item.name?.toLowerCase().includes('essentials') || 
           item.name?.toLowerCase().includes('signature') || 
           item.name?.toLowerCase().includes('muse'))
        );

        console.log("📊 Order classification:", { hasDigital, hasService });

        // Store order in Supabase
        const { data: newOrder, error: insertError } = await supabase
          .from('orders')
          .insert({
            session_id: session_id,
            customer_email: session.customer_details?.email?.toLowerCase(),
            customer_name: session.customer_details?.name || 'Customer',
            items,
            has_digital: hasDigital,
            has_service: hasService,
            amount_total: session.amount_total,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error("❌ Error storing order:", insertError);
        } else {
          console.log("✅ Order stored in Supabase");
          orderData = newOrder;
        }
      } catch (stripeError) {
        console.error("❌ Stripe error:", stripeError);
        return res.status(404).json({ error: 'Order not found' });
      }
    }

    if (!orderData) {
      console.error("❌ Could not retrieve order data");
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify email matches (case-insensitive)
    const orderEmail = orderData.customer_email?.toLowerCase();
    const providedEmail = email.toLowerCase();

    console.log("🔐 Email verification:", { orderEmail, providedEmail });

    if (orderEmail !== providedEmail) {
      console.error("❌ Email mismatch");
      return res.status(403).json({ error: 'Email does not match order' });
    }

    console.log("✅ Email verified");

    // Build downloads array from items
    const downloads = orderData.items
      .filter((item: any) => item.productId && PRODUCT_MAP[item.productId])
      .map((item: any) => {
        const productInfo = PRODUCT_MAP[item.productId];
        return {
          name: productInfo.name,
          quantity: item.quantity || 1,
          zipUrl: productInfo.zipUrl
        };
      });

    console.log(`📦 Matched ${downloads.length} digital products`);

    const response = {
      customer_name: orderData.customer_name,
      downloads,
      has_service: orderData.has_service || false
    };

    console.log("✅ Returning download data:", JSON.stringify(response, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return res.status(200).json(response);

  } catch (error) {
    console.error("❌ Lookup error:", error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    });
  }
}
