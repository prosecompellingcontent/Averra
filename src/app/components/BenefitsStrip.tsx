import { TrendingUp, Sparkles, Package } from "lucide-react";
import { useIsMobile } from "@/app/hooks/useIsMobile";

const benefits = [
  {
    icon: TrendingUp,
    title: "More Bookings",
    description: "Showcase Your Work."
  },
  {
    icon: Sparkles,
    title: "AI-Powered Branding",
    description: (
      <>
        Keep Content Consistent.
        <br />
        Even With No Clients.
      </>
    )
  },
  {
    icon: Package,
    title: "Client-Ready Kits",
    description: "No Footwork, No Hassle. No Stress."
  }
];

export function BenefitsStrip() {
  const isMobile = useIsMobile();
  
  return (
    <section className="bg-[#221412] py-32 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            
            return (
              <div
                key={index}
                className={`text-center space-y-6 ${!isMobile ? 'transition-transform duration-300 hover:-translate-y-2' : ''}`}
              >
                <div className="flex justify-center">
                  <div className={`w-16 h-16 flex items-center justify-center border border-[#654331] text-[#DCDACC] ${!isMobile ? 'transition-colors duration-300 hover:border-[#BFBBA7] hover:text-[#BFBBA7]' : ''}`}>
                    <Icon className="w-8 h-8" strokeWidth={1} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl text-[#DCDACC]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#BFBBA7] font-light">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}