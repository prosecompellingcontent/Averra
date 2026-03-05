# AVERRA Shopify Theme - Deployment Guide

## 🎯 Quick Start

This guide will walk you through deploying the AVERRA Shopify theme from GitHub to your Shopify store.

## Prerequisites

- ✅ Shopify store (any plan)
- ✅ Admin access to your store
- ✅ GitHub repository with theme files

## 📦 Step-by-Step Deployment

### Step 1: Prepare Theme Files

1. **Download/Clone Repository**:
   ```bash
   git clone https://github.com/your-username/averra-shopify-theme.git
   cd averra-shopify-theme
   ```

2. **Navigate to Theme Folder**:
   ```bash
   cd shopify-theme
   ```

3. **Create ZIP File**:
   
   **On Mac/Linux**:
   ```bash
   zip -r ../averra-theme.zip . -x "*.git*" "*.DS_Store" "README.md" "DEPLOYMENT_GUIDE.md"
   ```

   **On Windows**:
   - Select all files and folders in `shopify-theme` directory
   - Right-click → "Send to" → "Compressed (zipped) folder"
   - Name it `averra-theme.zip`

### Step 2: Upload to Shopify

1. **Login to Shopify Admin**:
   - Go to: `https://your-store.myshopify.com/admin`

2. **Navigate to Themes**:
   - Click: **Online Store** → **Themes**

3. **Upload Theme**:
   - Scroll to "Theme Library"
   - Click: **Add theme** button
   - Select: **Upload ZIP file**
   - Choose: `averra-theme.zip`
   - Wait for upload (usually 1-2 minutes)

4. **Success!** Theme will appear in your Theme Library

### Step 3: Initial Configuration

1. **Click "Customize"** on the AVERRA theme

2. **Configure Header**:
   - Click "Header" section
   - Upload logo or set text logo ("AVERRA")
   - Save

3. **Configure Announcement Bar**:
   - Edit text: "🎉 Founding Member Pricing: March 3rd to May 31st, 2026"
   - Set colors (default: #DCDACC background, #301710 text)
   - Save

4. **Configure Hero Section**:
   - Upload hero background image (1920x1080px recommended)
   - Set title: "Beauty's New Blueprint"
   - Set subtitle: "Hesitation Is Expensive."
   - Set CTA button link (e.g., `/pages/quiz`)
   - Save

5. **Add Quick Showcase Images**:
   - Click "Quick Showcase" section
   - Add at least 3-6 carousel images
   - Upload high-quality beauty/fashion images
   - Save

### Step 4: Create Navigation Menu

1. **Go to**: Online Store → Navigation

2. **Create Main Menu**:
   - Click "Main menu" (or create new called "main-menu")
   - Add links:
     - Home → /
     - Services → /collections/services
     - Shop → /collections/all
     - About → /pages/about
     - Contact → /pages/contact
   - Save menu

3. **Create Footer Menu**:
   - Create menu called "footer"
   - Add links:
     - Privacy Policy
     - Terms of Service
     - Refund Policy
     - Contact
   - Save menu

### Step 5: Add Products

#### For Service Tiers:

1. **Go to**: Products → Add product

2. **AVERRA Essentials**:
   - Title: AVERRA Essentials
   - Description: Your foundational branding package
   - Price: $499 (or your price)
   - Product type: Services
   - Upload product image
   - Add to collection: "Service Tiers"

3. **Repeat for**:
   - AVERRA Signature ($999)
   - AVERRA Muse ($1,999)

#### For Digital Products:

1. Create products for downloadable items
2. Set product type: "Digital"
3. Add to collection: "Digital Products"

### Step 6: Configure Stripe (Optional)

If using Stripe checkout:

1. **Get Stripe Keys**:
   - Go to: https://dashboard.stripe.com/apikeys
   - Copy Publishable key (pk_...)

2. **Add to Theme**:
   - Theme Settings → Stripe Integration
   - Paste Publishable key
   - **Note**: Secret key goes on your server, not in theme

3. **Server Setup** (Advanced):
   - Deploy server endpoint for Stripe checkout
   - Configure Shopify app proxy
   - See full server setup in main README

### Step 7: Test & Publish

1. **Preview Theme**:
   - Click "Preview" button
   - Test on desktop and mobile
   - Check all pages load correctly

2. **Test Functionality**:
   - ✅ Navigation works
   - ✅ Images load
   - ✅ Cart adds products
   - ✅ Mobile menu opens
   - ✅ Forms submit

3. **Publish**:
   - Click "Publish" button
   - Confirm publication
   - Your theme is now LIVE! 🎉

## 🔧 Post-Deployment

### Create Essential Pages

1. **Quiz Page** (`/pages/quiz`):
   - Pages → Add page
   - Title: "Brand Quiz"
   - Content: Add quiz questions
   - Template: page

2. **About Page** (`/pages/about`):
   - Title: "About AVERRA"
   - Content: Your story
   - Template: page

3. **Contact Page** (`/pages/contact`):
   - Use Shopify's contact form template

### Setup Collections

1. **Service Tiers Collection**:
   - Collections → Create collection
   - Title: "Service Tiers"
   - Type: Manual
   - Add products: Essentials, Signature, Muse

2. **Digital Products Collection**:
   - Title: "Digital Products"
   - Add digital download products

### Configure Domain (If Custom)

1. **Go to**: Settings → Domains
2. **Connect Domain**: Follow Shopify's guide
3. **Update DNS**: Point to Shopify
4. **Wait**: 24-48 hours for propagation

## 🎨 Customization Tips

### Change Colors

1. Theme Settings → Colors
2. Modify:
   - Primary: #DCDACC
   - Secondary: #301710
   - Accent: #BFBBA7

### Change Fonts

1. Theme Settings → Typography
2. Select different Google Fonts
3. Recommended: Keep Cormorant for elegance

### Add Sections

1. Homepage → Add section
2. Choose from:
   - Featured Products
   - Service Teaser
   - About AVERRA
   - Testimonials
   - CTA Blocks

## 🐛 Troubleshooting

### Images Not Showing

**Problem**: Images appear broken or don't load

**Solution**:
1. Re-upload images through Shopify Files
2. Ensure images are under 20MB
3. Use JPG or PNG format
4. Check image URLs in theme editor

### Cart Not Working

**Problem**: Add to cart doesn't work

**Solution**:
1. Check browser console for errors
2. Ensure `global.js` is loaded
3. Clear browser cache
4. Test in incognito mode

### Mobile Menu Won't Open

**Problem**: Hamburger menu doesn't work

**Solution**:
1. Clear cache
2. Check JavaScript console
3. Re-save theme settings
4. Test on different device

### Stripe Checkout Failing

**Problem**: Stripe checkout shows error

**Solution**:
1. Verify publishable key is correct
2. Check key starts with `pk_`
3. Ensure server endpoint is configured
4. Check Stripe dashboard for errors

## 📱 Mobile Optimization Checklist

- [ ] Images load quickly
- [ ] Text is readable (not too small)
- [ ] Buttons are tap-friendly (44px min)
- [ ] Menu opens smoothly
- [ ] Cart functions properly
- [ ] Checkout process works
- [ ] Forms are usable

## 🔒 Security Checklist

- [ ] SSL certificate enabled (Shopify provides free)
- [ ] Stripe secret key NOT in theme (only publishable key)
- [ ] No API keys in client-side code
- [ ] Contact forms have spam protection
- [ ] HTTPS enforced

## 📊 Performance Checklist

- [ ] Images optimized (use Shopify CDN)
- [ ] Lazy loading enabled
- [ ] Minimal apps installed
- [ ] Theme code minified
- [ ] Font loading optimized
- [ ] No duplicate libraries

## 🎯 SEO Checklist

- [ ] Page titles set
- [ ] Meta descriptions added
- [ ] Alt text on all images
- [ ] Structured data included
- [ ] Sitemap submitted to Google
- [ ] Google Analytics installed

## 📈 Going Live Checklist

- [ ] Test all pages
- [ ] Test checkout process
- [ ] Add products with descriptions
- [ ] Set up shipping rates
- [ ] Configure tax settings
- [ ] Test on mobile devices
- [ ] Set up payment gateway
- [ ] Add legal pages (Privacy, Terms)
- [ ] Configure email notifications
- [ ] Train team on Shopify admin

## 🆘 Getting Help

### Shopify Resources

- **Shopify Help Center**: https://help.shopify.com
- **Theme Documentation**: https://shopify.dev/themes
- **Community Forums**: https://community.shopify.com

### AVERRA Support

- Check main README.md
- Review code comments
- Contact AVERRA support team

## 🔄 Updating Theme

### From GitHub

1. Download latest theme ZIP
2. Upload as new theme (don't replace current)
3. Preview and test
4. Publish when ready

### Preserving Customizations

**Before updating**:
1. Export theme settings (Theme → Actions → Export)
2. Screenshot important customizations
3. Note any custom code changes

**After updating**:
1. Import settings
2. Re-apply customizations
3. Test thoroughly

## ✨ Success!

Your AVERRA theme is now deployed and ready to showcase your luxury beauty brand!

**Next Steps**:
- Add your products
- Create compelling content
- Set up marketing campaigns
- Launch to your audience

---

**Need help?** Refer to the main README.md or contact support.

**Built with ❤️ for beauty professionals**
