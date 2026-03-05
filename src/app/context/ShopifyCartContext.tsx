/**
 * Shopify Cart Context
 * 
 * This context provides Shopify-specific cart functionality using the Shopify Buy SDK.
 * It creates a hybrid cart system that works with both Shopify products and custom products.
 */

import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { getShopifyClient, isShopifyEnabled } from '@/utils/shopify/client';

export interface ShopifyCartItem {
  id: string;
  variantId?: string; // Shopify variant ID if it's a Shopify product
  name: string;
  price: number;
  originalPrice?: number;
  type: 'service' | 'digital' | 'membership' | 'shopify-product';
  description?: string;
  image?: string;
  quantity: number;
  shopifyLineItemId?: string; // Shopify checkout line item ID
}

interface ShopifyCartContextType {
  items: ShopifyCartItem[];
  addItem: (item: ShopifyCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  checkoutUrl: string | null;
  isShopifyCart: boolean;
  syncWithShopify: () => Promise<void>;
}

const ShopifyCartContext = createContext<ShopifyCartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'averra_shopify_cart';
const CHECKOUT_STORAGE_KEY = 'averra_shopify_checkout_id';

const saveCartToStorage = (items: ShopifyCartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const loadCartFromStorage = (): ShopifyCartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return [];
};

export function ShopifyCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShopifyCartItem[]>(() => loadCartFromStorage());
  const [showPreview, setShowPreview] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(
    () => localStorage.getItem(CHECKOUT_STORAGE_KEY)
  );

  const isShopifyCart = isShopifyEnabled();

  // Sync cart with Shopify when items change
  const syncWithShopify = useCallback(async () => {
    if (!isShopifyCart) return;

    const client = getShopifyClient();
    if (!client) return;

    try {
      // Get Shopify products from cart
      const shopifyItems = items.filter(item => item.type === 'shopify-product' && item.variantId);

      if (shopifyItems.length === 0) {
        // Clear Shopify checkout if no Shopify items
        if (checkoutId) {
          setCheckoutId(null);
          setCheckoutUrl(null);
          localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        }
        return;
      }

      // Create or update Shopify checkout
      let checkout: any;

      if (checkoutId) {
        try {
          // Fetch existing checkout
          checkout = await client.checkout.fetch(checkoutId);
          
          // Update line items
          const lineItems = shopifyItems.map(item => ({
            variantId: item.variantId!,
            quantity: item.quantity,
          }));

          // Replace all line items
          checkout = await client.checkout.replaceLineItems(checkoutId, lineItems);
        } catch (error) {
          console.error('Error updating checkout:', error);
          // If checkout is invalid, create a new one
          checkout = null;
        }
      }

      if (!checkout) {
        // Create new checkout
        const lineItems = shopifyItems.map(item => ({
          variantId: item.variantId!,
          quantity: item.quantity,
        }));

        checkout = await client.checkout.create({
          lineItems,
        });

        setCheckoutId(checkout.id as string);
        localStorage.setItem(CHECKOUT_STORAGE_KEY, checkout.id as string);
      }

      setCheckoutUrl(checkout.webUrl as string);
    } catch (error) {
      console.error('Failed to sync with Shopify:', error);
    }
  }, [items, checkoutId, isShopifyCart]);

  // Debounce localStorage writes and Shopify sync
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCartToStorage(items);
      syncWithShopify();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [items, syncWithShopify]);

  const addItem = useCallback((item: ShopifyCartItem) => {
    try {
      setItems(prev => {
        const existingIndex = prev.findIndex(i => i.id === item.id);
        
        if (existingIndex >= 0) {
          // Update quantity if item exists
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + (item.quantity || 1),
          };
          return updated;
        }
        
        // Add new item
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      });

      setShowPreview(true);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    try {
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }

      setItems(prev => {
        const updated = prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        return updated;
      });
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    try {
      setItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      setCheckoutId(null);
      setCheckoutUrl(null);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      showPreview,
      setShowPreview,
      checkoutUrl,
      isShopifyCart,
      syncWithShopify,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      showPreview,
      checkoutUrl,
      isShopifyCart,
      syncWithShopify,
    ]
  );

  return (
    <ShopifyCartContext.Provider value={contextValue}>
      {children}
    </ShopifyCartContext.Provider>
  );
}

export function useShopifyCart() {
  const context = useContext(ShopifyCartContext);
  if (!context) {
    throw new Error('useShopifyCart must be used within ShopifyCartProvider');
  }
  return context;
}
