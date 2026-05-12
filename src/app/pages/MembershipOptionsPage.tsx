import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "@/app/context/CartContext";
import {
  Check,
  Sparkles,
  BookOpen,
  Users,
  FileText,
  Video,
  ClipboardList,
  Star,
  Package,
  TrendingUp,
  Award,
} from "lucide-react";

export function MembershipOptionsPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isFounderPricing] = useState(true); // Locked to founder pricing

  const blueprintFeatures = [
    { icon: BookOpen, text: "Full Access to The Gold Standard eBook" },
    { icon: FileText, text: "Monthly Business Strategy Frameworks" },
    { icon: Users, text: "Private Community Access" },
    { icon: TrendingUp, text: "Progress Tracking & Milestones" },
    { icon: Award, text: "Business Resource Library" },
  ];

  const goldStandardFeatures = [
    { icon: Sparkles, text: "Everything in Blueprint, Plus:" },
    { icon: Video, text: "Monthly Live Strategy Calls with Jayla" },
    { icon: ClipboardList, text: "Personalized Business Audit Portal" },
    { icon: Star, text: "Brand Spotlight Features" },
    { icon: Package, text: "Exclusive Resource Vault" },
    { icon: FileText, text: "First Access to New Content & Tools" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c9969e]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#251218]/5 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-8 py-12 text-center">
          <div className="inline-block px-8 py-3 bg-white/40 backdrop-blur-md border border-[#c9969e]/20 rounded-full mb-8">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[#c9969e]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Limited Time Founder Pricing
            </p>
          </div>

          <h1
            className="text-[clamp(3rem,6vw,5rem)] text-[#251218] leading-[1] mb-6"
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Choose Your
            <br />
            <span className="italic text-[#c9969e]">Membership</span>
          </h1>

          <p
            className="text-xl text-[#251218]/70 max-w-2xl mx-auto mb-8"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Join a network of beauty professionals transforming from service providers into
            business founders
          </p>

        </div>

        {/* Ebook Section */}
        <div className="px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#c9969e]/30 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ebook Cover */}
                <div className="p-8 lg:p-12 flex items-center justify-center bg-gradient-to-br from-[#c9969e]/10 to-transparent">
                  <div className="w-full max-w-[280px]">
                    <div className="aspect-[3/4] bg-gradient-to-br from-[#c9969e] to-[#251218] rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                      <div className="relative z-10 text-center p-8">
                        <p className="text-white/90 text-sm mb-2" style={{ fontFamily: "Lora, serif", fontStyle: "italic" }}>Building Beyond The Chair</p>
                        <h3 className="text-white text-4xl mb-4" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>The Gold<br/>Standard</h3>
                        <p className="text-white/80 text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "Montserrat, sans-serif" }}>by AVERRA</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ebook Details */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <h3
                    className="text-3xl text-[#251218] mb-4"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    The Gold Standard
                  </h3>
                  <p
                    className="text-base text-[#251218]/80 mb-6 leading-relaxed"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    The eBook for beauty professionals who are done trading hours for money and ready to build something that actually scales.
                  </p>

                  <div className="flex items-baseline gap-4 mb-2">
                    <span
                      className="text-4xl text-[#251218]"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      $97
                    </span>
                    <span
                      className="text-2xl text-[#251218]/40 line-through"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      $147
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-[#c9969e]/20 rounded-full mb-2">
                      <span
                        className="text-xs text-[#c9969e]"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                      >
                        Founder Pricing Limited Time
                      </span>
                    </div>
                    <p
                      className="text-sm text-[#251218]/60"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      Instant access. Read it today.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      // Add ebook to cart
                      addItem({
                        id: "gold-standard-ebook",
                        name: "The Gold Standard: Building Beyond The Chair",
                        price: 97,
                        originalPrice: 147,
                        type: "digital",
                        description: "The eBook for beauty professionals who are done trading hours for money"
                      });
                      // Redirect to cart
                      navigate('/cart');
                    }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300"
                  >
                    <span
                      className="text-sm uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Get The Gold Standard
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Cards */}
        <div className="flex-1 px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-4xl text-[#251218] text-center mb-4"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              Or Join a Membership
            </h2>
            <p
              className="text-lg text-[#251218]/70 text-center mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Get the ebook plus exclusive community access, frameworks, and support
            </p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Blueprint Membership */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-[#c9969e]/20 overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500">
              <div className="p-10">
                <div className="mb-8">
                  <p
                    className="text-sm uppercase tracking-[0.2em] text-[#251218]/60 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    The Essentials
                  </p>
                  <h2
                    className="text-4xl text-[#251218] mb-4"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    Blueprint
                  </h2>

                  <div className="flex items-baseline gap-3 mb-2">
                    <span
                      className="text-5xl text-[#251218]"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      ${isFounderPricing ? "30" : "75"}
                    </span>
                    <span
                      className="text-lg text-[#251218]/60"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      / month
                    </span>
                  </div>

                  {isFounderPricing && (
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg text-[#251218]/40 line-through"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        $75/month
                      </span>
                      <div className="px-3 py-1 bg-[#c9969e]/20 rounded-full">
                        <span
                          className="text-xs text-[#c9969e]"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                        >
                          60% OFF
                        </span>
                      </div>
                    </div>
                  )}

                  {isFounderPricing && (
                    <p
                      className="text-sm text-[#c9969e] mt-4"
                      style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                    >
                      🔒 Founder rate locked in while active
                    </p>
                  )}
                </div>

                <div className="h-px bg-gradient-to-r from-[#c9969e]/30 to-transparent mb-8"></div>

                <div className="space-y-4 mb-10">
                  {blueprintFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 flex items-center justify-center mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-[#c9969e]" strokeWidth={2} />
                        </div>
                        <span
                          className="text-base text-[#251218]/80"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate("/enroll/blueprint")}
                  className="w-full px-8 py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span
                    className="text-sm uppercase tracking-[0.2em]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    Start With Blueprint
                  </span>
                </button>
              </div>
            </div>

            {/* Gold Standard Membership */}
            <div className="relative bg-gradient-to-br from-[#c9969e] to-[#251218] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500">
              {/* Popular Badge */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <span
                  className="text-xs uppercase tracking-[0.15em] text-white"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                >
                  Most Popular
                </span>
              </div>

              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

              <div className="relative p-10 text-white">
                <div className="mb-8">
                  <p
                    className="text-sm uppercase tracking-[0.2em] text-white/80 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    The Complete Experience
                  </p>
                  <h2
                    className="text-4xl mb-4"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    Gold Standard
                  </h2>

                  <div className="flex items-baseline gap-3 mb-2">
                    <span
                      className="text-5xl"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      ${isFounderPricing ? "75" : "130"}
                    </span>
                    <span
                      className="text-lg text-white/80"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      / month
                    </span>
                  </div>

                  {isFounderPricing && (
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg text-white/60 line-through"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        $130/month
                      </span>
                      <div className="px-3 py-1 bg-white/20 rounded-full">
                        <span
                          className="text-xs text-white"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                        >
                          42% OFF
                        </span>
                      </div>
                    </div>
                  )}

                  {isFounderPricing && (
                    <p
                      className="text-sm text-white/90 mt-4"
                      style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                    >
                      🔒 Founder rate locked in while active
                    </p>
                  )}
                </div>

                <div className="h-px bg-gradient-to-r from-white/30 to-transparent mb-8"></div>

                <div className="space-y-4 mb-10">
                  {goldStandardFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                        </div>
                        <span
                          className={`text-base ${
                            index === 0 ? "font-semibold" : "text-white/90"
                          }`}
                          style={{ fontFamily: "Lora, serif", fontWeight: index === 0 ? 500 : 300 }}
                        >
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate("/enroll/goldstandard")}
                  className="w-full px-8 py-4 bg-white text-[#251218] hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span
                    className="text-sm uppercase tracking-[0.2em]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    Start With Gold Standard
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Trust Message */}
          <div className="max-w-4xl mx-auto text-center mt-16">
            <p
              className="text-base text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Join beauty professionals building businesses that don't require their body
              <br />
              to be present for every dollar earned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
