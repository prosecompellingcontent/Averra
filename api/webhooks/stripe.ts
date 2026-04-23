// netlify/functions/stripe-webhook.ts
import type { Handler } from "@netlify/functions";
import Stripe from "stripe";

const SUPABASE_URL =
  "https://zfzwknmljpotidwyoefk.supabase.co/functions/v1/make-server-61755bec/send-purchase-email";

// Keep your existing key usage as-is (you already use anon key)
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmendrbm1sanBvdGlkd3lvZWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3ODQxNTMsImV4cCI6MjA4NTM2MDE1M30.zz_eMP7Xg04HI69y0sgpQzs4osujmMJ1Dt6fkDwLvPI";

export const handler: Handler = async (event) => {
  // Don’t crash when opened in a browser
  if (event.httpMethod !== "POST") {
    return { statusCode: 200, body: "OK" };
  }

  const stripeSecretKey =
    process.env.STRIPE_SECRET_KEY || process.env.Stripe_Secret_Key || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!stripeSecretKey) {
    return { statusCode: 500, body: "STRIPE_SECRET_KEY not configured" };
  }
  if (!webhookSecret) {
    return { statusCode: 500, body: "STRIPE_WEBHOOK_SECRET not configured" };
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-02-25.clover" });

  const signature =
    event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
  if (!signature) {
    return { statusCode: 400, body: "No Stripe signature found" };
  }

  let stripeEvent: Stripe.Event;
  try {
    // Netlify provides the raw payload as a string in event.body
    stripeEvent = stripe.webhooks.constructEvent(
      event.body ?? "",
      signature,
      webhookSecret
    );
  } catch (err: any) {
    return {
      statusCode: 400,
      body: `Invalid signature: ${err?.message ?? "unknown"}`,
    };
  }

  // Only handle checkout.session.completed (same as your Vercel function)
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    // Pull line items (same as your existing logic)
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });

    const items = lineItems.data.map((lineItem: any) => {
      const productId =
        typeof lineItem.price?.product === "object"
          ? lineItem.price.product.id
          : lineItem.price?.product;

      const name =
        lineItem.description ||
        (typeof lineItem.price?.product === "object"
          ? lineItem.price.product.name
          : undefined) ||
        "Unknown Product";

      return {
        productId,
        priceId: lineItem.price?.id ?? null,
        name,
        quantity: lineItem.quantity ?? 1,
        price: (lineItem.amount_total ?? lineItem.amount_subtotal ?? 0) / 100,
      };
    });

    const resp = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        customerName: session.customer_details?.name,
        items,
        amountTotal: session.amount_total,
        metadata: session.metadata,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      // Return 500 so Stripe retries delivery
      return { statusCode: 500, body: `Supabase processing failed: ${text}` };
    }
  }

  return { statusCode: 200, body: "received" };
};
