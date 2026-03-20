import { useCart } from "@/app/context/CartContext";
import { Link } from "react-router";
import { X, Plus, Minus } from "lucide-react";
import { Navigation } from "@/app/components/Navigation";
import { useIsMobile } from "@/app/hooks/useIsMobile";

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#f4e4e6] pb-32 md:pb-0 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#b76e79]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#301710]/5 rounded-full blur-3xl"></div>
      
      <Navigation />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={`uppercase tracking-[0.4em] text-[#b76e79] mb-4 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
            Shopping Cart
          </p>
          <h1 className={`text-[#301710] mb-4 leading-tight ${isMobile ? 'text-4xl' : 'text-6xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            Your Cart
          </h1>
          {items.length > 0 && (
            <p className={`text-[#654331] ${isMobile ? 'text-sm' : 'text-lg'}`} style={{ fontFamily: 'Lora, serif' }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for checkout
            </p>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="glass-effect border border-white/40 p-12 md:p-16 text-center">
            <p className={`text-[#301710]/60 mb-8 ${isMobile ? 'text-base' : 'text-xl'}`} style={{ fontFamily: 'Cormorant, serif', fontStyle: 'italic' }}>
              Your cart is empty
            </p>
            <Link
              to="/services"
              className={`inline-block bg-[#301710] text-[#f4e4e6] uppercase tracking-[0.3em] hover:bg-[#b76e79] transition-all ${isMobile ? 'px-8 py-4 text-xs' : 'px-12 py-5 text-sm'}`}
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6 mb-10">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="glass-effect border border-white/40 p-6 md:p-8 hover:border-[#b76e79]/40 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Item Number Badge */}
                    <div className="hidden md:flex items-center justify-center w-12 h-12 bg-[#b76e79]/10 border border-[#b76e79]/20 text-[#301710] flex-shrink-0" style={{ fontFamily: 'Cormorant, serif', fontSize: '18px', fontWeight: 500 }}>
                      {index + 1}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className={`text-[#654331]/60 uppercase tracking-wider mb-1 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>
                            {item.type === 'service' ? 'Service Tier' : 'Digital Product'}
                          </p>
                          <h3 className={`text-[#301710] mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className={`text-[#654331]/70 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#301710]/30 hover:text-[#b76e79] transition-colors p-2 -mt-2 -mr-2 ml-4"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Vertical Divider (Desktop) */}
                    <div className="hidden md:block w-px h-20 bg-[#b76e79]/20"></div>

                    {/* Price, Quantity, Subtotal - All in one row */}
                    <div className="flex items-center justify-between md:justify-start gap-6 md:gap-10 bg-white/30 md:bg-transparent -mx-6 md:mx-0 px-6 md:px-0 py-4 md:py-0 border-t md:border-t-0 border-[#b76e79]/10">
                      {/* Price */}
                      <div className="text-center">
                        <p className={`text-[#654331]/70 uppercase tracking-wider mb-2 ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
                          Price
                        </p>
                        <div className="flex flex-col items-center gap-1">
                          {item.originalPrice && (
                            <span className={`text-[#301710]/30 line-through ${isMobile ? 'text-sm' : 'text-base'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                              ${item.originalPrice}
                            </span>
                          )}
                          <span className={`text-[#301710] ${isMobile ? 'text-xl' : 'text-2xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                            ${item.price}
                          </span>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="text-center">
                        <p className={`text-[#654331]/70 uppercase tracking-wider mb-3 ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
                          Qty
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newQty = (item.quantity || 1) - 1;
                              if (newQty > 0) {
                                updateQuantity(item.id, newQty);
                              } else {
                                removeItem(item.id);
                              }
                            }}
                            className="w-9 h-9 flex items-center justify-center bg-white/80 border border-[#b76e79]/30 text-[#301710] hover:bg-[#b76e79] hover:text-white hover:border-[#b76e79] transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className={`text-[#301710] w-10 text-center ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-9 h-9 flex items-center justify-center bg-white/80 border border-[#b76e79]/30 text-[#301710] hover:bg-[#b76e79] hover:text-white hover:border-[#b76e79] transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-center">
                        <p className={`text-[#654331]/70 uppercase tracking-wider mb-2 ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
                          Subtotal
                        </p>
                        <p className={`text-[#301710] ${isMobile ? 'text-xl' : 'text-2xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mb-10 text-center">
              <button
                onClick={clearCart}
                className={`text-[#301710]/40 hover:text-[#b76e79] uppercase tracking-wider transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary at Bottom */}
            <div className="glass-effect border border-white/40 p-8 md:p-12 shadow-lg">
              <div className="max-w-2xl mx-auto">
                {/* Totals */}
                <div className="space-y-6 mb-10 pb-10 border-b border-[#b76e79]/20">
                  <div className="flex justify-between items-baseline">
                    <span className={`text-[#654331] uppercase tracking-wider ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </span>
                    <span className={`text-[#301710] ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                      ${totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-6 border-t border-[#b76e79]/20">
                    <span className={`text-[#301710] font-medium ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
                      Total
                    </span>
                    <span className={`text-[#301710] font-semibold ${isMobile ? 'text-3xl' : 'text-4xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 600 }}>
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                  <Link
                    to="/services"
                    className={`flex-1 text-center bg-white/60 border border-[#b76e79]/20 text-[#301710] uppercase tracking-[0.3em] hover:bg-white hover:border-[#b76e79]/40 hover:shadow-md transition-all ${isMobile ? 'px-6 py-4 text-xs' : 'px-8 py-5 text-sm'}`}
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/checkout"
                    className={`flex-1 text-center bg-[#301710] text-[#f4e4e6] uppercase tracking-[0.3em] font-semibold transition-all shadow-md ${
                      isMobile 
                        ? 'px-6 py-4 text-xs' 
                        : 'px-8 py-6 text-sm hover:bg-[#b76e79] hover:shadow-xl hover:scale-[1.02]'
                    }`}
                  >
                    Proceed to Checkout
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="pt-8 border-t border-[#b76e79]/20 flex flex-wrap justify-center gap-8">
                  <div className="flex items-center gap-2 text-[#654331]/70">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                      Secure Checkout
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#654331]/70">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                      Instant Delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#654331]/70">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                      Commercial License
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}