OBJECTIVE
Implement Option A: Send the DIGITAL PRODUCT download email directly from the Vercel Stripe webhook (Resend) so the Supabase ZIP download buttons actually appear. Keep Supabase for TIERS/SERVICES: store brand alignment quiz answers + customer info + scheduling tracking. Also improve deliverability so emails are less likely to land in Gmail Promotions (transactional-style).

CURRENT PROBLEM (EVIDENCE)
Vercel logs show the webhook is still “📤 Forwarding to Supabase backend for email processing...” and the email that arrives has an empty “Download Your Files” section (no Supabase links/buttons). That proves the download-email code path is not being used. We need to STOP forwarding digital product emails to Supabase and send them directly from the Vercel webhook.

REQUIREMENTS (DO NOT CHANGE)
- Keep Stripe as payment processor.
- Keep Supabase as the system of record for tier/service customers:
  - store brand alignment quiz answers
  - store purchase info
  - store customer email/name
  - store strategy session status (booked/not booked)
- Digital products must be “instant delivery” via email, but delivered as LINKS (buttons) to Supabase public ZIP files, NOT attachments.
- Customers can purchase:
  - multiple digital products (different)
  - multiple quantities of the same digital product
  - digital + tier/service items in the same checkout
- Match digital items by Stripe PRICE ID (not product name).

DIGITAL PRODUCT PRICE-ID → SUPABASE ZIP URL MAP (MATCH BY PRICE ID ONLY)
If line item price.id matches, include download button:

- price_1T6jvhKLeJj1g28UvIxFbI3O (The Map Pack)
  https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-map-pack/the-map-pack.zip

- price_1T6jvrKLeJj1g28URaMIEaL3 (The Base Bundle)
  https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-base-bundle/the-base-bundle.zip

- price_1T6jvyKLeJj1g28UVyqmrr5U (The Cuticle Collection)
  https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-cuticle-collection/the-cuticle-collection.zip

- price_1T6jw5KLeJj1g28UcpqJcnvL (You Glow Girl Bundle)
  https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/you-glow-girl-bundle/you-glow-girl-bundle.zip

- price_1TCQF9KLeJj1g28Ui7ESZUAF (Fresh Out The Chair)
  https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/fresh-out-the-chair/fresh-out-the-chair.zip

- price_1TCQGHKLeJj1g28UJqHVf7wl (The Lash Collection)
  https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip

OPTION A IMPLEMENTATION (DIGITAL EMAIL MUST BE SENT FROM VERCEL)
1) In the Vercel webhook handler for Stripe events:
   - Keep verifying Stripe signature.
   - On checkout.session.completed:
     a) Retrieve checkout session line items + quantities.
     b) Build a digitalProducts array containing:
        productName, quantity, downloadUrl, price (optional for display)
     c) If digitalProducts.length > 0:
        SEND the “Digital Products Instant Delivery” email directly via Resend from THIS webhook.
        DO NOT forward digital product delivery to Supabase.

2) IMPORTANT: Still record the order in Supabase (so you keep a database record), but that Supabase write is just for storage/analytics.
   - Save: session id, customer email, items purchased, quantities, total, created timestamp.
   - Do NOT make Supabase responsible for sending the digital delivery email.

3) Tier/Service behavior:
   - If the purchase includes tier/service items, CONTINUE to use Supabase to store brand alignment quiz answers and customer onboarding.
   - Tier/service emails can still be handled via Supabase if desired.
   - If a purchase includes BOTH digital + service:
     - Send digital delivery email from Vercel immediately (download buttons)
     - Also trigger the service onboarding flow (welcome + calendly link) via existing Supabase process.

EMAIL CONTENT REQUIREMENTS (DIGITAL DELIVERY EMAIL)
- Keep the existing AVERRA styling if desired, BUT make it more “transactional” (see Promotions section below).
- Insert a section titled “Download Your Files”
- For each digital product purchased:
  - show productName (xN if quantity > 1)
  - show a single DOWNLOAD button linking to the mapped Supabase ZIP URL
- Include “How to unzip” instructions (short).

DELIVERABILITY: REDUCE CHANCE OF GMAIL PROMOTIONS
Goal: Make this email look like a TRANSACTIONAL RECEIPT, not marketing.

Implement these changes for DIGITAL DELIVERY email only:
1) Subject line: remove heavy marketing language/emojis.
   Use: “Your download is ready (Order {saleId})”
2) From address: use a transactional mailbox:
   Use: “AVERRA Deliveries <deliveries@averraaistudio.com>”
   (must be allowed by Resend verified domain)
3) Remove or move marketing content OUT of this email:
   - Remove “Need More? Explore Service Packages →”
   - Remove “Follow us” social icons/links
   - Avoid extra promotional links
4) Keep links minimal:
   - Only include the Supabase download buttons
   - Optional: include a single support link or “Reply to this email”
5) Keep layout clean:
   - Avoid large hero banners typical of marketing emails
   - Keep simple header + body + downloads

NOTE: Gmail routing can’t be guaranteed, but these steps are standard best practices to make emails more “transactional” and less promotional.

IMPORTANT LOGGING / DEBUGGING (TO CONFIRM IT’S FIXED)
After deployment, Vercel logs for a digital purchase MUST show:
- “🚀 INSTANT DELIVERY: Sending digital products to ... NOW!”
- “📦 Digital products matched by PRICE ID: ...”
- Resend success logs (email id)

And the logs MUST NOT show:
- “Forwarding to Supabase backend for email processing...” for digital delivery

FAILSAFE (DO NOT BREAK CUSTOMER EXPERIENCE)
If a purchase includes a digital product price ID that is NOT in the mapping:
- Still send an email that says:
  “We’re preparing your download. Reply to this email and we’ll send it immediately.”
- Never send an empty download section.

WHAT TO DELIVER
- Update the Vercel webhook so digital delivery emails are sent directly from Vercel via Resend using the mapping above.
- Keep Supabase writes for order tracking and keep the tier/service Supabase workflow unchanged.
- Update the digital email content as above to reduce Promotions placement.

SUCCESS TEST
1) Make a live test purchase of a mapped digital product.
2) Confirm:
   - Email arrives quickly
   - Subject matches “Your download is ready (Order …)”
   - “Download Your Files” section includes at least 1 DOWNLOAD button
   - Clicking the button downloads the correct ZIP from Supabase
3) Check Vercel logs show the INSTANT DELIVERY logs and no Supabase-forwarding for digital email.
4) If the purchase includes a tier product, confirm Supabase still records the quiz answers and onboarding.

DO NOT ADD EXTRA TOOLS
No new platforms, no new email providers, no new portals. Keep minimal.