/**
 * TypeScript declarations for shopify-buy package
 * 
 * This provides type definitions for the Shopify Buy SDK
 */

declare module 'shopify-buy' {
  namespace ShopifyBuy {
    interface Client {
      product: {
        fetchAll(): Promise<Product[]>;
        fetchByHandle(handle: string): Promise<Product | null>;
      };
      collection: {
        fetchByHandle(handle: string): Promise<Collection | null>;
        fetchAllWithProducts(): Promise<Collection[]>;
      };
      checkout: {
        create(input: CheckoutCreateInput): Promise<Checkout>;
        fetch(checkoutId: string): Promise<Checkout>;
        addLineItems(checkoutId: string, lineItems: LineItemInput[]): Promise<Checkout>;
        removeLineItems(checkoutId: string, lineItemIds: string[]): Promise<Checkout>;
        replaceLineItems(checkoutId: string, lineItems: LineItemInput[]): Promise<Checkout>;
        updateLineItems(checkoutId: string, lineItems: LineItemUpdateInput[]): Promise<Checkout>;
      };
    }

    interface Product {
      id: string;
      title: string;
      description: string;
      descriptionHtml: string;
      vendor: string;
      productType: string;
      tags: string[];
      handle: string;
      images: Image[];
      variants: ProductVariant[];
    }

    interface ProductVariant {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      compareAtPrice?: {
        amount: string;
        currencyCode: string;
      };
      available: boolean;
      sku?: string;
      image?: Image;
    }

    interface Image {
      id: string;
      src: string;
      altText?: string;
    }

    interface Collection {
      id: string;
      title: string;
      description: string;
      handle: string;
      products?: Product[];
    }

    interface Checkout {
      id: string;
      webUrl: string;
      lineItems: LineItem[];
      subtotalPrice: {
        amount: string;
        currencyCode: string;
      };
      totalPrice: {
        amount: string;
        currencyCode: string;
      };
    }

    interface LineItem {
      id: string;
      title: string;
      quantity: number;
      variant: ProductVariant;
    }

    interface LineItemInput {
      variantId: string;
      quantity: number;
    }

    interface LineItemUpdateInput {
      id: string;
      quantity: number;
    }

    interface CheckoutCreateInput {
      lineItems?: LineItemInput[];
      email?: string;
      customAttributes?: Array<{
        key: string;
        value: string;
      }>;
    }

    interface ClientConfig {
      domain: string;
      storefrontAccessToken: string;
    }

    function buildClient(config: ClientConfig): Client;
  }

  export = ShopifyBuy;
  export default ShopifyBuy;
}
