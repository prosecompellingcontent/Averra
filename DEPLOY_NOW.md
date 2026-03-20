# 🚀 DEPLOY NOW - QUICK STEPS

## ✅ FIXED: File Conflict Error

**Problem:** Had both `.ts` and `.js` versions of webhook  
**Solution:** Deleted `.js` version, kept TypeScript only

---

## 📋 DO THIS RIGHT NOW (5 MINUTES)

### 1. Push to Vercel
```bash
git add .
git commit -m "Fix Stripe webhook - single TS handler with proper routing"
git push
```

### 2. Wait for deployment to complete
Check Vercel dashboard - wait for green checkmark ✅

### 3. Go to Stripe Dashboard
**Developers** → **Webhooks** → Edit your webhook

**Change URL to:**
```
https://www.averraaistudio.com/api/webhooks/stripe
```

**Copy the webhook signing secret** (starts with `whsec_...`)

### 4. Add Environment Variable to Vercel
**Vercel Dashboard** → **Settings** → **Environment Variables**

Add this variable:
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_... (paste the secret from Step 3)
Environment: Production, Preview, Development (select all)
```

Click **Save**

### 5. Redeploy
After adding the env var, you MUST redeploy:

**Option A:** Push an empty commit
```bash
git commit --allow-empty -m "Trigger redeploy for env vars"
git push
```

**Option B:** Manual redeploy in Vercel Dashboard  
**Deployments** → Latest → **...** → **Redeploy**

### 6. Test with Stripe
**Stripe Dashboard** → **Webhooks** → Your webhook → **Send test webhook**

Select `checkout.session.completed` → **Send**

**Expected:** ✅ **200 OK**

### 7. Resend Failed Event
**Stripe Dashboard** → **Webhooks** → **Events**

Find: `evt_1TD4fJKLeJj1g28UXgBT1ZnU`  
Click **Resend**

---

## 🎯 EXPECTED RESULTS

✅ Webhook receives 200 OK from Stripe  
✅ Vercel function logs show successful processing  
✅ Supabase backend receives the request  
✅ Customer (Iamjaylamay@gmail.com) receives email with digital product  

---

## 🔍 IF SOMETHING GOES WRONG

### Check Vercel Logs
**Vercel Dashboard** → **Deployments** → Latest → **Functions** → `api/webhooks/stripe`

Look for:
```
🔔 WEBHOOK RECEIVED FROM STRIPE!
📍 Request Method: POST
✅ Webhook verified: checkout.session.completed
```

### Check Supabase Logs
**Supabase Dashboard** → **Edge Functions** → Logs

Look for email sending success/error

### Still Getting 405?
Make sure Stripe webhook URL is exactly:
```
https://www.averraaistudio.com/api/webhooks/stripe
```
NO trailing slash!

### Still Getting 400?
Make sure `STRIPE_WEBHOOK_SECRET` is set in Vercel and you redeployed after adding it

---

## 📞 CUSTOMER WAITING

**Customer:** Jayla Smith  
**Email:** Iamjaylamay@gmail.com  
**Purchase:** Digital Product ($30)  
**Event ID:** evt_1TD4fJKLeJj1g28UXgBT1ZnU  
**Time:** Mar 20, 2026, 10:08 AM CDT

This customer completed payment but hasn't received their digital product email yet. After you complete the steps above and resend the event, they'll get their email! 🎉

---

**Total Time:** ~5 minutes  
**Status:** Ready to deploy NOW ✅
