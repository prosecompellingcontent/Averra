import { useIsMobile } from "@/app/hooks/useIsMobile";
import { ArrowRight } from "lucide-react";

export function AboutAVERRA() {
  const isMobile = useIsMobile();

  return (
    <section className="relative bg-[#654331] py-16 md:py-32 overflow-hidden">
      {/* Removed background image - now solid color */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#BFBBA7] mb-4 font-semibold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              About AVERRA
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] text-[#DCDACC] leading-tight mb-6 font-semibold" style={{ fontFamily: 'Cormorant, serif', fontWeight: 600 }}>
              Talent fills the chair.<br />
              A brand fills the calendar.
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-base text-[#DCDACC]/90 font-light leading-relaxed">
              In the beauty industry, skill is rarely the issue. It's visibility.
            </p>
            <p className="text-base text-[#DCDACC]/90 font-light leading-relaxed">
              There are stylists creating flawless color but posting inconsistently. Lash artists with perfect sets but feeds that blend in. Estheticians producing glowing results without content that reflects their level.
            </p>
            <p className="text-base text-[#DCDACC]/90 font-light leading-relaxed">
              The work is strong. The presentation isn't.
            </p>
            <p className="text-base text-[#DCDACC]/90 font-light leading-relaxed">
              <strong className="text-[#DCDACC] font-normal">AVERRA was built to close that gap.</strong>
            </p>
            <p className="text-base text-[#DCDACC]/90 font-light leading-relaxed">
              We use AI-powered brand imagery built specifically for beauty professionals who are ready to raise their standards and fill their calendar with the right clients.
            </p>
          </div>

          {/* Learn More Button */}
          <div className="mt-12">
            <a
              href="/about"
              className="inline-flex items-center gap-3 text-white uppercase tracking-[0.3em] hover:gap-4 transition-all duration-300 group"
              style={{ fontFamily: 'Cormorant, serif', fontSize: '0.875rem', fontWeight: 400, letterSpacing: '0.15em' }}
            >
              <span>Learn more about AVERRA</span>
              <ArrowRight 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                strokeWidth={1.5}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}