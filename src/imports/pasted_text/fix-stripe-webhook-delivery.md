CRITICAL BUG TO FIX (READ FIRST)
My Stripe webhook is sending the DIGITAL DELIVERY email (subject “DIGITAL DELIVERY TEST 123” + marker “DOWNLOADTEST123”), but it contains NO download buttons. It triggers the fallback message “Your download links are being prepared…”.
This means digitalProducts is EMPTY at runtime, so downloadButtonsHtml is blank.
Root cause: webhook is NOT reliably retrieving Stripe Checkout Session line items (price IDs + quantities). Must fetch line items from Stripe using the session id (cs_...).

GOAL
Fix the webhook code so that after a successful LIVE checkout, the email ALWAYS contains download buttons (one per purchased digital product) with correct Supabase ZIP URLs. No attachments. Just buttons linking to Supabase public ZIPs. Support multiple products + quantities.

DO NOT BREAK
- Keep Supabase for tier/service flows and for storing brand alignment quiz answers + customer records.
- Digital products delivery email must be sent immediately via Resend from the webhook (Option A), not from Supabase.
- Tier/service onboarding can remain routed to Supabase.

MUST-HAVE DIGITAL PRODUCT MAPPING (MATCH BY PRICE ID ONLY)
Use Stripe lineItem.price.id (NOT product names) and map it like this:

price_1T6jvhKLeJj1g28UvIxFbI3O → The Map Pack
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-map-pack/the-map-pack.zip

price_1T6jvrKLeJj1g28URaMIEaL3 → The Base Bundle
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-base-bundle/the-base-bundle.zip

price_1T6jvyKLeJj1g28UVyqmrr5U → The Cuticle Collection
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-cuticle-collection/the-cuticle-collection.zip

price_1T6jw5KLeJj1g28UcpqJcnvL → You Glow Girl Bundle
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/you-glow-girl-bundle/you-glow-girl-bundle.zip

price_1TCQF9KLeJj1g28Ui7ESZUAF → Fresh Out The Chair
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/fresh-out-the-chair/fresh-out-the-chair.zip

price_1TCQGHKLeJj1g28UJqHVf7wl → The Lash Collection
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip

ABSOLUTE REQUIRED FIX (LINE ITEMS)
In checkout.session.completed handler:
1) Get sessionId = event.data.object.id (cs_...).
2) Fetch the actual line items from Stripe API using sessionId.
   - Use Stripe SDK:
     stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 })
   OR fetch session with expand:
     stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items.data.price'] })
   (Either is fine as long as we reliably get line items + each item’s price.id + quantity.)

3) LOG THESE FOR DEBUG (MANDATORY):
   - console.log("SESSION ID:", sessionId)
   - console.log("LINE ITEMS COUNT:", lineItems.length)
   - console.log("LINE ITEM PRICE IDS:", lineItems.map(li => li.price?.id))
   - console.log("LINE ITEM QUANTITIES:", lineItems.map(li => li.quantity))
   This will confirm matching works.

DIGITAL PRODUCTS BUILD RULES
From Stripe line items:
- For each line item:
  - priceId = lineItem.price.id
  - quantity = lineItem.quantity (default 1)
- If priceId exists in mapping, add to digitalProducts list as:
  { productName, quantity, downloadUrl }
- If multiple of the same product are purchased:
  show ONE entry with quantity summed (xN) and ONE Download button.
- If cart includes multiple different digital products:
  show multiple buttons (one per product).

EMAIL REQUIREMENTS (DIGITAL DELIVERY)
- Send via Resend API from the webhook.
- Keep a clean transactional email.
- Must include:
  Title: “Download Your Files”
  For each digital product:
    “Product Name (xN if >1)” + DOWNLOAD button linking to downloadUrl.
- Include unzip help list.
- Remove “Links expire in 7 days” because Supabase public links do not expire.
- Use subject for final version:
  “Your download is ready (Order {saleId})”
- From:
  “AVERRA Deliveries <deliveries@averraaistudio.com>”
  (or keep hello@averraaistudio.com if that’s what’s verified, but do NOT add marketing links/social icons.)

FAILSAFE (MANDATORY)
If NO digital products matched:
- Still send an email that says:
  “We could not automatically match your download. Reply to this email and we’ll send it immediately.”
- Also log the unmatched price IDs so we can fix mapping.

IMPORTANT: STOP SENDING THE OLD EMPTY DOWNLOAD SECTION
Right now the email HTML shows “📥 Download Your Files” but nothing is inserted.
Ensure the HTML includes ${downloadButtonsHtml} inside that download section.
Also ensure the old generic email path is not used for digital products if matches exist.

KEEP SUPABASE (TIERS/SERVICES + RECORDS)
- Continue storing order record and quiz answers in Supabase.
- Continue tier/service welcome + calendly flows via Supabase.
- For mixed carts:
  - send DIGITAL download email via Vercel immediately
  - also trigger tier/service workflow as currently.

SUCCESS CRITERIA (HOW WE VERIFY)
After a LIVE purchase of “The Lash Collection”:
- Vercel logs show:
  LINE ITEMS COUNT > 0
  LINE ITEM PRICE IDS includes price_1TCQGHKLeJj1g28UJqHVf7wl
  digitalProducts is not empty
- Email arrives and contains a DOWNLOAD button.
- Button URL is exactly:
  https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip
- Clicking downloads ZIP successfully.

DO NOT ADD NEW PLATFORMS
No new services. No portals. Keep minimal and working.