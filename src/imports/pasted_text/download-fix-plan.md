FIX “DATABASE QUERY FAILED” + EMPTY DOWNLOADS ON /downloads (END-TO-END)

PROBLEM
The /downloads page unlock flow runs, but after entering the email:
- It shows “database query failed” OR
- It unlocks but shows no files/photos (downloads array is empty)

This means ONE of these is true:
1) /api/downloads/lookup cannot successfully query Supabase orders (env vars / permissions / table/columns mismatch)
2) The orders row exists but `items` JSON does not contain productId values, so mapping can’t produce ZIP URLs
3) The order is not being written to Supabase at purchase time, so lookup can’t find it

GOAL
When a customer visits:
https://www.averraaistudio.com/downloads?session_id=cs_live_...
and enters their checkout email, the page must show download cards/buttons for every digital product in that purchase.

REQUIRED CHECKS + FIXES

PART A — MAKE /api/downloads/lookup RETURN REAL ERRORS (NO VAGUE MESSAGE)
1) In /api/downloads/lookup.ts (or .js), ensure ALL Supabase REST failures return an exact error message and status:
- If Supabase REST returns non-OK, return:
  { error: "Supabase query failed", status: <status>, detail: <responseText> }
Do not show only “database query failed” without details.
Add console.error logs:
- log the full Supabase URL (without keys)
- log status code + response body from Supabase

2) Confirm the endpoint is POST-only and frontend calls POST with JSON:
{ session_id, email }

PART B — VERIFY VERCEL ENV VARS (MOST COMMON ROOT CAUSE)
In Vercel project env vars (Production), ensure:
- SUPABASE_URL = https://zfzwknmljpotidwyoefk.supabase.co
- SUPABASE_SERVICE_ROLE_KEY = <service role key>
Redeploy after changes.
If SUPABASE_SERVICE_ROLE_KEY is missing/wrong, Supabase REST will fail (401/403).

PART C — VERIFY SUPABASE TABLE + COLUMN NAMES MATCH QUERY
The lookup query must match your actual schema.
Current query expects:
orders table with columns:
- session_id (text)
- customer_email (text)
- customer_name (text nullable)
- items (jsonb)
- has_service (boolean nullable)
If your table uses different names (sessionId/customerEmail/hasService), then update the REST select query accordingly.
Example select string must match real columns.

PART D — ENSURE ORDER RECORDS ARE BEING WRITTEN ON PURCHASE (SO LOOKUP CAN FIND ITEMS)
1) Locate the code that runs on successful Stripe checkout completion:
- /api/webhooks/stripe.ts forwards to Supabase send-purchase-email
- The system must insert/update a row in Supabase `orders` table at purchase time.

2) If orders rows are not being created, implement this:
- On checkout.session.completed:
  a) fetch line items from Stripe
  b) normalize items array
  c) upsert into Supabase orders:
     session_id, customer_email, customer_name, items, has_service/has_digital

PART E — FIX “NO FILES SHOW” BY ENSURING items JSON CONTAINS productId
This is the #1 reason downloads list is empty even when the database query works.

1) The webhook must store items like:
[
  { "productId": "prod_UAlnkF1MY2zjzW", "name": "The Lash Collection", "quantity": 1 },
  ...
]
NOT just name/price/quantity alone.

2) Update order-writing code (webhook / purchase handler) so each item includes:
- productId (prod_...) from Stripe line item expanded product
- quantity
- name

3) Update /api/downloads/lookup to accept BOTH:
- productId (camelCase)
- product_id (snake_case)
and map using productId.

PART F — DIGITAL PRODUCT MAPPING (PRODUCT ID -> SUPABASE ZIP URL)
Use this exact mapping (prod_... is stable, price_... can change):

prod_U4tjELgIEdNp8R -> https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-map-pack/the-map-pack.zip
prod_U4tj3TpmVuEi6v -> https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-base-bundle/the-base-bundle.zip
prod_U4tjFfvIwptjfn -> https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-cuticle-collection/the-cuticle-collection.zip
prod_U4tjvZqmdppfZE -> https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/you-glow-girl-bundle/you-glow-girl-bundle.zip
prod_UAlmvz04pAYbco -> https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/fresh-out-the-chair/fresh-out-the-chair.zip
prod_UAlnkF1MY2zjzW -> https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip

Aggregate quantities: if same productId appears multiple times, sum quantity and show one download card (xN).

PART G — FRONTEND /downloads MUST DISPLAY WHAT API RETURNS
1) On success (200):
- Render a card per downloads[] entry with:
  name, (xN), button to zipUrl
2) If downloads[] is empty:
- Show message: “No digital downloads found for this order.”
- Also log the entire API response in console for debugging.

FINAL ACCEPTANCE TEST
1) Make a live purchase of “The Lash Collection”.
2) Confirm Supabase orders table has a row with:
   session_id = cs_live_...
   customer_email = buyer email
   items includes productId = prod_UAlnkF1MY2zjzW
3) Open /downloads?session_id=cs_live_...
4) Enter same email
5) Page shows “The Lash Collection (x1)” with a Download button to:
   https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/digital-products/the-lash-collection/the-lash-collection.zip
6) No “database query failed” errors.

DELIVERABLE
Commit + deploy fixes for:
- /api/downloads/lookup (accurate errors + stable mapping + accepts productId keys)
- purchase flow that writes orders.items with productId
- /downloads page rendering and clear messages