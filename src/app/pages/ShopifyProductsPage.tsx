/**
 * Shopify Products Page
 * 
 * Displays all Shopify products with AVERRA's luxury aesthetic
 */

import { useState } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { CTAFooter } from '@/app/components/CTAFooter';
import { useShopifyProducts } from '@/app/hooks/useShopifyProducts';
import { ShopifyProductCard } from '@/app/components/ShopifyProductCard';
import { isShopifyEnabled } from '@/utils/shopify/client';
import { Loader2 } from 'lucide-react';

export function ShopifyProductsPage() {
  const { products, loading, error } = useShopifyProducts();
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  if (!isShopifyEnabled()) {
    return (
      <div className="min-h-screen bg-[#221412] text-neutral-100">
        <Navigation />
        <div className="container mx-auto px-8 py-32">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 
              className="text-5xl text-[#DCDACC] mb-4"
              style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
            >
              Shopify Not Configured
            </h1>
            <p className="text-[#BFBBA7] text-lg leading-relaxed">
              To enable Shopify products, please configure your Shopify credentials:
            </p>
            <div className="bg-[#2d1810] p-6 rounded text-left space-y-4">
              <p className="text-[#DCDACC] font-mono text-sm">
                VITE_SHOPIFY_DOMAIN=your-store.myshopify.com<br />
                VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
              </p>
              <p className="text-[#BFBBA7] text-sm">
                See <code className="bg-black/40 px-2 py-1">/src/utils/shopify/client.ts</code> for setup instructions.
              </p>
            </div>
          </div>
        </div>
        <CTAFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#221412] text-neutral-100">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-32 px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p 
              className="text-[10px] uppercase tracking-[0.4em] text-[#BFBBA7] font-light mb-4"
            >
              Shopify Collection
            </p>
            <h1 
              className="text-6xl lg:text-7xl text-[#DCDACC] mb-6"
              style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
            >
              Shop Our Products
            </h1>
            <p 
              className="text-lg text-[#BFBBA7] leading-relaxed"
              style={{ fontFamily: 'Cormorant, serif' }}
            >
              Discover our curated collection of beauty and branding products
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-[#DCDACC] animate-spin" />
              <span className="ml-4 text-[#BFBBA7]">Loading products...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <p className="text-red-400 mb-4">Failed to load products</p>
              <p className="text-[#BFBBA7] text-sm">{error.message}</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <ShopifyProductCard
                  key={product.id}
                  product={product}
                  onProductClick={(product) => {
                    // Navigate to product detail page
                    window.location.href = `/shopify/products/${product.handle}`;
                  }}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="max-w-2xl mx-auto text-center py-20">
              <h2 
                className="text-3xl text-[#DCDACC] mb-4"
                style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
              >
                No Products Found
              </h2>
              <p className="text-[#BFBBA7]">
                Add products to your Shopify store to see them here.
              </p>
            </div>
          )}
        </div>
      </section>

      <CTAFooter />
    </div>
  );
}
