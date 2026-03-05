/**
 * Shopify Storefront API Client
 * 
 * This file provides a Shopify Buy SDK client for integrating with Shopify.
 * You'll need to create a Shopify store and generate Storefront API credentials.
 * 
 * Setup Instructions:
 * 1. Go to your Shopify Admin: yourstorename.myshopify.com/admin
 * 2. Navigate to Apps → Develop apps → Create an app
 * 3. Configure Storefront API scopes:
 *    - unauthenticated_read_product_listings
 *    - unauthenticated_read_checkouts
 *    - unauthenticated_write_checkouts
 * 4. Get your Storefront Access Token
 * 5. Add to your environment variables:
 *    VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
 *    VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
 */

import Client from 'shopify-buy';

// Environment variables for Shopify configuration
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// Initialize the Shopify Buy SDK client
let client: ShopifyBuy.Client | null = null;

export function initShopifyClient(): ShopifyBuy.Client | null {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.warn(
      'Shopify credentials not found. Set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in your .env file'
    );
    return null;
  }

  if (!client) {
    try {
      client = Client.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      });
      console.log('Shopify client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Shopify client:', error);
      return null;
    }
  }

  return client;
}

export function getShopifyClient(): ShopifyBuy.Client | null {
  if (!client) {
    return initShopifyClient();
  }
  return client;
}

// Check if Shopify is configured and available
export function isShopifyEnabled(): boolean {
  return Boolean(SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}
