# AVERRA AI Model Studio - Shopify Theme

A luxury editorial Shopify theme for beauty professionals, featuring high-end fashion archive aesthetics with warm organic tones and tactile textures.

## 🎨 Features

- **Luxury Editorial Design**: High-end fashion magazine aesthetic
- **Mobile Optimized**: Fully responsive with mobile-first approach
- **Stripe Integration**: Custom checkout with Stripe payments
- **Service Tiers**: Showcase AVERRA Essentials, Signature, and Muse packages
- **Digital Products**: Support for downloadable products
- **Performance Optimized**: Lazy loading, image optimization, and efficient code
- **SEO Ready**: Comprehensive meta tags and structured data
- **Accessibility**: WCAG 2.1 compliant

## 📁 Theme Structure

```
shopify-theme/
├── assets/
│   ├── averra-theme.css       # Main theme styles
│   ├── base.css                # Base CSS and resets
│   └── global.js               # Global JavaScript functionality
├── config/
│   ├── settings_schema.json    # Theme settings configuration
│   └── settings_data.json      # Default theme settings
├── layout/
│   └── theme.liquid            # Main theme layout
├── locales/
│   └── en.default.json         # English translations
├── sections/
│   ├── header.liquid           # Header/navigation
│   ├── footer.liquid           # Footer
│   ├── hero-averra.liquid      # Homepage hero section
│   ├── quick-showcase.liquid   # Image carousel
│   └── announcement-bar.liquid # Promotional announcement bar
├── snippets/
│   ├── product-card.liquid     # Product card component
│   └── meta-tags.liquid        # SEO and social meta tags
└── templates/
    ├── index.liquid            # Homepage template
    ├── product.liquid          # Product page template
    ├── collection.liquid       # Collection page template
    └── cart.liquid             # Cart page template
```

## 🚀 Installation

### Prerequisites

- Shopify store (any plan)
- GitHub account
- Basic understanding of Shopify themes

### Method 1: GitHub Upload (Recommended)

1. **Clone or Download** this repository

2. **Compress the `shopify-theme` folder** into a ZIP file
   ```bash
   cd shopify-theme
   zip -r averra-theme.zip . -x "*.git*" "README.md"
   ```

3. **Upload to Shopify**:
   - Go to your Shopify Admin
   - Navigate to: **Online Store → Themes**
   - Click **Add theme** → **Upload ZIP file**
   - Select `averra-theme.zip`
   - Wait for upload to complete

4. **Customize** (click **Customize** button on the theme)

5. **Publish** when ready

### Method 2: Shopify CLI (Advanced)

1. **Install Shopify CLI**:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Connect to your store**:
   ```bash
   cd shopify-theme
   shopify theme dev --store=your-store.myshopify.com
   ```

3. **Push to production**:
   ```bash
   shopify theme push
   ```

### Method 3: Manual File Upload

1. Go to **Online Store → Themes → Actions → Edit code**
2. Upload files manually to their respective folders
3. Ensure all folders match the structure above

## ⚙️ Configuration

### 1. Basic Setup

After installation, configure these settings:

1. **Logo**: 
   - Theme Settings → Header → Upload logo image
   - Or use text logo (default: "AVERRA")

2. **Colors** (Optional):
   - Theme Settings → Colors
   - Default AVERRA palette is pre-configured

3. **Navigation Menu**:
   - Online Store → Navigation
   - Create menu called "main-menu" with your links

4. **Footer Menu**:
   - Create menu called "footer" for footer links

### 2. Stripe Integration

1. **Get Stripe API Keys**:
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your **Publishable key** (pk_...)
   - Copy your **Secret key** (sk_...)

2. **Add to Shopify**:
   - Theme Settings → Stripe Integration
   - Paste **Publishable Key**
   - **Important**: Secret key should be stored on your backend server, not in theme settings

3. **Create Shopify App** (for server-side Stripe integration):
   - Apps → App development → Create custom app
   - Add app proxy for `/apps/averra-stripe`
   - Deploy server endpoint for Stripe checkout

### 3. Homepage Sections

Configure homepage sections in **Customize → Template → Index**:

1. **Announcement Bar**:
   - Edit text, colors, and link
   - Toggle close button

2. **Hero Section**:
   - Upload hero background image (1920x1080px recommended)
   - Customize title, subtitle, and CTA

3. **Quick Showcase**:
   - Add carousel images (minimum 3)
   - Edit title and description

### 4. Products Setup

1. **Add Products**:
   - Products → Add product
   - For service tiers: Use "Services" product type
   - For digital products: Use "Digital" product type

2. **Product Metafields** (optional):
   - Add custom metafields for:
     - `delivery_time` (text)
     - `included_items` (multi-line text)

3. **Collections**:
   - Create collections for:
     - "Service Tiers"
     - "Digital Products"

## 🎨 Customization

### Adding Custom Sections

Create new section files in `/sections/`:

```liquid
{% comment %}
  My Custom Section
{% endcomment %}

<div class="my-section">
  <h2>{{ section.settings.title }}</h2>
  <p>{{ section.settings.text }}</p>
</div>

<style>
  .my-section {
    padding: 4rem 2rem;
    text-align: center;
  }
</style>

{% schema %}
{
  "name": "My Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Custom Section"
    },
    {
      "type": "textarea",
      "id": "text",
      "label": "Text"
    }
  ],
  "presets": [
    {
      "name": "My Custom Section"
    }
  ]
}
{% endschema %}
```

### Editing Styles

Edit `/assets/averra-theme.css`:

```css
/* Custom styles */
.my-custom-class {
  color: var(--color-primary);
  font-family: var(--font-heading);
}
```

### Adding Custom JavaScript

Add to `/assets/global.js`:

```javascript
// Custom functionality
document.addEventListener('averra:ready', function() {
  console.log('Theme is ready!');
  // Your custom code here
});
```

## 🔧 Development

### Local Development

1. **Install dependencies**:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Start development server**:
   ```bash
   shopify theme dev --store=your-store.myshopify.com
   ```

3. **Make changes** in your code editor

4. **Preview** at the local URL provided

### Testing

- Test on desktop (Chrome, Firefox, Safari)
- Test on mobile devices (iOS Safari, Chrome)
- Test tablet views
- Verify cart functionality
- Test Stripe checkout flow
- Check accessibility with screen reader

## 📱 Mobile Optimization

The theme includes:

- Responsive images with srcset
- Touch-friendly buttons (44px minimum)
- Mobile menu with smooth animations
- Optimized font sizes with clamp()
- Performance optimizations for mobile networks

## 🔒 Security

- No API keys stored in frontend code
- Stripe keys properly separated (publishable vs. secret)
- CSRF protection via Shopify
- Input validation on all forms
- XSS protection via Liquid filters

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari 12+
- Chrome Mobile (latest)

## 📊 Performance

Optimizations included:

- Lazy loading images
- Minified CSS and JS
- Efficient Liquid code
- Optimized Google Fonts loading
- Minimal HTTP requests
- Mobile-first approach

## 🐛 Troubleshooting

### Cart not updating

Check browser console for JavaScript errors. Ensure `global.js` is loaded.

### Stripe checkout not working

1. Verify Stripe publishable key is set in theme settings
2. Check server endpoint is configured
3. Ensure CORS is enabled on server

### Images not displaying

1. Upload images to Shopify Files or theme assets
2. Use proper Liquid image filters
3. Check image URLs in browser network tab

### Mobile menu not opening

Clear browser cache and ensure `global.js` is loaded properly.

## 📝 Support

For issues or questions:

1. Check this README
2. Review Shopify documentation: https://shopify.dev/themes
3. Contact AVERRA support

## 📄 License

Copyright © 2026 AVERRA AI Model Studio. All rights reserved.

## 🔄 Changelog

### Version 1.0.0 (March 2026)
- Initial release
- Luxury editorial design
- Stripe integration
- Full e-commerce functionality
- Mobile optimizations
- SEO and accessibility features

---

**Built with ❤️ for beauty professionals worldwide**
