import { Navigation } from "@/app/components/Navigation";
import { useNavigate } from "react-router";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { Check, ArrowRight, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { trackAction } from "@/utils/analytics";

export function EbookSalesPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [heroAnimationState, setHeroAnimationState] = useState<'initial' | 'rising' | 'complete'>('initial');

  useEffect(() => {
    const timeout1 = setTimeout(() => setHeroAnimationState('rising'), 300);
    const timeout2 = setTimeout(() => setHeroAnimationState('complete'), 1500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  const handlePurchase = () => {
    // Add ebook to cart
    addItem({
      id: "gold-standard-ebook",
      name: "The Gold Standard eBook",
      price: 97,
      originalPrice: 147,
      quantity: 1,
      type: "digital",
      description: "Building Beyond The Chair"
    });

    trackAction("ebook_purchase_clicked", { source: "sales_page" });

    // Redirect to checkout
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7]">
      <Navigation />

      <style>{`
        @keyframes riseUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .rising {
          animation: riseUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fdf5f7]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#c9969e] rounded-full blur-[140px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#251218] rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10 text-center">
          <div className={`mb-12 ${heroAnimationState === 'initial' ? 'opacity-0' : 'rising'}`}>
            <div className="inline-block px-10 py-3 bg-[#c9969e]/10 border border-[#c9969e]/30 backdrop-blur-sm mb-8">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                The Gold Standard
              </p>
            </div>
          </div>

          <h1
            className={`text-[clamp(3.5rem,10vw,7rem)] text-[#251218] leading-[0.9] mb-8 ${
              heroAnimationState === 'initial' ? 'opacity-0' : 'rising'
            }`}
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.02em", animationDelay: "0.2s" }}
          >
            Building Beyond The Chair
          </h1>

          <div className={`w-32 h-px bg-[#c9969e] mx-auto mb-12 ${heroAnimationState === 'complete' ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: "0.4s" }}></div>

          <p
            className={`text-2xl text-[#251218]/70 max-w-3xl mx-auto leading-relaxed mb-16 ${
              heroAnimationState === 'complete' ? 'fade-in' : 'opacity-0'
            }`}
            style={{ fontFamily: "Lora, serif", fontWeight: 300, animationDelay: "0.6s" }}
          >
            The business philosophy that explains why beauty professionals stay exhausted even when fully booked — and how to start building differently.
          </p>

          <div className={`flex flex-col items-center gap-6 ${heroAnimationState === 'complete' ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: "0.8s" }}>
            <button
              onClick={handlePurchase}
              className="group relative px-16 py-6 bg-[#251218] text-[#fdf5f7] hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-500 uppercase tracking-[0.4em] text-sm shadow-2xl hover:scale-105 overflow-hidden"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9969e]/0 via-[#c9969e]/30 to-[#c9969e]/0 shimmer"></div>
              <span className="relative flex items-center gap-3">
                Get The Gold Standard
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <p className="text-base text-[#251218]/30 line-through" style={{ fontFamily: "Lora, serif" }}>
                  $147
                </p>
                <p className="text-2xl text-[#251218]" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                  $97
                </p>
              </div>
              <p className="text-sm text-[#c9969e] uppercase tracking-wider" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}>
                Founder Pricing — Instant Access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="relative py-32 bg-[#fdf5f7] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#c9969e] rounded-full blur-[110px]"></div>
        </div>

        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <h2
              className="text-[clamp(2.5rem,6vw,4rem)] text-[#251218] leading-[1.1] mb-6"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              What's Inside
            </h2>
            <p className="text-xl text-[#251218]/70 max-w-3xl mx-auto" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
              A complete breakdown of why beauty businesses feel exhausting and how to begin restructuring them
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                chapter: "Chapter One",
                title: "The Addiction To Being Needed",
                description: "Why being fully booked became a form of validation and how that dependency quietly took over your business decisions."
              },
              {
                chapter: "Chapter Two",
                title: "The Emotional Weight Nobody Sees",
                description: "The invisible labor of absorbing your clients' stress, stories, and expectations — and why it costs more than your time."
              },
              {
                chapter: "Chapter Three",
                title: "The $65 Service Ceiling",
                description: "Why most beauty professionals hit an income wall that has nothing to do with talent and everything to do with positioning."
              },
              {
                chapter: "Chapter Four",
                title: "Building Beyond Appointments",
                description: "How to begin structuring income that doesn't require your physical presence for every single dollar."
              },
              {
                chapter: "Chapter Five",
                title: "Authority Over Volume",
                description: "The shift from trying to book more clients to becoming the provider clients actively seek out and pay premium rates to access."
              },
              {
                chapter: "Chapter Six",
                title: "The Real Standard",
                description: "What it actually looks like to build a beauty business that supports your life instead of consuming all of it."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-8 bg-white/40 backdrop-blur-sm border border-[#c9969e]/20 hover:border-[#c9969e]/50 hover:bg-white/60 transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="absolute -inset-2 bg-gradient-to-br from-[#c9969e]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                <div className="relative">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#c9969e] mb-3" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                    {item.chapter}
                  </p>
                  <h3 className="text-2xl text-[#251218] mb-4" style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
                    {item.title}
                  </h3>
                  <p className="text-base text-[#251218]/70 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="relative py-32 bg-[#fdf5f7]">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2
              className="text-[clamp(2.5rem,6vw,4rem)] text-[#251218] leading-[1.1] mb-6"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              Who This Is For
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              "Beauty professionals who are fully booked and still financially stressed",
              "Providers who can't remember the last time they took a real day off without guilt",
              "Business owners who feel like their schedule owns them instead of the other way around",
              "Stylists, lash artists, estheticians, nail techs, MUAs, and barbers ready to stop trading time for money",
              "Anyone who has quietly wondered if being exhausted is just part of owning a beauty business"
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white/40 backdrop-blur-sm border border-[#c9969e]/20 hover:border-[#c9969e]/40 transition-all duration-300 shadow-lg"
              >
                <Check className="w-6 h-6 text-[#c9969e] flex-shrink-0 mt-1" />
                <p className="text-lg text-[#251218] leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="relative py-32 bg-[#fdf5f7] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] bg-[#251218] rounded-full blur-[110px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="bg-white/40 backdrop-blur-sm border border-[#c9969e]/30 p-12 rounded-2xl shadow-2xl">
            <div className="text-center mb-12">
              <BookOpen className="w-16 h-16 text-[#c9969e] mx-auto mb-6" />
              <h2
                className="text-3xl text-[#251218] mb-6"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}
              >
                After reading The Gold Standard, you'll understand:
              </h2>
            </div>

            <div className="space-y-6 text-lg text-[#251218] leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
              <p>→ Why being fully booked doesn't equal financial stability</p>
              <p>→ The real reason you can't take time off without your business suffering</p>
              <p>→ How emotional labor quietly drains beauty professionals more than physical work</p>
              <p>→ Why your pricing has nothing to do with your talent and everything to do with positioning</p>
              <p>→ The structure behind building income that doesn't require constant availability</p>
              <p>→ What it actually looks like to transition from labor-based income to scalable business growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 bg-[#fdf5f7]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#c9969e] rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="text-center">
            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] text-[#251218] leading-[1.1] mb-12"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              Your business should eventually support your life.
            </h2>

            <p
              className="text-2xl text-[#c9969e] mb-16 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Not consume all of it.
            </p>

            <button
              onClick={handlePurchase}
              className="group relative px-20 py-7 bg-[#251218] text-[#fdf5f7] hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-500 uppercase tracking-[0.4em] text-base shadow-2xl hover:scale-110 overflow-hidden"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9969e]/0 via-[#c9969e]/30 to-[#c9969e]/0 shimmer"></div>
              <span className="relative flex items-center gap-3">
                Get The Gold Standard
                <ArrowRight className="w-6 h-6" />
              </span>
            </button>

            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <p className="text-base text-[#251218]/30 line-through" style={{ fontFamily: "Lora, serif" }}>
                  $147
                </p>
                <p className="text-2xl text-[#251218]" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                  $97
                </p>
              </div>
              <p className="text-sm text-[#c9969e] uppercase tracking-wider" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}>
                Founder Pricing — Limited Time
              </p>
              <p className="text-sm text-[#251218]/50" style={{ fontFamily: "Lora, serif" }}>
                Instant Digital Access • Read on any device • Lifetime access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="py-16"></div>
    </div>
  );
}
