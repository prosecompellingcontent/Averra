# AVERRA AI MODEL STUDIO - Deployment Guide

## Complete Step-by-Step Guide to Launch Your Site

This guide will walk you through deploying your AVERRA site to the web with a custom domain. Estimated time: 30-60 minutes.

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Registering Your Domain](#registering-your-domain)
3. [Preparing Your Code](#preparing-your-code)
4. [Deploying to Vercel](#deploying-to-vercel)
5. [Connecting Your Domain](#connecting-your-domain)
6. [Setting Up Stripe for Production](#setting-up-stripe-for-production)
7. [Testing Your Live Site](#testing-your-live-site)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] A GitHub account (free - sign up at github.com)
- [ ] Your code ready to deploy
- [ ] A credit card for domain registration (~$10-15/year)
- [ ] Your Stripe account set up (if using payments)
- [ ] All contact information (name, email, phone) ready for domain registration

---

## Registering Your Domain

### Step 1: Choose Your Domain Name

**Recommended domains for AVERRA:**
- `averraai.com` (professional, clear)
- `averra.studio` (creative, modern)
- `averrabrand.com` (brand-focused)
- `shopaverra.com` (if emphasizing products)

**Tips:**
- Keep it short and memorable
- Avoid hyphens and numbers
- Make sure it's easy to spell

### Step 2: Check Domain Availability

Go to any of these registrars and search for your desired domain:

**Recommended Registrars:**

1. **Namecheap** (namecheap.com) - Best overall value
   - Price: ~$8-13/year for .com
   - Free WHOIS privacy included
   - Easy to use interface

2. **Porkbun** (porkbun.com) - Budget-friendly
   - Price: ~$9-11/year for .com
   - Free WHOIS privacy
   - Simple dashboard

3. **Google Domains / Squarespace Domains** (domains.google.com)
   - Price: ~$12/year for .com
   - Clean interface
   - Google integration

### Step 3: Purchase Your Domain

Using **Namecheap** as an example:

1. Go to **namecheap.com**
2. Search for your domain (e.g., "averraai.com")
3. If available, click **"Add to cart"**
4. **Important settings during checkout:**
   - ✅ Enable "WhoisGuard" (free privacy protection - keeps your personal info private)
   - ❌ Skip "Premium DNS" (not needed)
   - ❌ Skip "SSL Certificate" (Vercel provides this free)
   - ❌ Skip email hosting (can add later if needed)
5. Select **1 year** to start (you can set auto-renew)
6. Create an account and complete purchase
7. **Save your login credentials securely**

**After Purchase:**
- Check your email for confirmation
- Log into your registrar's dashboard
- You should see your domain listed

---

## Preparing Your Code

### Step 1: Create a GitHub Account

1. Go to **github.com**
2. Click **"Sign up"**
3. Follow the steps (use your professional email)
4. Verify your email address

### Step 2: Install Git (if needed)

**On Mac:**
- Open Terminal
- Type: `git --version`
- If not installed, it will prompt you to install

**On Windows:**
- Download from **git-scm.com**
- Install with default settings

### Step 3: Push Your Code to GitHub

**If your code is not already on GitHub:**

1. Open Terminal/Command Prompt
2. Navigate to your project folder:
   ```bash
   cd path/to/your/averra-project
   ```

3. Initialize Git (if not already done):
   ```bash
   git init
   ```

4. Add all files:
   ```bash
   git add .
   ```

5. Commit your files:
   ```bash
   git commit -m "Initial commit - AVERRA site ready for deployment"
   ```

6. Create a new repository on GitHub:
   - Go to **github.com** and log in
   - Click the **"+"** icon (top right) → **"New repository"**
   - Name it: `averra-site` (or your preference)
   - Keep it **Private** (recommended for client projects)
   - **Do NOT** initialize with README, .gitignore, or license
   - Click **"Create repository"**

7. Connect your local code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/averra-site.git
   git branch -M main
   git push -u origin main
   ```
   (Replace YOUR-USERNAME with your actual GitHub username)

8. Refresh your GitHub repository page - you should see all your files!

---

## Deploying to Vercel

Vercel is a hosting platform that's perfect for React applications. It's free for personal/small projects and handles everything automatically.

### Step 1: Create a Vercel Account

1. Go to **vercel.com**
2. Click **"Sign Up"**
3. **Choose "Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub account
5. You'll be taken to your Vercel dashboard

### Step 2: Import Your Project

1. On your Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find your `averra-site` repository
4. Click **"Import"**

### Step 3: Configure Your Project

Vercel will detect that this is a Vite + React project automatically.

**Build & Development Settings:**
- **Framework Preset:** Vite (should auto-detect)
- **Build Command:** `npm run build` or `pnpm build`
- **Output Directory:** `dist` (should be auto-filled)
- **Install Command:** `npm install` or `pnpm install`

**Root Directory:**
- Leave as `./` (root)

### Step 4: Environment Variables (if using Stripe)

If you're using Stripe payments, you need to add your Stripe keys:

1. Scroll down to **"Environment Variables"**
2. Add these variables:

   | Name | Value | Where to Find |
   |------|-------|---------------|
   | `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Stripe Dashboard → Developers → API keys |

**How to get your Stripe keys:**
1. Go to **dashboard.stripe.com**
2. Log in to your Stripe account
3. Click **"Developers"** in the left sidebar
4. Click **"API keys"**
5. Copy the **"Publishable key"** (starts with `pk_live_...` for production or `pk_test_...` for testing)
6. **Important:** Start with TEST keys, switch to LIVE keys only when ready to accept real payments

### Step 5: Deploy!

1. Click **"Deploy"**
2. Vercel will now:
   - Install all your packages
   - Build your application
   - Deploy it to a temporary URL
3. This takes 2-5 minutes
4. You'll see a **"Congratulations"** screen with confetti! 🎉

### Step 6: View Your Live Site

1. Click **"Visit"** or click the screenshot
2. Your site is now live at a URL like: `averra-site.vercel.app`
3. **Test everything:**
   - Navigate through all pages
   - Check that images load
   - Test the cart functionality
   - Try the contact form

---

## Connecting Your Domain

Now let's connect your custom domain (like `averraai.com`) to your Vercel site.

### Step 1: Add Domain in Vercel

1. In your Vercel project dashboard, click **"Settings"** (top navigation)
2. Click **"Domains"** in the left sidebar
3. In the input field, type your domain: `averraai.com` (without www)
4. Click **"Add"**
5. Vercel will show you DNS configuration instructions

### Step 2: Configure DNS at Your Domain Registrar

**For Namecheap (most common):**

1. Log into **namecheap.com**
2. Click **"Domain List"** in the left sidebar
3. Find your domain and click **"Manage"**
4. Scroll to **"Nameservers"** section
5. Select **"Custom DNS"** from the dropdown
6. Vercel will give you nameservers to use (if you chose this method)

**OR use A Records (recommended for beginners):**

1. On the Manage domain page, click **"Advanced DNS"** tab
2. Click **"Add New Record"**
3. Add these records exactly as shown:

   **Record 1:**
   - Type: `A Record`
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: Automatic

   **Record 2:**
   - Type: `CNAME`
   - Host: `www`
   - Value: `cname.vercel-dns.com.`
   - TTL: Automatic

4. **Delete any existing A records** pointing to parking pages
5. Click **"Save Changes"** (green checkmark)

### Step 3: Verify Domain in Vercel

1. Go back to Vercel → Settings → Domains
2. Vercel will automatically check your DNS settings
3. You'll see a **"Pending"** status - this is normal
4. DNS propagation takes **10 minutes to 48 hours** (usually ~1-2 hours)
5. Vercel will automatically issue a free SSL certificate (HTTPS)

### Step 4: Add www Subdomain (Optional but Recommended)

1. In Vercel Domains settings, add `www.averraai.com`
2. Set it to **"Redirect to averraai.com"**
3. This ensures both `averraai.com` and `www.averraai.com` work

---

## Setting Up Stripe for Production

⚠️ **Important:** Only do this when you're ready to accept REAL payments with REAL money.

### Step 1: Activate Your Stripe Account

1. Go to **dashboard.stripe.com**
2. Complete your business profile:
   - Business type (Individual or Company)
   - Your personal information
   - Bank account details (for receiving payouts)
   - Tax information (EIN or SSN)
3. Submit for review (may take 1-2 business days)

### Step 2: Switch to Live Mode

1. In Stripe dashboard, toggle from **"Test mode"** to **"Live mode"** (top right)
2. Go to **"Developers"** → **"API keys"**
3. Copy your **LIVE Publishable key** (starts with `pk_live_...`)

### Step 3: Update Vercel Environment Variables

1. Go to your Vercel project
2. Click **"Settings"** → **"Environment Variables"**
3. Find `VITE_STRIPE_PUBLISHABLE_KEY`
4. Click **"Edit"**
5. Replace the test key with your **live key**
6. Click **"Save"**
7. Click **"Redeploy"** to apply changes

### Step 4: Test Your Production Payments

1. Visit your live site
2. Add an item to cart
3. Go to checkout
4. Use a **REAL credit card** (yours or a friend's - with permission!)
5. Complete the transaction
6. Verify in Stripe Dashboard that the payment appears
7. **Immediately refund your test payment** in Stripe

---

## Testing Your Live Site

### Complete Testing Checklist

**Homepage:**
- [ ] Hero image loads correctly
- [ ] Navigation menu works
- [ ] All sections scroll smoothly
- [ ] Ken Burns effects work on images
- [ ] "Get Started" buttons work

**Services Page:**
- [ ] All package cards display correctly
- [ ] Launch pricing banner scrolls
- [ ] Digital products show properly
- [ ] "Add to Cart" buttons work

**Cart:**
- [ ] Items add to cart
- [ ] Cart icon shows count
- [ ] Quantity can be adjusted
- [ ] Items can be removed
- [ ] Total calculates correctly

**Checkout:**
- [ ] Stripe checkout loads
- [ ] Can enter card details
- [ ] Test payment processes (use test mode first!)

**Contact Page:**
- [ ] Form fields work
- [ ] Form validation works
- [ ] Submission works (set up form backend if needed)

**About Page:**
- [ ] Content displays correctly
- [ ] Images load

**Mobile Testing:**
- [ ] Visit site on your phone
- [ ] Check that navigation menu works
- [ ] Verify all pages are responsive
- [ ] Test cart and checkout on mobile

---

## Troubleshooting

### Domain Not Working After 24 Hours

**Check DNS:**
1. Go to **dnschecker.org**
2. Enter your domain
3. Select "A" record type
4. Check if it shows `76.76.21.21` globally

**If DNS isn't updating:**
- Verify you added the records correctly in your registrar
- Check that you deleted any conflicting records
- Contact your registrar's support

### Site Not Loading / Showing Errors

1. Check Vercel deployment logs:
   - Go to your project in Vercel
   - Click "Deployments"
   - Click the latest deployment
   - Check the "Build Logs" for errors

2. Common issues:
   - **Missing environment variables:** Add them in Settings
   - **Build errors:** Check that all dependencies are in package.json
   - **Import errors:** Verify all file paths are correct

### Stripe Payments Not Working

1. **Check your Stripe keys:**
   - Verify the publishable key in Vercel matches your Stripe dashboard
   - Make sure you're in the right mode (test vs live)

2. **Browser console errors:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for Stripe-related errors

3. **Test mode vs Live mode:**
   - In test mode, use test card: `4242 4242 4242 4242`
   - Any expiry date in the future
   - Any 3-digit CVC

### Images Not Loading

1. **Check image imports:**
   - Verify all `figma:asset` imports are correct
   - Check that image files exist in your repository

2. **Check build logs:**
   - Look for warnings about missing assets

### Contact Form Not Submitting

The contact form currently doesn't have a backend. You have two options:

**Option 1: Use Formspree (Easiest)**
1. Go to **formspree.io**
2. Create a free account
3. Create a new form
4. Copy the form endpoint
5. Update your contact form to submit to that endpoint

**Option 2: Use Vercel Serverless Functions**
- Requires setting up API routes
- More technical but fully customizable

---

## Ongoing Maintenance

### Updating Your Site

When you make changes to your code:

1. **Save your changes** in your code editor
2. **Commit changes to Git:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. **Vercel automatically deploys:** Within 2-3 minutes, your changes are live!

### Monitoring Your Site

**Vercel Analytics (Free):**
- Go to your project in Vercel
- Click "Analytics"
- See visitor counts, page views, etc.

**Stripe Dashboard:**
- Monitor payments
- Track revenue
- Manage refunds
- View customer information

### Renewals to Remember

- **Domain registration:** Renews annually (~$10-15/year)
- **Vercel hosting:** Free for most sites (premium plans available)
- **Stripe fees:** 2.9% + $0.30 per transaction (no monthly fee)

---

## Support & Resources

### Vercel Documentation
- **Docs:** vercel.com/docs
- **Support:** vercel.com/support

### Stripe Documentation
- **Docs:** stripe.com/docs
- **Support:** support.stripe.com

### Community Help
- **Vercel Discord:** vercel.com/discord
- **Stripe Discord:** discord.gg/stripe

---

## Security Best Practices

✅ **Do:**
- Keep your Stripe keys secure and private
- Use environment variables for sensitive data
- Enable two-factor authentication on GitHub, Vercel, and Stripe
- Regularly update your dependencies
- Back up your code to GitHub

❌ **Don't:**
- Never commit API keys to your repository
- Don't share your Stripe secret key (starts with `sk_`)
- Don't disable HTTPS
- Don't skip Stripe account verification

---

## Cost Summary

**Initial Setup:**
- Domain registration: $8-15/year
- Vercel hosting: **FREE** (generous free tier)
- Stripe setup: **FREE** (only pay per transaction)
- SSL certificate: **FREE** (included with Vercel)

**Ongoing:**
- Domain renewal: $8-15/year
- Vercel: FREE (unless you exceed limits)
- Stripe fees: 2.9% + $0.30 per successful transaction

**Total First Year Estimate:** ~$10-15 (just the domain!)

---

## Next Steps After Launch

1. **Set up Google Analytics** (optional but recommended)
2. **Create a business email** (e.g., hello@averraai.com)
3. **Set up social media** with your domain
4. **Create a backup schedule** (GitHub handles this automatically)
5. **Monitor site performance** using Vercel Analytics
6. **Plan content updates** and new features

---

## Conclusion

Congratulations! You now have a complete roadmap to get AVERRA AI MODEL STUDIO live on the web. 

**Remember:**
- Take your time with each step
- Test thoroughly before accepting real payments
- Keep your credentials secure
- Don't hesitate to reach out to support if you get stuck

**Your site will be live at:**
- `https://yourdomain.com` (your custom domain)
- `https://averra-site.vercel.app` (backup Vercel URL)

Good luck with your launch! 🚀✨

---

*Last Updated: February 2026*
