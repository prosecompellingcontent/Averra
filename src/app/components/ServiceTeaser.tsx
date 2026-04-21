import { Link } from "react-router";
import { Check } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useIsMobile } from "@/app/hooks/useIsMobile";

// Single AVERRA Brand Alignment System
const brandAlignment = {
  id: "brand-alignment",
  name: "AVERRA Brand Alignment System",
  subtitle: "Industry Standard Alignment",
  description: "Position your brand for success based on its specific identity, not by blending into an oversaturated market.",
  price: "$250",
  salePrice: "$100",
  priceNum: 100,
  originalPriceNum: 250,
  highlights: [
    "Interpretation — Defines what your brand communicates",
    "Alignment — Ensures visual consistency across all elements",
    "Stabilization — Builds structure for long-term consistency",
    "Defined brand direction & aligned visual framework",
    "Corrected perception and positioning"
  ]
};

export function ServiceTeaser() {
  const { addItem } = useCart();
  const isMobile = useIsMobile();

  return (
    <section className="relative bg-[#DCDACC] py-32 px-8 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#654331]/60 font-light mb-4">
            Brand Alignment
          </p>
          <h2 className="text-[clamp(3rem,6vw,4.5rem)] text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            AVERRA Brand Alignment System
          </h2>
          <p className="text-lg text-[#654331] font-light max-w-3xl mx-auto leading-relaxed">
            Position your brand for success based on its specific identity, not by blending into an oversaturated market.
          </p>
        </div>

        {/* Single Service Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div
            className="bg-white/40 p-12 text-center"
            style={{
              boxShadow: '0px 8px 0px 0px rgba(34, 20, 18, 0.15), 0px 16px 0px 0px rgba(34, 20, 18, 0.08)'
            }}
          >
            {/* Pricing */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[#654331]/60 mb-4">
                {brandAlignment.subtitle}
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-2xl text-[#301710]/40 line-through" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  {brandAlignment.price}
                </span>
                <span className="text-5xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  {brandAlignment.salePrice}
                </span>
              </div>
              <p className="text-sm text-[#654331]/70 font-light italic" style={{ fontFamily: 'Cormorant, serif' }}>
                Founding Member Pricing
              </p>
            </div>

            {/* Description */}
            <p className="text-base text-[#654331]/80 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
              {brandAlignment.description}
            </p>

            {/* Highlights */}
            <div className="mb-10 max-w-2xl mx-auto">
              <div className="space-y-3">
                {brandAlignment.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 justify-start text-left">
                    <Check className="w-5 h-5 text-[#654331] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm text-[#301710] font-light leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/services"
              onClick={() => window.scrollTo(0, 0)}
              className={`inline-block px-16 py-4 bg-[#301710] text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light ${!isMobile ? 'hover:bg-[#221412] transition-all duration-200' : ''}`}
            >
              Learn More →
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-[#654331]/80 font-light max-w-2xl mx-auto leading-relaxed">
            Every brand is evaluated through the same standard: <strong>Perception. Translation. Visual Clarity. Consistency.</strong> Our system ensures yours excels at all four.
          </p>
        </div>
      </div>
    </section>
  );
}