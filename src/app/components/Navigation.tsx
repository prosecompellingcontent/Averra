import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useIsMobile } from "@/app/hooks/useIsMobile";

export function Navigation() {
  const { totalItems } = useCart();
  const isMobile = useIsMobile();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
      <div className="flex justify-center items-center relative gap-32">
        {/* Navigation Links - Left Side */}
        <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-16'}`}>
          {!isMobile && (
            <Link 
              to="/quiz" 
              className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Quiz
            </Link>
          )}
          <Link 
            to="/services" 
            className={`text-xs uppercase tracking-widest text-neutral-400 ${!isMobile ? 'hover:text-neutral-200 transition-colors' : ''}`}
          >
            Services
          </Link>
        </div>

        {/* AVERRA Brand Name - Center */}
        <Link 
          to="/" 
          className={`text-xs uppercase tracking-widest text-neutral-400 ${!isMobile ? 'hover:text-neutral-200 transition-colors' : ''} font-semibold`}
        >
          AVERRA
        </Link>

        {/* Navigation Links - Right Side */}
        <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-16'}`}>
          <Link 
            to="/about" 
            className={`text-xs uppercase tracking-widest text-neutral-400 ${!isMobile ? 'hover:text-neutral-200 transition-colors' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`text-xs uppercase tracking-widest text-neutral-400 ${!isMobile ? 'hover:text-neutral-200 transition-colors' : ''}`}
          >
            Contact
          </Link>
          <Link 
            to="/cart" 
            className={`text-neutral-400 ${!isMobile ? 'hover:text-neutral-200 transition-colors' : ''} relative`}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#301710] text-[#DCDACC] rounded-full flex items-center justify-center text-xs font-medium">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}