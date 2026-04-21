import { Navigation } from "@/app/components/Navigation";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { getImageUrl } from "@/utils/imageHelpers";
import { useState, useEffect, useRef } from "react";

export function AboutPage() {
  const isMobile = useIsMobile();
  const [heroAnimationState, setHeroAnimationState] = useState<'initial' | 'rising' | 'shining' | 'subtitle-entering' | 'complete'>('initial');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Hero animation sequence
    const timeout1 = setTimeout(() => setHeroAnimationState('rising'), 300);
    const timeout2 = setTimeout(() => setHeroAnimationState('shining'), 1500);
    const timeout3 = setTimeout(() => setHeroAnimationState('subtitle-entering'), 3000);
    const timeout4 = setTimeout(() => setHeroAnimationState('complete'), 4500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
    };
  }, []);

  useEffect(() => {
    // Scroll-triggered animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate, .scroll-line');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [heroAnimationState]);

  return (
    <div className="min-h-screen bg-[#fdf5f7]">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fdf5f7]">
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

          @keyframes gentleShine {
            0% {
              background-position: 0% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          @keyframes subtitleEnter {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(2deg);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 0.05;
            }
            50% {
              opacity: 0.15;
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-60px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(60px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes drawLine {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }

          .hero-3d-text {
            color: #251218;
            text-shadow:
              1px 1px 2px rgba(37, 18, 24, 0.1),
              -0.5px -0.5px 1px rgba(253, 245, 247, 0.3),
              0 4px 8px rgba(201, 150, 158, 0.15);
            position: relative;
          }

          .hero-3d-text::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            background: linear-gradient(
              110deg,
              #251218 0%,
              #251218 35%,
              #c9969e 45%,
              #fdf5f7 50%,
              #c9969e 55%,
              #251218 65%,
              #251218 100%
            );
            background-size: 200% auto;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            opacity: 0;
          }

          .rising {
            animation: riseUp 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          }

          .shining::after {
            animation: gentleShine 4.5s ease-in-out forwards;
            opacity: 1;
          }

          .subtitle-enter {
            animation: subtitleEnter 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          }

          .floating {
            animation: float 8s ease-in-out infinite;
          }

          .pulse-glow {
            animation: pulse 4s ease-in-out infinite;
          }

          /* Scroll animations */
          .scroll-animate {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 1s cubic-bezier(0.22, 0.61, 0.36, 1),
                        transform 1s cubic-bezier(0.22, 0.61, 0.36, 1);
          }

          .scroll-animate.animate-in {
            opacity: 1;
            transform: translateY(0);
          }

          .slide-in-left {
            animation: slideInLeft 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          }

          .slide-in-right {
            animation: slideInRight 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          }

          .scale-in {
            animation: scaleIn 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          }

          .scroll-shine {
            position: relative;
            color: #251218;
          }

          .scroll-shine::before {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            background: linear-gradient(
              90deg,
              #251218 0%,
              #251218 40%,
              #c9969e 48%,
              #fdf5f7 50%,
              #c9969e 52%,
              #251218 60%,
              #251218 100%
            );
            background-size: 200% auto;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            opacity: 0;
          }

          .scroll-shine.animate-in::before {
            animation: gentleShine 3.5s ease-in-out forwards;
            opacity: 1;
          }

          .draw-line {
            animation: drawLine 1.5s ease-out forwards;
          }

          .bg-size-200 {
            background-size: 200% auto;
          }

          .bg-pos-100 {
            background-position: 100% center;
          }

          .scroll-line {
            transition: width 1.5s ease-out 0.3s;
          }

          .scroll-line.animate-in {
            width: 6rem !important;
          }
        `}</style>

        <div className="absolute inset-0 opacity-10 hidden md:block">
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#c9969e] rounded-full blur-[120px] floating"></div>
          <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-[#c9969e] rounded-full blur-[100px] floating" style={{ animationDelay: "3s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#c9969e] rounded-full blur-[150px] pulse-glow"></div>
        </div>

        <div className="relative z-10 text-center px-8">
          <h1
            data-text="AVERRA"
            className={`text-[clamp(6rem,20vw,16rem)] leading-[0.85] mb-8 hero-3d-text ${
              heroAnimationState === 'rising' || heroAnimationState === 'shining' || heroAnimationState === 'subtitle-entering' || heroAnimationState === 'complete' ? 'rising' : 'opacity-0'
            } ${
              heroAnimationState === 'shining' || heroAnimationState === 'subtitle-entering' || heroAnimationState === 'complete' ? 'shining' : ''
            }`}
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 600,
              letterSpacing: "0.05em"
            }}
          >
            AVERRA
          </h1>

          <p
            data-text="The Beauty Industry's Gold Standard."
            className={`text-xl tracking-wide hero-3d-text ${
              heroAnimationState === 'subtitle-entering' || heroAnimationState === 'complete' ? 'subtitle-enter' : 'opacity-0'
            }`}
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 400
            }}
          >
            The Beauty Industry's Gold Standard.
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-[#c9969e] to-transparent"></div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="relative py-40 bg-[#fdf5f7] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-[#c9969e] rounded-full blur-[120px] scroll-animate" style={{ transitionDelay: "0.5s" }}></div>
          <div className="absolute bottom-1/4 -right-20 w-[350px] h-[350px] bg-[#251218] rounded-full blur-[100px] scroll-animate" style={{ transitionDelay: "0.7s" }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-32 h-32 bg-[#c9969e]/10 rounded-full blur-2xl scroll-animate"></div>
            <h2
              className="text-[clamp(3rem,8vw,5rem)] text-[#251218] leading-[0.95] scroll-animate relative"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              Who We Are
            </h2>
            <div className="mx-auto mt-6 h-1 bg-[#c9969e] scroll-line" style={{ width: "0" }}></div>
          </div>

          <div className="relative">
            <div className="absolute -inset-12 rounded-3xl opacity-0 scroll-animate"
                 style={{
                   background: "radial-gradient(circle at center, rgba(201, 150, 158, 0.08) 0%, transparent 70%)",
                   transitionDelay: "0.4s"
                 }}></div>

            <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-12 border border-[#c9969e]/20 scroll-animate shadow-lg" style={{ transitionDelay: "0.5s" }}>
              <p className="text-xl text-[#251218] leading-relaxed text-center max-w-4xl mx-auto" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                AVERRA is a Creative Direction and Brand Alignment company focused within the beauty industry. We operate on one core function:{" "}
                <span
                  data-text="translating a brand's intended identity into a clear, consistent, and accurate visual expression."
                  className="scroll-shine font-semibold text-2xl inline-block relative"
                  style={{ color: "#251218" }}>
                  translating a brand's intended identity into a clear, consistent, and accurate visual expression.
                </span>
              </p>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#c9969e]/10 blur-2xl scroll-animate" style={{ transitionDelay: "0.7s" }}></div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative py-40 bg-[#fdf5f7] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[#c9969e] rounded-full blur-[100px] scroll-animate floating"></div>
          <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-[#251218] rounded-full blur-[90px] scroll-animate" style={{ transitionDelay: "0.3s", animationDelay: "2s" }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 scroll-animate" style={{ transitionDelay: "0.2s" }}>
              <div className="w-48 h-48 bg-[#c9969e]/10 rounded-full blur-3xl"></div>
            </div>
            <h2
              className="text-[clamp(3rem,8vw,5rem)] text-[#251218] leading-[0.95] scroll-animate relative"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              The Problem
            </h2>
            <div className="flex justify-center mt-8 gap-2">
              <div className="w-2 h-2 bg-[#c9969e] rounded-full scroll-animate" style={{ transitionDelay: "0.4s" }}></div>
              <div className="w-2 h-2 bg-[#c9969e] rounded-full scroll-animate" style={{ transitionDelay: "0.5s" }}></div>
              <div className="w-2 h-2 bg-[#c9969e] rounded-full scroll-animate" style={{ transitionDelay: "0.6s" }}></div>
            </div>
          </div>

          <div className="space-y-12 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-[#c9969e]/5 via-[#c9969e]/10 to-[#c9969e]/5 rounded-3xl opacity-0 scroll-animate blur-2xl" style={{ transitionDelay: "0.3s" }}></div>
              <p className="text-2xl text-[#c9969e] leading-relaxed scroll-animate font-semibold text-center relative bg-white/30 backdrop-blur-sm py-8 px-6 rounded-2xl border border-[#c9969e]/30 shadow-lg" style={{ fontFamily: "Lora, serif", transitionDelay: "0.4s" }}>
                The beauty industry does not have a talent problem. It has a translation problem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#c9969e]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-white/40 backdrop-blur-sm p-8 rounded-xl border-l-4 border-[#c9969e] scroll-animate shadow-md hover:shadow-xl transition-shadow duration-500" style={{ transitionDelay: "0.5s" }}>
                  <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    Professionals are skilled and actively building, but there is a consistent breakdown between what they intend to communicate, what they actually produce, and how it is perceived.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#c9969e]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-white/40 backdrop-blur-sm p-8 rounded-xl border-l-4 border-[#c9969e] scroll-animate shadow-md hover:shadow-xl transition-shadow duration-500" style={{ transitionDelay: "0.6s" }}>
                  <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    That gap is where brands lose clarity, consistency, and perceived value.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-[#c9969e]/20 to-transparent blur-xl opacity-0 scroll-animate" style={{ transitionDelay: "0.7s" }}></div>
              <div className="relative bg-white/50 backdrop-blur-sm p-10 rounded-xl scroll-animate border border-[#c9969e]/30 shadow-lg" style={{ transitionDelay: "0.8s" }}>
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  Most brands build based on what they see. They follow existing aesthetics, replicate what appears to be working, and create without a defined structure. Over time this leads to unaligned visuals, inconsistent content, and a scattered identity.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#c9969e]/20 via-transparent to-[#c9969e]/20 rounded-3xl opacity-0 scroll-animate blur-2xl" style={{ transitionDelay: "0.9s" }}></div>
              <div className="relative bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md p-12 border-l-4 border-[#c9969e] scroll-animate shadow-2xl rounded-2xl hover:scale-105 transition-transform duration-700" style={{ transitionDelay: "1s" }}>
                <div className="absolute top-4 right-4 text-8xl text-[#c9969e]/10 select-none" style={{ fontFamily: "Playfair Display, serif" }}>"</div>
                <p className="text-xl text-[#251218] leading-relaxed italic font-medium relative z-10" style={{ fontFamily: "Lora, serif" }}>
                  This is how markets become oversaturated. Not from too many people, but from too many brands looking and communicating the same.
                </p>
                <div className="absolute bottom-4 left-4 text-8xl text-[#c9969e]/10 select-none rotate-180" style={{ fontFamily: "Playfair Display, serif" }}>"</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Standard */}
      <section className="relative py-40 bg-[#fdf5f7] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#c9969e] rounded-full blur-[120px] scroll-animate floating" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] bg-[#251218] rounded-full blur-[110px] scroll-animate" style={{ transitionDelay: "0.5s" }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-64 h-64 bg-[#c9969e]/10 rounded-full blur-3xl opacity-0 scroll-animate" style={{ transitionDelay: "0.2s" }}></div>
            <h2
              className="text-[clamp(3rem,8vw,5rem)] text-[#251218] leading-[0.95] scroll-animate relative"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              The Standard
            </h2>
            <div className="relative mt-8 flex justify-center gap-4">
              <div className="w-16 h-px bg-[#c9969e] scroll-animate" style={{ transitionDelay: "0.4s" }}></div>
              <div className="w-2 h-2 bg-[#c9969e] rounded-full scroll-animate -mt-1" style={{ transitionDelay: "0.5s" }}></div>
              <div className="w-16 h-px bg-[#c9969e] scroll-animate" style={{ transitionDelay: "0.6s" }}></div>
            </div>
          </div>

          <div className="space-y-16 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {["Perception", "Translation", "Visual Clarity", "Consistency"].map((factor, i) => (
                <div
                  key={factor}
                  className="relative group scroll-animate"
                  style={{ transitionDelay: `${0.3 + i * 0.15}s` }}
                >
                  <div className="absolute -inset-2 bg-gradient-to-br from-[#c9969e]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                  <div className="relative p-8 bg-white/50 backdrop-blur-sm rounded-xl border-t-4 border-[#c9969e] shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-700">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#c9969e]/20 rounded-full blur-lg"></div>
                    <div className="absolute top-2 right-2 text-6xl font-bold text-[#c9969e]/5 select-none" style={{ fontFamily: "Playfair Display, serif" }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p className="text-xl font-semibold text-[#251218] relative z-10" style={{ fontFamily: "Playfair Display, serif" }}>
                      {factor}
                    </p>
                    <div className="mt-4 w-12 h-1 bg-[#c9969e] opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-700"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-[#c9969e]/10 to-transparent rounded-3xl opacity-0 scroll-animate blur-2xl" style={{ transitionDelay: "0.8s" }}></div>
              <div className="relative bg-white/60 backdrop-blur-md p-12 rounded-2xl scroll-animate border border-[#c9969e]/30 shadow-xl text-center" style={{ transitionDelay: "0.9s" }}>
                <p className="text-xl text-[#251218] leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  Every brand in this industry is measured against four factors: Perception, Translation, Visual Clarity, and Consistency. When any one of these is off, your value drops and your brand starts to blend in instead of stand out.
                </p>
              </div>
            </div>

            <div className="relative scroll-animate" style={{ transitionDelay: "1.1s" }}>
              <div className="absolute -inset-12 bg-gradient-to-br from-[#c9969e]/20 via-[#c9969e]/10 to-transparent rounded-full blur-3xl opacity-70"></div>
              <div className="relative inline-block mx-auto">
                <div className="absolute inset-0 bg-[#c9969e]/10 blur-2xl scale-110"></div>
                <div className="relative bg-gradient-to-r from-[#c9969e] to-[#251218] text-transparent bg-clip-text">
                  <p className="text-4xl md:text-5xl leading-relaxed font-bold px-12 py-6 text-center" style={{ fontFamily: "Playfair Display, serif" }}>
                    AVERRA exists to correct that.
                  </p>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-[#c9969e]/30 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The CEO */}
      <section className="relative py-40 bg-[#fdf5f7]">
        <div className="absolute inset-0 opacity-5 hidden md:block">
          <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-[#c9969e] rounded-full blur-[110px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <h2
              className="text-[clamp(3rem,8vw,5rem)] text-[#251218] leading-[0.95] scroll-animate"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              Meet The CEO
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* CEO Photo */}
            <div className="relative scroll-animate" style={{ transitionDelay: "0.2s" }}>
              <div className="absolute -inset-8 bg-gradient-to-br from-[#c9969e]/30 via-[#c9969e]/15 to-transparent blur-3xl animate-in opacity-0" style={{ transitionDelay: "0.3s", transitionDuration: "1.5s" }}></div>
              <div className="absolute -inset-6 bg-gradient-to-tr from-transparent via-[#fdf5f7]/50 to-transparent blur-2xl animate-in opacity-0" style={{ transitionDelay: "0.4s", transitionDuration: "1.5s" }}></div>

              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-br from-[#c9969e]/40 to-[#251218]/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-1000"></div>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-[0_30px_80px_rgba(74,26,58,0.3)] hover:shadow-[0_40px_100px_rgba(74,26,58,0.4)] transition-all duration-700 border-4 border-white/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#251218]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <img
                    src={getImageUrl("/meet-the-ceo.png")}
                    alt="Jayla Smith, CEO of AVERRA"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              </div>

              <div className="mt-10 text-center relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-32 h-32 bg-[#c9969e]/10 rounded-full blur-2xl"></div>
                <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/30 shadow-lg inline-block">
                  <p className="text-3xl text-[#251218] mb-3" style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
                    Jayla Smith
                  </p>
                  <div className="w-24 h-px bg-[#c9969e] mx-auto mb-3"></div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}>
                    Founder, CEO & Creative Director
                  </p>
                </div>
              </div>
            </div>

            {/* CEO Bio */}
            <div className="space-y-8 scroll-animate" style={{ transitionDelay: "0.4s" }}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#c9969e]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-white/40 backdrop-blur-sm p-6 rounded-xl border-l-4 border-[#c9969e]/50 hover:border-[#c9969e] transition-colors duration-500 shadow-md hover:shadow-lg">
                  <p className="text-lg text-[#251218] leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    Growing up in a salon has its perks, besides the free styles. From a young age, Jayla Smith, Founder, CEO, and Creative Director of AVERRA, was already embedded in the industry. Not as just a client, but as someone who was always present, observing, assisting, and developing a real understanding of how businesses functioned beyond what they chose to show. That environment shaped her perception long before she formally entered the space.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-[#c9969e]/20 to-transparent rounded-2xl blur-2xl opacity-70"></div>
                <div className="relative bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md p-8 rounded-2xl border border-[#c9969e]/40 shadow-xl">
                  <div className="absolute top-4 left-4 text-6xl text-[#c9969e]/10 select-none" style={{ fontFamily: "Playfair Display, serif" }}>"</div>
                  <p className="text-xl text-[#251218] leading-relaxed italic font-medium relative z-10 text-center" style={{ fontFamily: "Lora, serif" }}>
                    Beauty was never something Jayla approached from the outside. It was something she developed from within.
                  </p>
                  <div className="absolute bottom-4 right-4 text-6xl text-[#c9969e]/10 select-none rotate-180" style={{ fontFamily: "Playfair Display, serif" }}>"</div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#c9969e]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-white/40 backdrop-blur-sm p-6 rounded-xl border-l-4 border-[#c9969e]/50 hover:border-[#c9969e] transition-colors duration-500 shadow-md hover:shadow-lg">
                  <p className="text-lg text-[#251218] leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    As she moved further into the beauty industry, Jayla began working directly with individuals entering the space and encountered the same pattern without exception. The talent was undeniable. The creativity was there. What was consistently missing was structure. The kind that transforms raw creative ability into something controlled, recognizable, and built to last. Talent was entering the industry full of potential and slowly losing direction within it. Not because of what they lacked, but because nothing had been built to hold what they already had.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#c9969e]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-white/40 backdrop-blur-sm p-6 rounded-xl border-l-4 border-[#c9969e]/50 hover:border-[#c9969e] transition-colors duration-500 shadow-md hover:shadow-lg">
                  <p className="text-lg text-[#251218] leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    That experience pushed her to look deeper. Her background in digital marketing and media advertising, supported by formal education and multiple certifications in brand development, perception, and positioning, gave her a lens that bridged both worlds. It refined how she understood the relationship between identity, visuals, and the way a brand is received. And the more she understood that relationship, the more one thing became clear.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-[#c9969e]/20 via-[#c9969e]/10 to-[#c9969e]/20 rounded-3xl blur-3xl opacity-80"></div>
                <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg p-10 border-l-4 border-[#c9969e] rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-700">
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#c9969e] rounded-full"></div>
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#c9969e] rounded-full"></div>
                  <p className="text-2xl text-[#251218] leading-relaxed italic font-semibold" style={{ fontFamily: "Lora, serif" }}>
                    The work was never the problem. The translation of it was.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#c9969e]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-white/40 backdrop-blur-sm p-6 rounded-xl border-l-4 border-[#c9969e]/50 hover:border-[#c9969e] transition-colors duration-500 shadow-md hover:shadow-lg">
                  <p className="text-lg text-[#251218] leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    AVERRA was built from that recognition. It exists to bring precision and structure to what already exists, aligning identity, visuals, and communication into something deliberate, consistent, and understood at the level it is intended to occupy. Because in this industry, success is not defined by talent alone. It is defined by how that talent is perceived, positioned, and sustained over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The System */}
      <section className="relative py-40 bg-[#fdf5f7] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-[#c9969e] rounded-full blur-[130px] scroll-animate floating"></div>
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[#251218] rounded-full blur-[120px] scroll-animate" style={{ transitionDelay: "0.4s", animationDelay: "3s" }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-72 h-72 bg-gradient-to-br from-[#c9969e]/10 to-transparent rounded-full blur-3xl opacity-0 scroll-animate" style={{ transitionDelay: "0.2s" }}></div>
            <h2
              className="text-[clamp(3rem,8vw,5rem)] text-[#251218] leading-[0.95] scroll-animate relative"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              The System
            </h2>
            <div className="mt-8 flex justify-center items-center gap-3">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#c9969e] scroll-animate" style={{ transitionDelay: "0.4s" }}></div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-[#c9969e] rounded-full scroll-animate" style={{ transitionDelay: "0.5s" }}></div>
                <div className="w-1 h-1 bg-[#c9969e] rounded-full scroll-animate" style={{ transitionDelay: "0.55s" }}></div>
                <div className="w-1 h-1 bg-[#c9969e] rounded-full scroll-animate" style={{ transitionDelay: "0.6s" }}></div>
              </div>
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#c9969e] scroll-animate" style={{ transitionDelay: "0.65s" }}></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-20">
            {[
              { stage: "Interpretation", desc: "Define what your brand communicates", color: "from-[#c9969e]/20 to-transparent" },
              { stage: "Alignment", desc: "Correct visual inconsistencies", color: "from-[#251218]/10 to-transparent" },
              { stage: "Stabilization", desc: "Maintain brand consistency", color: "from-[#c9969e]/15 to-transparent" }
            ].map((item, i) => (
              <div
                key={item.stage}
                className="relative group scroll-animate"
                style={{ transitionDelay: `${0.3 + i * 0.2}s` }}
              >
                <div className={`absolute -inset-6 bg-gradient-to-br ${item.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000`}></div>
                <div className="relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#c9969e] to-[#251218] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <span className="text-white font-bold text-2xl" style={{ fontFamily: "Playfair Display, serif" }}>
                      {i + 1}
                    </span>
                  </div>
                  <div className="pt-12 pb-8 px-8 bg-white/60 backdrop-blur-md rounded-2xl border-t-4 border-[#c9969e] shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-700">
                    <h3 className="text-2xl text-[#251218] mb-4 text-center" style={{ fontFamily: "Playfair Display, serif", fontWeight: 600 }}>
                      {item.stage}
                    </h3>
                    <div className="w-16 h-1 bg-[#c9969e] mx-auto mb-4 opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-700"></div>
                    <p className="text-base text-[#251218]/70 text-center leading-relaxed" style={{ fontFamily: "Lora, serif" }}>
                      {item.desc}
                    </p>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-6 bg-[#c9969e]/20 blur-xl"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-[#c9969e]/15 to-transparent rounded-3xl blur-2xl opacity-0 scroll-animate" style={{ transitionDelay: "0.9s" }}></div>
              <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg p-12 rounded-3xl border border-[#c9969e]/40 shadow-2xl scroll-animate text-center" style={{ transitionDelay: "1s" }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-[#c9969e] to-[#251218] rounded-full">
                  <span className="text-white text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>Three-Stage Process</span>
                </div>
                <p className="text-xl text-[#251218] leading-relaxed mt-4" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  AVERRA operates through a structured three-stage alignment system: Interpretation, Alignment, and Stabilization. Its design is to define, correct, and maintain your brand at the level it is intended to occupy.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 scroll-animate" style={{ transitionDelay: "1.2s" }}>
              <a
                href="/services"
                className="group relative inline-block px-16 py-6 bg-gradient-to-r from-[#c9969e] to-[#251218] text-[#fdf5f7] text-sm uppercase tracking-[0.3em] overflow-hidden hover:scale-110 transition-all duration-700 shadow-2xl rounded-lg"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#fdf5f7]/0 via-white/30 to-[#fdf5f7]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-3">
                  Learn more
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Apply The Standard - CTA */}
      <section className="relative py-40 bg-[#251218] overflow-hidden">
        {/* Smooth gradient at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#fdf5f7] to-transparent pointer-events-none"></div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 left-20 w-[350px] h-[350px] bg-[#c9969e] rounded-full blur-[110px] floating"></div>
          <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-[#fdf5f7] rounded-full blur-[100px] floating" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c9969e] rounded-full blur-[140px] pulse-glow"></div>
        </div>

        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <div className="scroll-animate mb-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9969e]/20 via-[#fdf5f7]/20 to-[#c9969e]/20 blur-3xl scale-150"></div>
              <h2
                className="text-[clamp(3rem,8vw,6rem)] text-[#fdf5f7] leading-[0.95] italic relative mb-6"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  textShadow: "0 4px 20px rgba(201, 150, 158, 0.4)"
                }}
              >
                Apply The Standard
              </h2>
            </div>
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#c9969e] to-[#c9969e]/50"></div>
              <div className="w-3 h-3 bg-[#c9969e] rounded-full animate-pulse"></div>
              <div className="w-32 h-px bg-gradient-to-l from-transparent via-[#c9969e] to-[#c9969e]/50"></div>
            </div>
          </div>

          <div className="space-y-8 scroll-animate" style={{ transitionDelay: "0.3s" }}>
            <div className="relative inline-block group">
              <div className="absolute -inset-8 bg-gradient-to-r from-[#c9969e]/30 via-[#fdf5f7]/20 to-[#c9969e]/30 rounded-full blur-2xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-[#c9969e] to-[#fdf5f7] rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
              <a
                href="/brand-intake"
                className={`relative block px-24 py-8 bg-gradient-to-r from-[#c9969e] via-[#fdf5f7] to-[#c9969e] bg-size-200 text-[#251218] text-sm uppercase tracking-[0.5em] overflow-hidden shadow-[0_20px_60px_rgba(201,150,158,0.5)] rounded-xl ${
                  !isMobile ? "hover:bg-pos-100 hover:scale-110 hover:shadow-[0_30px_80px_rgba(253,245,247,0.6)]" : ""
                } transition-all duration-1000`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  backgroundSize: "200% auto"
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full ${!isMobile ? "group-hover:translate-x-full" : ""} transition-transform duration-1500`}></div>
                <span className="relative z-10 flex items-center justify-center gap-4">
                  Apply The Standard
                  <svg className="w-6 h-6 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
            </div>

            <div className="space-y-4">
              <p className="text-[#fdf5f7]/80 text-base" style={{ fontFamily: "Lora, serif", fontStyle: "italic" }}>
                Begin your brand transformation today
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-[#c9969e] rounded-full animate-pulse" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-[#c9969e] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-[#c9969e] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
