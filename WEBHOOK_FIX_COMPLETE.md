# ✅ STRIPE WEBHOOK FIX - COMPLETE

## Problem
Stripe webhooks were failing with **401 "Missing authorization header"** error because:
- Supabase Edge Functions require JWT authentication by default
- Stripe webhooks only send `Stripe-Signature` header, not `Authorization` header
- Supabase's auth check happens BEFORE our code runs, so we couldn't bypass it

## Solution
Created a **Vercel API route** for webhooks instead of using Supabase Edge Functions.

### What Was Changed

1. **Created `/api/webhooks/stripe.ts`**
   - Vercel API route that handles Stripe webhooks
   - No authentication issues (Vercel doesn't require auth by default)
   - Verifies Stripe signature for security
   - Forwards to Supabase backend for email processing

2. **Updated `/vercel.json`**
   - Excluded `/api/*` routes from SPA rewrites
   - Allows API routes to work properly

3. **Installed packages**
   - `@vercel/node` - Vercel API route types
   - `stripe` - Stripe SDK for webhook verification

## 🚀 NEXT STEPS - CONFIGURE STRIPE

### 1. Update Stripe Webhook URL

Go to **Stripe Dashboard** → **Developers** → **Webhooks**

**UPDATE YOUR WEBHOOK ENDPOINT TO:**
```
https://www.averraaistudio.com/api/webhooks/stripe
```

(Replace `www.averraaistudio.com` with your actual Vercel domain)

### 2. Select Events

Make sure these events are selected:
- ✅ `checkout.session.completed`

### 3. Get Webhook Signing Secret

After creating the endpoint, Stripe will give you a **webhook signing secret** (starts with `whsec_`)

### 4. Add to Vercel Environment Variables

Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Add these if not already present:
- `STRIPE_SECRET_KEY` - Your Stripe secret key (sk_live_... or sk_test_...)
- `STRIPE_WEBHOOK_SECRET` - The webhook signing secret from step 3 (whsec_...)

### 5. Redeploy

After adding environment variables, redeploy your Vercel app:
```bash
git add .
git commit -m "Fix Stripe webhook endpoint"
git push
```

Or trigger a redeploy from Vercel Dashboard.

### 6. Test the Webhook

Once deployed:
1. Go to Stripe Dashboard → **Webhooks**
2. Click on your webhook endpoint
3. Click **"Send test webhook"**
4. Select `checkout.session.completed`
5. Click **Send test webhook**

You should see a **200 OK** response!

### 7. Resend Failed Events

For the events that failed before:
1. Go to Stripe Dashboard → **Webhooks** → **Events**
2. Find event `evt_1TD4fJKLeJj1g28UXgBT1ZnU`
3. Click **Resend**

The customer should receive their digital product email!

## How It Works

```
Stripe Webhook
    ↓
Vercel API Route (/api/webhooks/stripe)
    ↓ (verifies Stripe signature)
    ↓
Supabase Edge Function (/send-purchase-email)
    ↓ (sends email via Resend)
    ↓
Customer receives email with digital products
```

## Environment Variables Needed

Make sure these are set in **Vercel**:
- `STRIPE_SECRET_KEY` or `Stripe_Secret_Key`
- `STRIPE_WEBHOOK_SECRET`

And in **Supabase** (for the backend):
- `RESEND_API_KEY`
- `Stripe_Secret_Key`
- `STRIPE_WEBHOOK_SECRET`

## Testing

Test the webhook with:
```bash
curl -X POST https://www.averraaistudio.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{}'
```

You should get a 400 error about missing signature (which is correct - means the endpoint is working!)

---

**Status:** ✅ Ready to deploy and test
**Last Updated:** March 20, 2026
