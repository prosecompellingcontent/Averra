# VERCEL DEPLOYMENT CHECKLIST

## ✅ Pre-Deployment Code Fixes (COMPLETED)

1. **Node.js Version Configuration**
   - ✅ Added `"engines": { "node": "20.x" }` to `/package.json`
   - ✅ Set `@vercel/node@3.2.21` runtime in `/vercel.json` for API functions
   - ✅ This forces Node.js 20.x regardless of Vercel project settings

2. **TypeScript & Build Configuration**
   - ✅ Created `/tsconfig.json` with path alias configuration
   - ✅ Created `/tsconfig.node.json` for Vite config
   - ✅ Updated `/vite.config.ts` with path alias resolution for `@/` imports
   - ✅ Increased chunk size warning limit to 1000kb
   - ✅ Added manual chunk splitting for better build optimization

3. **Stripe API Version Consistency**
   - ✅ Updated Vercel webhook (`/api/webhooks/stripe.ts`) to use `apiVersion: "2026-02-25.clover"`
   - ✅ Updated Supabase backend (`/supabase/functions/server/index.tsx`) to use Stripe v20.4.1 with `apiVersion: "2026-02-25.clover"`
   - ✅ Both now use the same Stripe package version and API version

4. **Removed Conflicting Files**
   - ✅ Deleted `/api/package.json` (was causing module conflicts)
   - ✅ Deleted `/api/tsconfig.json` (not needed, using root config)

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Push to Vercel
```bash
git add .
git commit -m "Fix Node.js version, TypeScript config, and Stripe API alignment"
git push
```

### Step 2: Configure Vercel Environment Variables
Go to: https://vercel.com/your-project/settings/environment-variables

**REQUIRED:** Add/verify these environment variables:
- ✅ `STRIPE_SECRET_KEY` (or `Stripe_Secret_Key`) - Already added
- ✅ `STRIPE_PUBLISHABLE_KEY` - Already added
- ⚠️  `STRIPE_WEBHOOK_SECRET` - **MUST ADD THIS** (from Stripe Dashboard)

**How to get STRIPE_WEBHOOK_SECRET:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Find your webhook endpoint
3. Click "Reveal" under "Signing secret"
4. Copy the value (starts with `whsec_`)
5. Add to Vercel environment variables

### Step 3: Update Stripe Webhook URL
Go to: https://dashboard.stripe.com/webhooks

1. Find your webhook endpoint
2. Update the URL to: `https://www.averraaistudio.com/api/webhooks/stripe`
3. Make sure these events are selected:
   - `checkout.session.completed`

### Step 4: Verify Deployment
After deployment completes:

1. **Check Build Logs** - Ensure no errors
2. **Test Webhook Endpoint**
   ```bash
   curl -X POST https://www.averraaistudio.com/api/webhooks/stripe
   ```
   Should return: `{"error":"Method POST not allowed. Expected POST."}` or signature error (this is good!)

3. **View Vercel Function Logs**
   - Go to: https://vercel.com/your-project/logs
   - Filter by: `/api/webhooks/stripe`

### Step 5: Resend Failed Stripe Event
Go to: https://dashboard.stripe.com/events

1. Find event `evt_1TD4fJKLeJj1g28UXgBT1ZnU`
2. Click "Resend event" or "Send test webhook"
3. Monitor Vercel function logs for:
   - ✅ "🔔 WEBHOOK RECEIVED FROM STRIPE!"
   - ✅ "✅ Webhook verified: checkout.session.completed"
   - ✅ "✅ Email processing successful"

4. **Check customer's email** (Jayla Smith) for:
   - Purchase confirmation email
   - Digital product attachments (3 images)
   - Commercial license

---

## 🔍 TROUBLESHOOTING

### If webhook fails with "Invalid signature":
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Ensure webhook URL is exactly: `https://www.averraaistudio.com/api/webhooks/stripe`
- Check Vercel logs for error details

### If build fails:
- Check for TypeScript errors in build logs
- Verify all imports use correct path aliases (`@/app/...`)
- Ensure all environment variables are set

### If Node.js version warning appears:
- The warning is expected - package.json `engines` field overrides Vercel settings
- As long as it says "Node.js Version 20.x will be used", you're good

### If email doesn't send:
- Check Supabase function logs: https://supabase.com/dashboard/project/zfzwknmljpotidwyoefk/logs
- Verify `RESEND_API_KEY` is set in Supabase secrets
- Check Resend dashboard for delivery status

---

## 📋 ENVIRONMENT VARIABLES CHECKLIST

### Vercel (Frontend & API Routes)
- [x] STRIPE_SECRET_KEY
- [x] STRIPE_PUBLISHABLE_KEY
- [ ] **STRIPE_WEBHOOK_SECRET** ← **ADD THIS NOW**

### Supabase (Edge Functions)
- [x] Stripe_Secret_Key
- [x] RESEND_API_KEY
- [x] SUPABASE_URL
- [x] SUPABASE_ANON_KEY
- [x] SUPABASE_SERVICE_ROLE_KEY

---

## ✅ POST-DEPLOYMENT VERIFICATION

1. [ ] Site loads at https://www.averraaistudio.com
2. [ ] Shopping cart works
3. [ ] Checkout flow completes
4. [ ] Webhook receives events (check Vercel logs)
5. [ ] Emails are sent (check Resend dashboard)
6. [ ] Customer receives digital products

---

## 🎯 FINAL NOTES

**The webhook will work once you:**
1. Add `STRIPE_WEBHOOK_SECRET` to Vercel environment variables
2. Redeploy (Vercel auto-redeploys when you add env vars)
3. Resend the failed event from Stripe Dashboard

**Current Status:**
- ✅ Code is fixed and ready
- ✅ Node.js version enforced to 20.x
- ✅ TypeScript config properly set up
- ✅ Stripe API versions aligned
- ⏳ Waiting for: Webhook secret + deployment

**No more errors should occur after following these steps!**
