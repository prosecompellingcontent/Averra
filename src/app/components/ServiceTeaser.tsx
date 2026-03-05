import { Link } from "react-router";
import { Check } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useIsMobile } from "@/app/hooks/useIsMobile";

const tiers = [
  {
    id: "essentials",
    name: "AVERRA Essentials",
    subtitle: "Starter Brand Kit",
    description: "For The Entrepreneur That Deserves Elevated Branding",
    price: "$200",
    salePrice: "$100",
    priceNum: 100,
    originalPriceNum: 200,
    features: [
      "10 Custom AI Brand Models",
      "AVERRA Strategy Session",
      "AVERRA Visual System Guide",
      "Brand Presence Guide",
      "Commercial License Use"
    ]
  },
  {
    id: "signature",
    name: "AVERRA Signature",
    subtitle: "Brand Authority Package",
    description: "For Brands Ready to Raise Pricing & Presence",
    price: "$350",
    salePrice: "$250",
    priceNum: 250,
    originalPriceNum: 350,
    features: [
      "20 Custom AI Brand Models",
      "Advanced AVERRA Strategy Session",
      "Expanded AVERRA Visual System Guide",
      "Client Loyalty & Expectation Session",
      "Client Messaging Alignment Guide",
      "Commercial License"
    ],
    featured: true
  },
  {
    id: "muse",
    name: "AVERRA Muse",
    subtitle: "Luxury Brand Transformation",
    description: "For The CEO Ready to Own The Market",
    price: "$500",
    salePrice: "$400",
    priceNum: 400,
    originalPriceNum: 500,
    features: [
      "30 Custom AI Brand Models",
      "AVERRA Executive Strategy Intensive",
      "Complete AVERRA Brand System (Executive Edition)",
      "Advanced Brand Authority Session",
      "Team Brand Alignment Strategy Guide",
      "Commercial License"
    ]
  }
];

export function ServiceTeaser() {
  const { addItem } = useCart();
  const isMobile = useIsMobile();

  const handleAddToCart = (tier: typeof tiers[0]) => {
    addItem({
      id: tier.id,
      name: tier.name,
      price: tier.priceNum,
      originalPrice: tier.originalPriceNum,
      type: 'service',
      description: tier.subtitle
    });
  };

  return (
    <section className="relative bg-[#DCDACC] py-32 px-8 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#654331]/60 font-light mb-4">
            Services
          </p>
          <h2 className="text-[clamp(3rem,6vw,4rem)] text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            Choose Your Journey
          </h2>
          <p className="text-base text-[#654331] font-light max-w-2xl mx-auto">
            Three Tiers. All Custom. Find Yours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => {
            return (
              <div
                key={tier.name}
                className={`group flex flex-col ${
                  tier.featured
                    ? 'bg-[#221412]/95 text-[#DCDACC] lg:scale-105 lg:-mt-8 lg:mb-8'
                    : 'bg-white/30 text-[#301710]'
                } ${!isMobile ? 'transition-all duration-300 hover:shadow-2xl' : ''}`}
                style={{
                  boxShadow: tier.featured 
                    ? '0px 12px 0px 0px rgba(34, 20, 18, 0.85), 0px 24px 0px 0px rgba(34, 20, 18, 0.5)' 
                    : '-2px -2px 0px 0px rgba(34, 20, 18, 0.4), 8px 8px 0px 0px rgba(34, 20, 18, 0.8), 16px 16px 0px 0px rgba(34, 20, 18, 0.4)'
                }}
              >
                <div className="p-8 flex flex-col relative z-10">
                  <div className="mb-8">
                    {tier.featured && (
                      <div className="inline-block mb-4 px-4 py-1 bg-[#DCDACC] text-[#301710] text-[9px] uppercase tracking-[0.3em] font-light">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl mb-2" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                      {tier.name}
                    </h3>
                    <p className={`text-xs uppercase tracking-[0.2em] mb-3 ${tier.featured ? 'text-[#BFBBA7]' : 'text-[#654331]'}`}>
                      {tier.subtitle}
                    </p>
                    <p className={`text-base font-light italic mb-4 whitespace-pre-line ${tier.featured ? 'text-[#DCDACC]/80' : 'text-[#654331]/80'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                      {tier.description}
                    </p>
                    <div className="mb-2">
                      <span className={`text-xl line-through ${tier.featured ? 'text-[#DCDACC]/40' : 'text-[#301710]/40'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                        {tier.price}
                      </span>
                      <span className={`text-3xl ml-3 ${tier.featured ? 'text-[#DCDACC]' : 'text-[#301710]'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                        {tier.salePrice}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    {tier.features.map((feature, index) => {
                      const title = typeof feature === 'string' ? feature : feature.title;
                      
                      return (
                        <li key={index} className="flex items-start gap-3">
                          <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.featured ? 'text-[#DCDACC]' : 'text-[#654331]'}`} strokeWidth={1.5} />
                          <span className="text-sm font-light leading-relaxed">{title}</span>
                        </li>
                      );
                    })}
                  </div>

                  <Link
                    to="/services"
                    onClick={() => window.scrollTo(0, 0)}
                    className={`block w-full py-4 text-center text-xs uppercase tracking-[0.3em] font-light ${
                      tier.featured
                        ? 'bg-[#DCDACC] text-[#301710]'
                        : 'border border-[#301710] text-[#301710]'
                    } ${!isMobile ? 'transition-all duration-200 hover:opacity-80' : ''}`}
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/services"
            className={`inline-block px-12 py-4 border border-[#301710] text-[#301710] text-sm uppercase tracking-[0.3em] font-light ${!isMobile ? 'hover:bg-[#301710] hover:text-[#DCDACC] transition-all duration-300' : ''}`}
          >
            Compare All Packages
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-[#654331]/60 uppercase tracking-[0.3em] font-light">
            Not sure which tier?{' '}
            <Link 
              to="/quiz" 
              className={`text-[#301710] ${!isMobile ? 'hover:text-[#654331] transition-colors' : ''}`}
            >
              Take our free Brand Quiz
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}