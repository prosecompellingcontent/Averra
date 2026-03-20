import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  type: 'service' | 'digital' | 'membership';
  description?: string;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Persist cart to localStorage with error handling
const CART_STORAGE_KEY = 'averra_cart';

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate structure
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return [];
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [showPreview, setShowPreview] = useState(false);

  // Debounce localStorage writes to prevent excessive I/O
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCartToStorage(items);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [items]);

  // Memoize addItem to prevent re-creating function
  const addItem = useCallback((item: CartItem) => {
    try {
      setItems(prev => {
        // Check if item already exists
        const existingIndex = prev.findIndex(i => i.id === item.id);
        if (existingIndex >= 0) {
          // Item exists, increment quantity
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: (updated[existingIndex].quantity || 1) + 1
          };
          return updated;
        }
        // New item, add with quantity 1
        return [...prev, { ...item, quantity: 1 }];
      });
      
      // Show the preview popup
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  }, []);

  // Memoize removeItem to prevent re-creating function
  const removeItem = useCallback((id: string) => {
    try {
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  }, []);

  // Memoize updateQuantity to prevent re-creating function
  const updateQuantity = useCallback((id: string, quantity: number) => {
    try {
      setItems(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity };
        }
        return item;
      }));
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  }, []);

  // Memoize clearCart to prevent re-creating function
  const clearCart = useCallback(() => {
    try {
      setItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, []);

  // Memoize computed values to prevent recalculation on every render
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + (item.quantity || 1), 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0), [items]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    showPreview,
    setShowPreview
  }), [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, showPreview]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
