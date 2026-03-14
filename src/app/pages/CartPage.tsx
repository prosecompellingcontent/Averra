import { useCart } from "@/app/context/CartContext";
import { Link } from "react-router";
import { X } from "lucide-react";
import { Navigation } from "@/app/components/Navigation";

export function CartPage() {
  const { items, removeItem, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-[#DCDACC] pb-32 md:pb-0">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-5xl md:text-6xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
          Your Cart
        </h1>
        
        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-[#301710]/60 mb-8" style={{ fontFamily: 'Cormorant, serif', fontSize: '1.125rem' }}>
              Your cart is empty
            </p>
            <Link
              to="/services"
              className="inline-block px-8 py-4 bg-[#301710] text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#3D2117] transition-all"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-12 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#BFBBA7] border border-[#301710]/20 p-6 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-2xl text-[#301710] mb-2" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-[#301710]/60 text-sm mb-3">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                      {item.originalPrice && (
                        <span className="text-[#301710]/40 line-through" style={{ fontFamily: 'Cormorant, serif' }}>
                          ${item.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                        ${item.price}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#301710]/60 hover:text-[#301710] transition-colors p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-[#301710]/20 pt-8">
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                  Total
                </span>
                <span className="text-4xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  ${totalPrice}
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="px-6 py-4 border border-[#301710]/40 text-[#301710] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#301710]/10 transition-all"
                >
                  Clear Cart
                </button>
                <Link
                  to="/checkout"
                  className="flex-1 px-8 py-4 bg-[#301710] text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#3D2117] transition-all text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}