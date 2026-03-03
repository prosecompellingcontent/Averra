# 🚀 AVERRA AI MODEL STUDIO - Deployment Guide

## ✅ Pre-Deployment Checklist

### Step 1: Prepare Your Repository
- [ ] Push all code to GitHub (create a repo if you haven't)
- [ ] Ensure all files are committed
- [ ] Verify `.gitignore` excludes sensitive files

### Step 2: Choose Hosting Platform (Recommended: Vercel)

#### **VERCEL DEPLOYMENT** (Easiest - 5 minutes)

1. **Sign Up / Log In**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select your AVERRA repository
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   RESEND_API_KEY=your_resend_api_key (if using email)
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `averra-ai.vercel.app`

5. **Add Your Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `averraai.com` or `www.averraai.com`)
   - Vercel will show you DNS records to add

### Step 3: Update DNS Records

**At Your Domain Registrar (where you bought the domain):**

For **apex domain** (averraai.com):
```
Type: A
Name: @
Value: 76.76.21.21
```

For **www subdomain** (www.averraai.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**⏰ DNS propagation takes 1-48 hours** (usually 15-30 minutes)

### Step 4: Configure Supabase for Production

1. **Update Supabase Site URL**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: Add `https://yourdomain.com/**`

2. **Update Edge Function URLs** (if using auth/social login)
   - No changes needed - already configured with dynamic URLs

### Step 5: Switch Stripe to Live Mode

1. **Get Live API Keys**
   - Go to Stripe Dashboard
   - Toggle from "Test mode" to "Live mode" (top right)
   - Go to Developers → API Keys
   - Copy **Publishable key** and **Secret key**

2. **Update Environment Variables in Vercel**
   - Go to Vercel Project → Settings → Environment Variables
   - Update `STRIPE_SECRET_KEY` with live secret key
   - Update `STRIPE_PUBLISHABLE_KEY` with live publishable key
   - Redeploy (Vercel → Deployments → Three dots → Redeploy)

3. **Update Webhook Endpoint**
   - Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhook` (if you have one)
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`

### Step 6: Test Everything

- [ ] Visit your live domain
- [ ] Test mobile responsiveness
- [ ] Add item to cart
- [ ] Complete a test purchase (use Stripe test card: `4242 4242 4242 4242`)
- [ ] Check analytics dashboard at `/analytics`
- [ ] Test all navigation links
- [ ] Verify images load correctly
- [ ] Test contact form (if applicable)

### Step 7: Final Production Tweaks

1. **Update Any Hardcoded URLs**
   - Search codebase for `localhost` or `127.0.0.1`
   - Replace with production domain

2. **Enable Analytics** (Optional)
   - Add Google Analytics
   - Add Facebook Pixel
   - Your built-in Supabase analytics already work!

3. **Set Up Monitoring** (Optional)
   - Vercel Analytics (free with account)
   - Sentry for error tracking
   - Supabase logs

## 🎯 Quick Reference

### Current Setup
- ✅ Cart system with local storage
- ✅ Stripe payment integration (test mode)
- ✅ Supabase backend (auth, database, storage)
- ✅ Real-time analytics at `/analytics`
- ✅ Mobile optimized
- ✅ Responsive design

### Monthly Costs (Estimated)
- Vercel: **FREE** (Hobby tier)
- Supabase: **FREE** (up to 500MB DB + 2GB storage)
- Stripe: **2.9% + $0.30** per transaction
- Domain: Already paid!

### Support Resources
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs

## 🚨 Common Issues

**Issue:** "Site not found" after deploying
- **Solution:** Wait for DNS propagation (up to 48 hours)

**Issue:** Stripe payments not working
- **Solution:** Verify you updated BOTH keys (secret + publishable) and redeployed

**Issue:** Analytics not tracking
- **Solution:** Check SUPABASE_URL and SUPABASE_ANON_KEY are correct

**Issue:** Images not loading
- **Solution:** Verify image imports use correct paths and Unsplash API isn't rate-limited

## 📱 Post-Launch Checklist

- [ ] Share on social media
- [ ] Set up Google Search Console
- [ ] Submit sitemap to Google
- [ ] Monitor analytics for first week
- [ ] Collect user feedback
- [ ] Plan v2 features

---

## 🎉 YOU'RE LIVE!

Once DNS propagates and everything tests successfully, your luxury AVERRA AI MODEL STUDIO is officially live and accepting real payments!

**Need help?** Check Vercel deployment logs or Supabase logs for any errors.
