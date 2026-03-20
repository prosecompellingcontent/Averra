import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { CartItem } from '@/app/context/CartContext';
import { useIsMobile } from '@/app/hooks/useIsMobile';

interface CartPreviewPopupProps {
  items: CartItem[];
  isVisible: boolean;
  onClose: () => void;
  onNavigateToCart?: () => void;
}

export function CartPreviewPopup({ items, isVisible, onClose, onNavigateToCart }: CartPreviewPopupProps) {
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const isMobile = useIsMobile();

  // Capture scroll position when popup becomes visible
  useEffect(() => {
    if (isVisible) {
      setScrollPosition(window.scrollY);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      setAutoCloseTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible || items.length === 0) return null;

  const latestItem = items[items.length - 1];
  const totalItemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  // Mobile version with animations
  if (isMobile) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed left-4 right-4 z-[9999] border-2 border-[#301710] shadow-2xl p-4 bg-white"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#301710]" />
                <h3 className="text-sm font-medium text-[#301710] uppercase tracking-wide">
                  Added to Cart
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#301710]/60 hover:text-[#301710]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-3">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-sm text-[#301710] font-medium">{latestItem.name}</p>
                {latestItem.quantity && latestItem.quantity > 1 && (
                  <span className="text-xs text-[#654331] font-medium">
                    × {latestItem.quantity}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#654331]">
                ${latestItem.price}
                {latestItem.quantity && latestItem.quantity > 1 && (
                  <span className="text-[#654331]/60"> each</span>
                )}
              </p>
              {latestItem.quantity && latestItem.quantity > 1 && (
                <p className="text-xs text-[#301710] font-medium mt-1">
                  Subtotal: ${(latestItem.price * latestItem.quantity).toFixed(2)}
                </p>
              )}
            </div>
            
            {onNavigateToCart && (
              <button
                onClick={onNavigateToCart}
                className="w-full py-2 bg-[#301710] text-[#DCDACC] text-xs uppercase tracking-[0.2em]"
              >
                View Cart ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Animated version for desktop
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed right-8 z-[9999] w-96 bg-white border-2 border-[#301710] shadow-2xl"
          style={{
            top: '100px',
            boxShadow: '8px 8px 0px 0px rgba(48, 23, 16, 0.8)'
          }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#301710]" />
                <h3 className="text-base font-medium text-[#301710] uppercase tracking-wide">
                  Added to Cart
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#301710]/60 hover:text-[#301710] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 pb-4 border-b border-[#301710]/20">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-sm text-[#301710] font-medium">{latestItem.name}</p>
                {latestItem.quantity && latestItem.quantity > 1 && (
                  <span className="text-sm text-[#654331] font-semibold">
                    × {latestItem.quantity}
                  </span>
                )}
              </div>
              {latestItem.description && (
                <p className="text-xs text-[#654331] mb-2">{latestItem.description}</p>
              )}
              <div className="flex items-center gap-2">
                {latestItem.originalPrice && (
                  <span className="text-sm text-[#654331]/60 line-through">
                    ${latestItem.originalPrice}
                  </span>
                )}
                <span className="text-lg text-[#301710] font-medium">
                  ${latestItem.price}
                  {latestItem.quantity && latestItem.quantity > 1 && (
                    <span className="text-sm text-[#654331]/80"> each</span>
                  )}
                </span>
              </div>
              {latestItem.quantity && latestItem.quantity > 1 && (
                <p className="text-sm text-[#301710] font-semibold mt-2 pt-2 border-t border-[#301710]/10">
                  Subtotal: ${(latestItem.price * latestItem.quantity).toFixed(2)}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              {onNavigateToCart && (
                <button
                  onClick={onNavigateToCart}
                  className="w-full py-3 bg-[#301710] text-[#DCDACC] text-sm uppercase tracking-[0.2em] hover:bg-[#2d1810] transition-colors"
                >
                  View Cart ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2 text-[#301710] text-sm uppercase tracking-[0.2em] hover:bg-[#301710]/5 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}