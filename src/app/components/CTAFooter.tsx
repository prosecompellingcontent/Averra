import { Link } from "react-router";
import { useIsMobile } from "@/app/hooks/useIsMobile";

export function CTAFooter() {
  const isMobile = useIsMobile();
  
  return (
    <section className="bg-[#221412] py-32 px-8 pb-0">
      <div className="max-w-4xl mx-auto text-center space-y-12 pb-0">
        <div className="space-y-6">
          <h2 className="text-[clamp(2.5rem,8vw,5rem)] text-[#DCDACC] leading-tight" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            Ready to be the face of your brand?
          </h2>
          <p className="text-lg text-[#BFBBA7] font-light max-w-2xl mx-auto leading-relaxed">
            Discover your beauty brand style. Get your palette, voice tone, and next steps delivered in 2 minutes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/quiz"
            className={`inline-block px-12 py-4 bg-[#DCDACC] text-[#301710] text-sm uppercase tracking-[0.3em] font-light ${!isMobile ? 'hover:bg-[#BFBBA7] transition-all duration-300' : ''} shadow-lg`}
          >
            Start Brand Quiz
          </Link>

          <Link
            to="/services"
            className={`inline-block px-12 py-4 border border-[#DCDACC] text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light ${!isMobile ? 'hover:bg-[#DCDACC] hover:text-[#301710] transition-all duration-300' : ''}`}
          >
            View All Services
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-sm text-[#BFBBA7]/80 font-light italic" style={{ fontFamily: 'Cormorant, serif' }}>
            No more cheap templates. No more guessing. Just branded excellence, by design.
          </p>
        </div>

        <div className="pt-16 pb-8 border-t border-[#654331]/30">
          <div className="flex flex-col gap-4">
            <Link 
              to="/terms-of-service"
              className={`text-xs text-[#BFBBA7]/60 ${!isMobile ? 'hover:text-[#DCDACC] transition-colors' : ''} uppercase tracking-[0.2em] font-light`}
            >
              Terms of Service
            </Link>
            <p className="text-xs text-[#BFBBA7]/60 uppercase tracking-[0.3em] font-light">
              © {new Date().getFullYear()} AVERRA AI Model Studio. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}