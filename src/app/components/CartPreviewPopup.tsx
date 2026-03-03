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
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isVisible && !isMobile) {
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      setAutoCloseTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [isVisible, onClose, isMobile]);

  if (!isVisible || items.length === 0) return null;

  const latestItem = items[items.length - 1];
  
  // Simple non-animated version for mobile
  if (isMobile) {
    return (
      <div 
        className="fixed top-20 right-4 left-4 z-50 border-2 border-[#301710] shadow-2xl p-4"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Solid background instead of backdrop-blur
          contain: 'layout style paint', // CSS containment for performance
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
            style={{
              transform: 'translateZ(0)', // GPU acceleration
              willChange: 'transform',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-[#301710] font-medium">{latestItem.name}</p>
          <p className="text-xs text-[#654331]">${latestItem.price}</p>
        </div>
        
        {onNavigateToCart && (
          <button
            onClick={onNavigateToCart}
            className="w-full py-2 bg-[#301710] text-[#DCDACC] text-xs uppercase tracking-[0.2em]"
            style={{
              transform: 'translateZ(0)', // GPU acceleration
              willChange: 'transform',
            }}
          >
            View Cart ({items.length})
          </button>
        )}
      </div>
    );
  }

  // Animated version for desktop
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 right-8 z-50 w-96 glass-effect border-2 border-[#301710] shadow-2xl"
          style={{
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
              <p className="text-sm text-[#301710] font-medium mb-1">{latestItem.name}</p>
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
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {onNavigateToCart && (
                <button
                  onClick={onNavigateToCart}
                  className="w-full py-3 bg-[#301710] text-[#DCDACC] text-sm uppercase tracking-[0.2em] hover:bg-[#2d1810] transition-colors"
                >
                  View Cart ({items.length})
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