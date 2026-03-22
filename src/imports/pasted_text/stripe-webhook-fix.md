The real bug (confirmed)

Your system is split into two parts:

A) Vercel webhook (api/webhooks/stripe.ts)

It does fetch Stripe line items… but it forwards this to Supabase:

{ "name": "...", "price": 30, "quantity": 1 }
B) Supabase email sender (supabase/functions/server/send-purchase-email.tsx)

It only matches digital products when BOTH are present:

item.type === "digital"

item.priceId exists

You can literally see that in your Supabase function:

if (item.type === 'digital' && item.priceId) { ... }

So Supabase receives items with no type and no priceId → it will always fall back → no buttons.

That’s why you keep getting the same “links are being prepared” result.

✅ Fix it NOW (two code edits + final checks)

You said: include everything, including what to do “at the very end”. Here it is.

1) Fix Vercel webhook to send priceId and type to Supabase

File: api/webhooks/stripe.ts

Replace your current items mapping with this:
const items = lineItems.data.map((lineItem: any) => ({
  // ✅ REQUIRED for matching in Supabase
  priceId: lineItem.price?.id ?? null,
  type: 'digital', // ✅ because your Supabase matcher requires item.type === 'digital'

  // helpful fields
  name:
    lineItem.description ||
    (typeof lineItem.price?.product === 'object' ? lineItem.price.product.name : undefined) ||
    'Unknown Product',

  // Stripe amounts can vary by object; this makes it safer
  price: ((lineItem.amount_total ?? lineItem.amount_subtotal ?? 0) / 100),
  quantity: lineItem.quantity ?? 1,
}));
Also update the line-items fetch to include a limit (safer):
const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
  limit: 100,
  expand: ['data.price.product'],
});
Add ONE log line right after building items (so you can confirm instantly):
console.log("✅ ITEMS SENT TO SUPABASE:", JSON.stringify(items, null, 2));

✅ This alone fixes “Supabase isn’t picking it up” because now Supabase finally receives the two fields it requires.

2) Fix Supabase email sender to NOT depend on item.type (optional but strongly recommended)

Even though we’ll send type: 'digital', remove this extra fragility.

File: supabase/functions/server/send-purchase-email.tsx

Find:

if (item.type === 'digital' && item.priceId) {

Replace with:

if (item.priceId) {

✅ Now matching is based purely on priceId, which is what you actually want.

3) Do the “end steps” exactly (this is where people miss it)
Step A — Deploy

Push the code changes to GitHub → let Vercel redeploy.

Deploy Supabase function changes (if you edited Supabase code).

Step B — Verify in logs FIRST (before buying again)

Trigger the webhook by resending a Stripe event (or making a purchase).

In Vercel logs, you must see:

✅ ITEMS SENT TO SUPABASE: …and inside it you must see something like:

{ "priceId": "price_1TCQGHKLeJj1g28UJqHVf7wl", "type": "digital", ... }

In Supabase function logs, you must see:

📦 Items received: and it should include priceId.

If priceId shows up in Supabase logs → the email will generate buttons.

Step C — Test by resending (no need to spend money again)

Stripe → Webhooks → pick the delivered checkout.session.completed event → resend.
Now Supabase will receive priceId → match → buttons appear.

Bonus: Your DMARC is failing (separate issue, but fix it now)

This does not remove buttons, but it affects trust/inbox behavior.

In Squarespace DNS add:

Type: TXT

Host/Name: _dmarc

Value: v=DMARC1; p=none; rua=mailto:info@averraaistudio.com

This will turn DMARC from FAIL → PASS/neutral and helps deliverability.

Why this is the official fix (in one sentence)

Because your Supabase email code only generates buttons when it receives priceId (and previously type), and your Vercel webhook was not sending those fields at all—so matching could never succeed.