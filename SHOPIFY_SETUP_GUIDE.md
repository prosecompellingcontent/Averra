# SHOPIFY INTEGRATION SETUP GUIDE

## Overview

AVERRA AI MODEL STUDIO now includes a complete Shopify integration that allows you to sell physical products alongside your digital services and branding packages. The integration uses the Shopify Storefront API and the Shopify Buy SDK.

## Architecture

The Shopify integration consists of:

1. **Shopify Client** (`/src/utils/shopify/client.ts`) - Manages the Shopify Buy SDK connection
2. **ShopifyCartContext** (`/src/app/context/ShopifyCartContext.tsx`) - Handles cart management with Shopify checkout
3. **useShopifyProducts Hook** (`/src/app/hooks/useShopifyProducts.ts`) - Fetches products from Shopify
4. **ShopifyProductCard** (`/src/app/components/ShopifyProductCard.tsx`) - Displays individual products
5. **ShopifyProductsPage** (`/src/app/pages/ShopifyProductsPage.tsx`) - Main products listing page

## Setup Instructions

### Step 1: Create a Shopify Store

If you don't already have one:

1. Go to [Shopify.com](https://www.shopify.com/)
2. Sign up for an account
3. Set up your store with your domain (e.g., `averra-studio.myshopify.com`)

### Step 2: Generate Storefront API Credentials

1. Log in to your Shopify Admin: `https://your-store.myshopify.com/admin`

2. Navigate to: **Apps** → **Develop apps** (at the bottom of the page)

3. Click **Create an app**
   - Name: "AVERRA Website Integration"
   - App developer: Select yourself

4. Click **Configure Storefront API scopes**

5. Enable these scopes:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_checkouts`
   - ✅ `unauthenticated_write_checkouts`

6. Click **Save**

7. Navigate to **API credentials** tab

8. Click **Install app** (install on your store)

9. Copy your **Storefront Access Token** (it will look like: `abcd1234567890efghijklmnop...`)

### Step 3: Configure Environment Variables

#### For Local Development

Create a `.env` file in your project root:

```bash
# Shopify Configuration
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

#### For GitHub Repository

Add these to your `.gitignore` file (they should already be there):

```
.env
.env.local
.env.*.local
```

#### For Vercel Deployment

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SHOPIFY_DOMAIN` | `your-store.myshopify.com` | Production, Preview, Development |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Your token | Production, Preview, Development |

4. Redeploy your application for changes to take effect

### Step 4: Add Products to Your Shopify Store

1. In your Shopify Admin, go to **Products** → **Add product**

2. Create your products with:
   - Title
   - Description
   - Images
   - Price
   - Inventory
   - Product type (e.g., "Beauty Tools", "Branding Materials")

3. Make sure products are available on the **Online Store** sales channel:
   - In each product, check the **Sales channels** section
   - Ensure "Online Store" is checked

4. Products will automatically appear on your AVERRA website at `/shopify/products`

### Step 5: Test the Integration

1. **Visit the products page**: `https://your-site.com/shopify/products`

2. **Add a product to cart**: Click on any product and click "Add to Cart"

3. **View cart**: The cart should show your Shopify products

4. **Checkout**: Clicking checkout will redirect to your Shopify checkout page

## Features

### Product Display

- ✅ Automatic product fetching from Shopify
- ✅ Responsive grid layout
- ✅ Product images with hover effects
- ✅ Sale badges for discounted products
- ✅ Out of stock indicators
- ✅ Quick add to cart

### Cart Management

- ✅ Persistent cart across sessions
- ✅ Automatic Shopify checkout creation
- ✅ Quantity updates
- ✅ Mixed cart (Shopify products + custom services)
- ✅ Direct checkout redirect to Shopify

### Styling

- ✅ Matches AVERRA's luxury aesthetic
- ✅ Warm organic tones (#DCDACC, #BFBBA7)
- ✅ Cormorant serif typography
- ✅ Smooth animations with Motion

## Code Structure

### Client Configuration

```typescript
// /src/utils/shopify/client.ts
import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: SHOPIFY_DOMAIN,
  storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});
```

### Fetching Products

```typescript
// In your component
import { useShopifyProducts } from '@/app/hooks/useShopifyProducts';

const { products, loading, error } = useShopifyProducts();
```

### Adding to Cart

```typescript
import { useShopifyCart } from '@/app/context/ShopifyCartContext';

const { addItem } = useShopifyCart();

addItem({
  id: `shopify-${product.id}-${variant.id}`,
  variantId: variant.id,
  name: product.title,
  price: parseFloat(variant.price),
  type: 'shopify-product',
  quantity: 1,
});
```

## Troubleshooting

### Products Not Showing

1. **Check environment variables are set**: Console should show "Shopify client initialized successfully"
2. **Verify products are published**: In Shopify Admin, ensure products are available on "Online Store" sales channel
3. **Check API permissions**: Ensure all required scopes are enabled
4. **Check console for errors**: Look for API errors in browser console

### Checkout Not Working

1. **Verify checkout scopes**: Ensure `unauthenticated_write_checkouts` is enabled
2. **Check Shopify payments**: Ensure your Shopify store has payment methods configured
3. **Test checkout in Shopify**: Try buying directly from your Shopify store first

### Environment Variables Not Loading

1. **Restart dev server**: After adding `.env`, restart your development server
2. **Check variable names**: Must start with `VITE_` for Vite projects
3. **Verify Vercel setup**: Ensure variables are added in Vercel dashboard and redeployed

## Advanced Configuration

### Custom Collections

To show products from a specific collection:

```typescript
const { products } = useShopifyProducts('featured-products');
```

### Custom Product Filtering

```typescript
const beautyProducts = products.filter(
  p => p.productType === 'Beauty Tools'
);
```

### Product Detail Pages

Add individual product pages by creating:

```typescript
// /src/app/pages/ShopifyProductDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useShopifyProduct } from '@/app/hooks/useShopifyProducts';

export function ShopifyProductDetailPage() {
  const { handle } = useParams();
  const { product, loading, error } = useShopifyProduct(handle);
  
  // Display product details...
}
```

Then add the route:

```typescript
{ path: "shopify/products/:handle", Component: ShopifyProductDetailPage }
```

## Security Notes

⚠️ **IMPORTANT**: 

1. **Never commit credentials**: Always use environment variables
2. **Use Storefront API only**: Never expose Admin API tokens
3. **Storefront tokens are safe**: They're designed for client-side use
4. **Checkout happens on Shopify**: Payment details never touch your server

## Support

For Shopify-specific questions:
- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Shopify Buy SDK Docs](https://shopify.github.io/js-buy-sdk/)

For AVERRA integration questions:
- Check the code comments in `/src/utils/shopify/client.ts`
- Review the implementation in `/src/app/context/ShopifyCartContext.tsx`

## Next Steps

1. ✅ Install `shopify-buy` package
2. ✅ Configure environment variables
3. ✅ Add products to Shopify
4. ✅ Test the integration
5. 🔄 Customize product display
6. 🔄 Add product detail pages
7. 🔄 Configure shipping and taxes in Shopify
8. 🔄 Set up abandoned cart emails in Shopify

---

**Integration Status**: ✅ Production Ready
**Last Updated**: March 5, 2026
