/**
 * Shopify Products Hook
 * 
 * Custom hook for fetching and managing Shopify products using the Storefront API.
 */

import { useState, useEffect } from 'react';
import { getShopifyClient, isShopifyEnabled } from '@/utils/shopify/client';

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  handle: string;
  images: {
    id: string;
    src: string;
    altText?: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: string;
    compareAtPrice?: string;
    available: boolean;
    sku?: string;
    image?: {
      id: string;
      src: string;
      altText?: string;
    };
  }[];
}

export function useShopifyProducts(collectionHandle?: string) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      if (!isShopifyEnabled()) {
        setLoading(false);
        return;
      }

      const client = getShopifyClient();
      if (!client) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let data;
        if (collectionHandle) {
          // Fetch products from a specific collection
          const collection = await client.collection.fetchByHandle(collectionHandle);
          data = collection ? (collection as any).products : [];
        } else {
          // Fetch all products
          data = await client.product.fetchAll();
        }

        // Transform Shopify data to our format
        const transformedProducts: ShopifyProduct[] = (data as any[]).map((product: any) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          descriptionHtml: product.descriptionHtml,
          vendor: product.vendor,
          productType: product.productType,
          tags: product.tags || [],
          handle: product.handle,
          images: product.images.map((img: any) => ({
            id: img.id,
            src: img.src,
            altText: img.altText,
          })),
          variants: product.variants.map((variant: any) => ({
            id: variant.id,
            title: variant.title,
            price: variant.price.amount,
            compareAtPrice: variant.compareAtPrice?.amount,
            available: variant.available,
            sku: variant.sku,
            image: variant.image ? {
              id: variant.image.id,
              src: variant.image.src,
              altText: variant.image.altText,
            } : undefined,
          })),
        }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching Shopify products:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [collectionHandle]);

  return { products, loading, error };
}

export function useShopifyProduct(handle: string) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!isShopifyEnabled() || !handle) {
        setLoading(false);
        return;
      }

      const client = getShopifyClient();
      if (!client) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await client.product.fetchByHandle(handle);

        if (data) {
          const transformedProduct: ShopifyProduct = {
            id: (data as any).id,
            title: (data as any).title,
            description: (data as any).description,
            descriptionHtml: (data as any).descriptionHtml,
            vendor: (data as any).vendor,
            productType: (data as any).productType,
            tags: (data as any).tags || [],
            handle: (data as any).handle,
            images: (data as any).images.map((img: any) => ({
              id: img.id,
              src: img.src,
              altText: img.altText,
            })),
            variants: (data as any).variants.map((variant: any) => ({
              id: variant.id,
              title: variant.title,
              price: variant.price.amount,
              compareAtPrice: variant.compareAtPrice?.amount,
              available: variant.available,
              sku: variant.sku,
              image: variant.image ? {
                id: variant.image.id,
                src: variant.image.src,
                altText: variant.image.altText,
              } : undefined,
            })),
          };

          setProduct(transformedProduct);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching Shopify product:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [handle]);

  return { product, loading, error };
}
