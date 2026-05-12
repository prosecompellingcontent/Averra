import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.Stripe_Secret_Key || '', {
  apiVersion: '2026-02-25.clover',
});

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, need raw body for signature verification
  },
};

// Helper to get raw body
async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Stripe-Signature'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Log everything for debugging
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔔 WEBHOOK RECEIVED FROM STRIPE!", new Date().toISOString());
  console.log("📍 Request Method:", req.method);
  console.log("📍 Request URL:", req.url);
  console.log("📍 Request Headers:", JSON.stringify(req.headers, null, 2));
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (req.method !== 'POST') {
    console.error(`❌ WRONG METHOD: Expected POST, got ${req.method}`);
    return res.status(405).json({ error: `Method ${req.method} not allowed. Expected POST.` });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET not configured!");
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    if (!signature) {
      console.error("❌ No Stripe signature found");
      return res.status(400).json({ error: 'No signature' });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    console.log(`✅ Webhook verified: ${event.type}`);

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("🛒 Checkout completed:", session.id);
      console.log("📧 Customer email:", session.customer_details?.email);
      
      // Forward to Supabase backend for processing
      const supabaseUrl = `https://zfzwknmljpotidwyoefk.supabase.co/functions/v1/make-server-61755bec/send-purchase-email`;
      // Use the anon key from the info file
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmendrbm1sanBvdGlkd3lvZWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3ODQxNTMsImV4cCI6MjA4NTM2MDE1M30.zz_eMP7Xg04HI69y0sgpQzs4osujmMJ1Dt6fkDwLvPI";
      
      console.log("📤 Forwarding to Supabase backend for email processing...");

      // Get line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ['data.price.product'],
      });

      console.log(`📦 Found ${lineItems.data.length} line items from Stripe`);

      const items = lineItems.data.map((lineItem: any) => {
        const productId = typeof lineItem.price?.product === 'object' 
          ? lineItem.price.product.id 
          : lineItem.price?.product;
        
        const name = lineItem.description ||
          (typeof lineItem.price?.product === 'object' ? lineItem.price.product.name : undefined) ||
          'Unknown Product';
        
        const item = {
          productId,
          priceId: lineItem.price?.id ?? null,
          name,
          quantity: lineItem.quantity ?? 1,
          price: ((lineItem.amount_total ?? lineItem.amount_subtotal ?? 0) / 100),
        };
        
        console.log(`  - Item: ${name} (productId: ${productId}, quantity: ${item.quantity})`);
        return item;
      });
      
      console.log("✅ ITEMS WITH PRODUCT IDS:", JSON.stringify(items, null, 2));

      // Call Supabase backend
      const backendResponse = await fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          items: items,
          amountTotal: session.amount_total,
          metadata: session.metadata,
        }),
      });

      if (backendResponse.ok) {
        console.log("✅ Email processing successful");
      } else {
        const errorData = await backendResponse.text();
        console.error("❌ Backend processing failed:", errorData);
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Webhook processing failed' 
    });
  }
}