# 🎯 AVERRA AI STUDIO - Launch Instructions for averraaistudio.com

## 🚀 FASTEST PATH TO LIVE (15 Minutes)

### Step 1: Deploy to Vercel (5 minutes)

1. **Go to [vercel.com](https://vercel.com/signup)** and sign in with GitHub

2. **Click "Add New Project"** → Import your AVERRA repository

3. **Configure Build Settings** (should auto-detect):
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build` or `pnpm build`
   - Output Directory: `dist`

4. **Add Environment Variables** (click "Environment Variables" before deploying):
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   STRIPE_SECRET_KEY=sk_test_... (your test key for now)
   STRIPE_PUBLISHABLE_KEY=pk_test_... (your test key for now)
   ```

5. **Click "Deploy"** → Wait 2-3 minutes
   - You'll get a temporary URL like: `averra-ai-studio.vercel.app`
   - Test it works before adding your domain!

---

### Step 2: Connect Your Domain (5 minutes)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click **Settings** → **Domains**
   - Add `averraaistudio.com`
   - Add `www.averraaistudio.com`

2. **Vercel will show you DNS records to add**

---

### Step 3: Update DNS Records (5 minutes)

**Go to your domain registrar** (where you bought averraaistudio.com - GoDaddy, Namecheap, Cloudflare, etc.)

#### For Root Domain (averraaistudio.com):

**Option A - If your registrar supports CNAME flattening:**
```
Type: CNAME
Name: @ (or leave blank)
Value: cname.vercel-dns.com
TTL: Automatic or 3600
```

**Option B - If CNAME doesn't work, use A record:**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: Automatic or 3600
```

#### For WWW Subdomain (www.averraaistudio.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Automatic or 3600
```

**⏰ Wait 15-60 minutes** for DNS to propagate (sometimes instant, can take up to 48 hours)

---

### Step 4: Configure Supabase for Production Domain

1. **Go to [Supabase Dashboard](https://app.supabase.com)**
2. Select your AVERRA project
3. Go to **Authentication** → **URL Configuration**
4. Update:
   - **Site URL:** `https://averraaistudio.com`
   - **Redirect URLs:** Add:
     - `https://averraaistudio.com/**`
     - `https://www.averraaistudio.com/**`
5. Click **Save**

---

### Step 5: Test Your Live Site

Once DNS propagates (check at [dnschecker.org](https://dnschecker.org)):

- [ ] Visit `https://averraaistudio.com`
- [ ] Test mobile view
- [ ] Add products to cart
- [ ] Complete test checkout (use test card: `4242 4242 4242 4242`)
- [ ] Visit `/analytics` dashboard
- [ ] Check that banner rotates on mobile ✅
- [ ] Test all page navigation

---

### Step 6: Switch to Live Stripe Payments (AFTER TESTING)

**⚠️ Only do this when you're ready to accept real money!**

1. **Get Live Stripe Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Toggle from **Test mode** to **Live mode** (top right)
   - Go to **Developers** → **API keys**
   - Copy:
     - **Publishable key** (starts with `pk_live_...`)
     - **Secret key** (starts with `sk_live_...`)

2. **Update Vercel Environment Variables:**
   - Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
   - Edit `STRIPE_SECRET_KEY` → Replace with `sk_live_...`
   - Edit `STRIPE_PUBLISHABLE_KEY` → Replace with `pk_live_...`
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click three dots on latest deployment
   - Click **Redeploy**
   - Wait 2 minutes

4. **Set Up Stripe Webhook** (for order confirmation):
   - Stripe Dashboard → **Developers** → **Webhooks**
   - Click **Add endpoint**
   - Endpoint URL: `https://averraaistudio.com/api/stripe-webhook` (if you have webhook handler)
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy webhook secret and add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

---

## 🎉 YOU'RE LIVE!

Your luxury AVERRA AI MODEL STUDIO is now live at:
- **https://averraaistudio.com** ✨
- **https://www.averraaistudio.com** ✨

---

## 📊 Post-Launch Checklist

### Week 1:
- [ ] Monitor analytics at `/analytics`
- [ ] Test purchases on real devices
- [ ] Share on Instagram/TikTok
- [ ] Collect customer feedback

### SEO Setup:
- [ ] Add Google Analytics (optional)
- [ ] Submit to Google Search Console
- [ ] Create sitemap
- [ ] Add meta descriptions

### Marketing:
- [ ] Launch announcement on social media
- [ ] Email existing clients about launch pricing
- [ ] Create Instagram stories showcasing products
- [ ] Partner with beauty influencers

---

## 🆘 Troubleshooting

**"Site not found" error:**
- DNS hasn't propagated yet → Wait up to 48 hours
- Check DNS at [dnschecker.org](https://dnschecker.org)

**Stripe payments failing:**
- Make sure you updated BOTH keys (secret + publishable)
- Check you redeployed after updating env vars

**Analytics not working:**
- Verify Supabase keys are correct in Vercel
- Check Supabase logs for errors

**Banner not rotating on mobile:**
- Already fixed! ✅ The `disableOnMobile={false}` prop is set

---

## 💰 Current Pricing (March 3rd to May 31st, 2026)

**Branding Services:**
- AVERRA Essentials: $100 (reg. $200)
- AVERRA Signature: $250 (reg. $350)  
- AVERRA Muse: $400 (reg. $500)

**Digital Products:**
- The Map Pack (Brow): $40
- The Blend Bundle (Makeup): $30
- Fresh Out The Chair (Hair): $35
- The Polished Pack (Nail): $30
- You Glow Girl Bundle (Esthetics): $35

---

## 📞 Need Help?

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Stripe Support:** [support.stripe.com](https://support.stripe.com)

---

**Ready to launch? Start with Step 1! 🚀**
