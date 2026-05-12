import { Link, useNavigate } from "react-router";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";

export function CTAFooter() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  return (
    <section className="bg-[#251218] py-32 px-8 pb-0 relative">
      {/* Smooth gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#fdf5f7] to-transparent pointer-events-none"></div>
      <div className="max-w-4xl mx-auto text-center space-y-12 pb-0 relative z-10">
        <div className="space-y-6">
          <h2 className="text-[clamp(2.5rem,8vw,5rem)] text-[#fdf5f7] leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
            Ready to build beyond the chair?
          </h2>
          <p className="text-lg text-[#fdf5f7]/70 font-light max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Lora, serif', fontWeight: 300 }}>
            Take the quiz to discover where you are now and what to build next. Get The Gold Standard eBook and start restructuring your business today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/quiz-intro"
            className={`inline-block px-12 py-4 bg-[#c9969e] text-[#251218] text-sm uppercase tracking-[0.3em] font-light ${!isMobile ? 'hover:bg-[#fdf5f7] transition-all duration-300' : ''} shadow-lg`}
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
          >
            Take The Quiz
          </Link>

          <button
            onClick={() => {
              addItem({
                id: "gold-standard-ebook",
                name: "The Gold Standard: Building Beyond The Chair",
                price: 97,
                originalPrice: 147,
                type: "digital"
              });
              navigate("/checkout");
            }}
            className={`inline-block px-12 py-4 border border-[#c9969e] text-[#fdf5f7] text-sm uppercase tracking-[0.3em] font-light ${!isMobile ? 'hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300' : ''}`}
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
          >
            Get The eBook
          </button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-[#BFBBA7]/80 font-light italic" style={{ fontFamily: 'Cormorant, serif' }}>
            Your business should eventually support your life. Not consume all of it.
          </p>
        </div>

        <div className="pt-16 pb-8 border-t border-[#654331]/30">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Link 
                to="/terms-of-service"
                className={`text-xs text-[#BFBBA7]/60 ${!isMobile ? 'hover:text-[#DCDACC] transition-colors' : ''} uppercase tracking-[0.2em] font-light`}
              >
                Terms of Service
              </Link>
              <span className="text-[#BFBBA7]/40">•</span>
              <Link 
                to="/privacy-policy"
                className={`text-xs text-[#BFBBA7]/60 ${!isMobile ? 'hover:text-[#DCDACC] transition-colors' : ''} uppercase tracking-[0.2em] font-light`}
              >
                Privacy Policy
              </Link>
              <span className="text-[#BFBBA7]/40">•</span>
              <Link 
                to="/refund-policy"
                className={`text-xs text-[#BFBBA7]/60 ${!isMobile ? 'hover:text-[#DCDACC] transition-colors' : ''} uppercase tracking-[0.2em] font-light`}
              >
                Refund Policy
              </Link>
            </div>
            <p className="text-xs text-[#BFBBA7]/60 uppercase tracking-[0.3em] font-light text-center">
              © {new Date().getFullYear()} AVERRA AI Model Studio. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}