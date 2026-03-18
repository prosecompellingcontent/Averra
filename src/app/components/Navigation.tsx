import { Link } from "react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useState } from "react";

export function Navigation() {
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] ${isMobile ? 'px-6 py-4' : 'px-8 py-6'}`}
        style={isMobile ? { 
          position: 'fixed',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        } : undefined}
      >
        <div className={`flex ${isMobile ? 'justify-between' : 'justify-center'} items-center relative ${!isMobile ? 'gap-32' : ''}`}>
          {/* Navigation Links - Left Side */}
          {isMobile ? (
            // Mobile: Menu button on left
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white/70"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          ) : (
            <div className="flex items-center gap-16">
              <Link 
                to="/quiz" 
                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Quiz
              </Link>
              <Link 
                to="/services" 
                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Services
              </Link>
            </div>
          )}

          {/* AVERRA Brand Name - Center */}
          <Link 
            to="/" 
            className={`${isMobile ? 'text-[0.7rem]' : 'text-xs'} uppercase tracking-widest text-white/90 font-semibold ${!isMobile ? 'hover:text-neutral-200 transition-colors' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            AVERRA
          </Link>

          {/* Navigation Links - Right Side */}
          {isMobile ? (
            // Mobile: Just Cart on right
            <Link 
              to="/cart" 
              className="text-white/70 relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#DCDACC] text-[#301710] rounded-full flex items-center justify-center text-[0.6rem] font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-16">
              <Link 
                to="/about" 
                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Contact
              </Link>
              <Link 
                to="/cart" 
                className="text-neutral-400 hover:text-neutral-200 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#301710] text-[#DCDACC] rounded-full flex items-center justify-center text-xs font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[99] pt-20"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center gap-8 px-6 py-8">
            <Link 
              to="/quiz" 
              className="text-sm uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Quiz
            </Link>
            <Link 
              to="/services" 
              className="text-sm uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-sm uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-sm uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </>
  );
}