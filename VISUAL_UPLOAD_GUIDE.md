# 🎯 VISUAL UPLOAD GUIDE - STEP BY STEP

## ✅ YOUR THEME IS READY - FOLLOW THESE EXACT STEPS

---

## STEP 1: DOWNLOAD YOUR REPOSITORY

### On GitHub:
1. Go to your repository page
2. Look for the green **"Code"** button (top right)
3. Click it
4. Click **"Download ZIP"**
5. Save to your computer
6. **Extract/Unzip** the downloaded file

**Result:** You now have a folder with all your files

---

## STEP 2: CREATE SHOPIFY ZIP

### You Need ONLY These 7 Folders:

```
✅ layout/
✅ sections/
✅ templates/
✅ config/
✅ snippets/
✅ locales/
✅ assets/ (only .css and .js files)
```

### ❌ DO NOT Include:
```
❌ src/
❌ shopify-theme/
❌ node_modules/
❌ public/
❌ Any .md files
```

---

### OPTION A: Windows

1. **Create a NEW folder** on your Desktop
   - Name it: `averra-shopify`

2. **Open your extracted repository folder**

3. **COPY these 7 folders** from repository INTO `averra-shopify`:
   - Drag `layout/` folder → into `averra-shopify/`
   - Drag `sections/` folder → into `averra-shopify/`
   - Drag `templates/` folder → into `averra-shopify/`
   - Drag `config/` folder → into `averra-shopify/`
   - Drag `snippets/` folder → into `averra-shopify/`
   - Drag `locales/` folder → into `averra-shopify/`
   
4. **For assets folder:**
   - Open `assets/` folder in your repository
   - ONLY copy these 3 files into `averra-shopify/assets/`:
     - `averra-theme.css`
     - `base.css`
     - `global.js`

5. **Create ZIP:**
   - Right-click the `averra-shopify` folder
   - Select **"Send to"**
   - Click **"Compressed (zipped) folder"**
   - Result: `averra-shopify.zip`

---

### OPTION B: Mac

1. **Open Terminal** (Applications → Utilities → Terminal)

2. **Navigate to your repository:**
   ```bash
   cd ~/Downloads/your-repository-name
   ```

3. **Create ZIP:**
   ```bash
   zip -r ~/Desktop/averra-shopify.zip \
     layout/ \
     sections/ \
     templates/ \
     config/ \
     snippets/ \
     locales/ \
     assets/averra-theme.css \
     assets/base.css \
     assets/global.js
   ```

4. **Result:** `averra-shopify.zip` on your Desktop

---

## STEP 3: UPLOAD TO SHOPIFY

### 1. Login to Shopify Admin

- Go to: `https://YOUR-STORE-NAME.myshopify.com/admin`
- Replace `YOUR-STORE-NAME` with your actual store name
- Login with your credentials

### 2. Navigate to Themes

- Look at left sidebar
- Click: **"Online Store"**
- Click: **"Themes"**

### 3. Upload Your Theme

- Scroll down to **"Theme library"** section
- Click: **"Add theme"** button (bottom right)
- Click: **"Upload ZIP file"**
- Click: **"Choose file"**
- Select: `averra-shopify.zip`
- Click: **"Upload"**

### 4. Wait for Upload

- Shows progress bar
- Takes 1-2 minutes
- When done, you'll see "AVERRA AI Model Studio" in your theme library

### 5. Customize Theme

- Find your theme in the list
- Click: **"Customize"** button
- Theme customizer opens
- **Add images, text, and content**

### 6. Publish (When Ready)

- In customizer, top right corner
- Click: **"Save"** button (saves as draft)
- When ready to go live:
- Click: **"Publish"** button

---

## TROUBLESHOOTING

### ❌ "Missing layout/theme.liquid"

**Problem:** Folders are nested incorrectly

**Solution:** 
- Inside your ZIP, folders should be at the ROOT
- Should look like:
  ```
  averra-shopify.zip
  ├── layout/
  ├── sections/
  ├── templates/
  └── ...
  ```
- Should NOT look like:
  ```
  averra-shopify.zip
  └── averra-shopify/    ← Extra folder
      ├── layout/
      ├── sections/
      └── ...
  ```

### ❌ "File too large"

**Problem:** You included React files

**Solution:**
- Make sure you ONLY copied the 7 folders listed above
- Do NOT include `/src` folder
- Do NOT include `/node_modules`

### ❌ "Invalid theme structure"

**Problem:** Missing required files

**Solution:**
- Make sure `/layout/theme.liquid` is in your ZIP
- Make sure all 7 folders are included
- Recreate the ZIP following steps above

---

## AFTER UPLOAD CHECKLIST

Once theme is uploaded and customized:

### Immediate Tasks:
- [ ] Add logo image
- [ ] Upload hero image (homepage background)
- [ ] Add carousel images (3-6 images)
- [ ] Set brand colors (or use defaults)
- [ ] Configure announcement bar text

### Within First Day:
- [ ] Create products for service tiers:
  - [ ] AVERRA Essentials ($100, compare at $200)
  - [ ] AVERRA Signature ($250, compare at $350)
  - [ ] AVERRA Muse ($400, compare at $500)
- [ ] Create collection: "Service Tiers"
- [ ] Add digital products (6 packs at $30 each)
- [ ] Create collection: "Digital Products"

### Within First Week:
- [ ] Create pages:
  - [ ] About page
  - [ ] Contact page
  - [ ] Quiz page
  - [ ] Terms of Service page
- [ ] Set up navigation menus
- [ ] Test cart functionality
- [ ] Test on mobile devices
- [ ] Add legal pages (Privacy, Refund)
- [ ] Configure Shopify Payments
- [ ] Set up email notifications
- [ ] Test checkout flow

---

## WHAT YOU'LL SEE

### Homepage:
- Hero section with large background image
- "Beauty's New Blueprint" headline
- "Start Your Brand Quiz" button
- Image carousel (Quick Showcase)
- Service tier preview (3 cards)
- How It Works (3 steps)
- Benefits Strip (3 icons)
- About section
- CTA Footer

### Collection Page (Services):
- Hero with collection title
- Founding Members banner (if enabled)
- Full service tier cards with:
  - Title and subtitle
  - Pricing (sale + original)
  - Feature lists
  - "Get Started" button

### Product Page:
- Product image(s)
- Title and subtitle
- Price (sale + original)
- Description
- Add to Cart button
- Features list
- Trust badges

### Cart:
- Cart items
- Quantities
- Remove options
- Subtotal
- Checkout button

---

## 🎊 YOU'RE READY TO LAUNCH!

Follow the 3 steps above and your AVERRA Shopify theme will be live!

---

**Need Help?**
- Shopify Support: https://help.shopify.com
- Shopify Community: https://community.shopify.com
- Liquid Docs: https://shopify.dev/docs/themes/liquid

**Questions about the theme?**
- Check: `/COMPLETE_CONVERSION_README.md`
- Check: `/UPLOAD_READY_STATUS.md`
- Check: `/README.md`
