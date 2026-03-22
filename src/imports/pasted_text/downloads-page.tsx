BUILD THE /downloads REDIRECT PAGE (OPTION C) — COMPLETE IMPLEMENTATION PROMPT FOR FIGMA

GOAL
Create a new page on the live site that customers land on after clicking the email button:
https://www.averraaistudio.com/downloads?session_id=cs_live_...

This page must securely unlock and display the exact digital products the customer purchased (supports multiple products + quantities) and provide ZIP download buttons (Supabase public URLs).

CONTEXT (EXISTING)
- Site is a Vite/React SPA on Vercel.
- Stripe webhook already fires and sends a Resend template email with DOWNLOAD_URL.
- Supabase function currently sends the email and can pass session_id.
- Supabase Storage bucket digital-products is PUBLIC, ZIP files exist.
- Customers may buy multiple digital products and/or service tiers.

REQUIREMENTS (MUST)
1) Frontend Page
- Add route/page: /downloads
- Reads query param: session_id
- If session_id is missing, show a clear error: “Missing session link. Please use the link from your email.”

2) Security (simple + effective)
- Page must show an “Unlock Downloads” form requiring the customer to enter the email used at checkout.
- Only after email matches the stored order record should downloads be displayed.
- Do NOT require login/accounts.

3) Backend API (serverless function on Vercel)
Create endpoint: POST /api/downloads/lookup
Request JSON:
{
  "session_id": "cs_live_...",
  "email": "customer@email.com"
}

Response JSON (success):
{
  "customer_name": "Customer Name",
  "downloads": [
    { "name": "The Lash Collection", "quantity": 1, "zipUrl": "https://...zip" },
    ...
  ],
  "has_service": false
}

Failure responses:
- 400 if missing session_id/email
- 403 if email does not match
- 404 if session_id not found

4) Data Source
Primary source must be Supabase “orders” record keyed by session_id.
- Ensure Supabase stores an order record when checkout completes:
  orders.session_id (unique)
  orders.customer_email
  orders.customer_name
  orders.items (jsonb array containing at least productId/name/quantity)
  orders.has_digital
  orders.has_service

If order record doesn’t exist, backend may optionally self-heal by fetching Stripe line items via session_id and then upserting to Supabase, but only if Stripe keys are available server-side.

5) Product-to-ZIP URL mapping (stable)
Do NOT match by Stripe priceId. Match by Stripe productId (prod_...) to avoid pricing changes breaking downloads.
Mapping:

prod_U4tjELgIEdNp8R -> The Map Pack
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-map-pack/the-map-pack.zip

prod_U4tj3TpmVuEi6v -> The Base Bundle
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-base-bundle/the-base-bundle.zip

prod_U4tjFfvIwptjfn -> The Cuticle Collection
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-cuticle-collection/the-cuticle-collection.zip

prod_U4tjvZqmdppfZE -> You Glow Girl Bundle
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/you-glow-girl-bundle/you-glow-girl-bundle.zip

prod_UAlmvz04pAYbco -> Fresh Out The Chair
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/fresh-out-the-chair/fresh-out-the-chair.zip

prod_UAlnkF1MY2zjzW -> The Lash Collection
https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip

6) Display Logic (UX)
After successful unlock:
- Show header: “Your downloads”
- Show each product in a clean card:
  - Product name
  - quantity label (xN if quantity > 1)
  - “Download” button pointing to zipUrl
- If multiple digital products purchased, show multiple cards.
- Add unzip instructions on the page:
  - iPhone/iPad: Files → Downloads → tap ZIP
  - Android: Files/Downloads → Extract
  - Mac: double-click ZIP
  - Windows: Extract All
  - Chromebook: Files app → Extract

If has_service = true:
- Add “Next steps” section below downloads:
  - Show Calendly link (use existing site calendly link)
  - Confirm brand alignment quiz status if available, otherwise link to quiz

7) Non-Blank Guarantee
Page must never appear empty.
- Missing session_id -> show clear message
- Wrong email -> show clear message
- No downloads found -> show clear message + “Reply to the purchase email for help”

8) Environment Variables (Vercel)
Backend endpoint must read:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (server-side only)
- (optional) STRIPE_SECRET_KEY if implementing self-heal fetch from Stripe

DELIVERABLES
- New frontend page /downloads in React with the unlock form and downloads display.
- New Vercel serverless endpoint /api/downloads/lookup that validates email + returns downloads list.
- Centralized productId->zip mapping in one place used by the backend response.
- Works for multiple products + quantities.

SUCCESS TEST
1) Complete a live purchase.
2) Click email button -> opens /downloads?session_id=cs_live_...
3) Enter the same email used at checkout.
4) Page shows correct products and download buttons.
5) Clicking download immediately downloads ZIP from Supabase.
6) Multi-item cart shows multiple cards. Quantity displays correctly.