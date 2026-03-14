import React, { useEffect, useRef } from "react";

import { Navigation } from "@/app/components/Navigation";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { getImageUrl } from "@/utils/imageHelpers";
import beautyImage1 from "figma:asset/b153344a5bbea8053ad323df1a9df52c77bc3aaa.png";
import beautyImage3 from "figma:asset/12105cbf4e65987360556ded3bc119e040e587fd.png";
import beautyImage4 from "figma:asset/188ac9b62dd7455ade608a647298a57b2d00cf3c.png";
import beautyImage5 from "figma:asset/c7bbc9cdbfc889d36e0f15185f5fa4161f8d4c80.png";

// All gallery images from /public folder - hero is first
const galleryImages = [
  '/about-hero.png',
  '/carousel-2.webp',
  '/carousel-3.webp',
  '/carousel-4.webp',
  '/carousel-5.webp',
  '/carousel-6.webp',
  beautyImage1,
  beautyImage3,
  beautyImage4,
  beautyImage5,
];

// Editorial content overlays for select slides
const editorialContent = [
  null, // Hero has its own content
  {
    number: "01",
    title: "The Archive",
    subtitle: "Where beauty meets legacy",
    archiveDate: "ARCHIVE 001"
  },
  null,
  {
    quote: "Every brand tells a story. Make yours unforgettable.",
    author: "AVERRA Philosophy"
  },
  null,
  {
    process: true,
    title: "The AVERRA Method",
    subtitle: "Built for where you are now\nand where you're headed.",
    steps: [
      { 
        number: "01", 
        label: "Choose Your Tier", 
        subtitle: "Essentials, Signature, or Muse.",
        detail: ""
      },
      { 
        number: "02", 
        label: "Strategize", 
        subtitle: "A few questions at checkout and a short brand form is all it takes.",
        detail: ""
      },
      { 
        number: "03", 
        label: "Get Your Visuals", 
        subtitle: "7–10 business days and it's yours, ready to go.",
        detail: ""
      }
    ]
  },
  null,
  {
    number: "03",
    title: "The New Era",
    subtitle: "Where artistry transcends",
    archiveDate: "EST. 2024"
  },
  null,
  {
    cta: true,
    headline: "Ready to be the face of your brand?",
    subtitle: "Discover your beauty brand style. Get your palette, voice tone, and next steps delivered in 2 minutes.",
    buttons: [
      { text: "Start Brand Quiz", href: "/quiz" },
      { text: "View All Services", href: "/services" }
    ]
  },
];

export function HomePage() {
  const isMobile = useIsMobile();
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const container = containerRef.current;
    if (!gallery || !container || isMobile) return; // Skip horizontal scroll on mobile

    let scrollProgress = 0;
    let animationFrameId: number;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Add the scroll delta to progress
      scrollProgress += e.deltaY;
      
      // Clamp between 0 and max scroll
      const maxScroll = container.scrollWidth - container.clientWidth;
      scrollProgress = Math.max(0, Math.min(scrollProgress, maxScroll));
      
      // Smooth scroll to the target position
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        container.scrollLeft = scrollProgress;
      });
    };

    gallery.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      gallery.removeEventListener('wheel', handleWheel);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMobile]);

  return (
    <div 
      className={`bg-black text-white ${isMobile ? "min-h-screen" : "h-screen overflow-y-hidden"}`}
      style={{
        '--background': '#000',
        '--text': '#fff',
        '--video-width': '100vw',
        '--video-height': '100vh',
      } as React.CSSProperties}
    >
      <Navigation />

      {/* Gallery Section - Horizontal on desktop, Vertical on mobile */}
      <section ref={galleryRef} className={`relative bg-black ${isMobile ? "overflow-y-auto" : "h-screen overflow-hidden"}`}>
        <div 
          ref={containerRef}
          className={isMobile 
            ? "flex flex-col" 
            : "horizontal-scroll-container flex h-full overflow-x-hidden overflow-y-hidden max-w-[1400px] mx-auto"
          }
          style={isMobile ? undefined : { scrollBehavior: 'auto' }}
        >
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative bg-black ${
                isMobile 
                  ? "w-full min-h-svh flex-shrink-0 overflow-hidden" 
                  : "min-w-full h-full flex-shrink-0"
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`AVERRA Gallery ${index + 1}`}
                className={`${isMobile ? "absolute inset-0" : ""} w-full h-full object-cover`}
                style={{ 
                  objectPosition: index === 0 ? 'center 50%' : index === 7 ? 'center 35%' : 'center 60%'
                }}
                loading={index === 0 ? "eager" : "lazy"}
              />
              
              {/* Film grain texture overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/40" />
              
              {/* AVERRA Watermark on hero image only */}
              {index === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <h2
                    className={`whitespace-nowrap text-white/[0.07] select-none ${
                      isMobile ? "text-[clamp(6rem,14vw,16rem)]" : "text-[10rem] xl:text-[12rem] 2xl:text-[14rem]"
                    }`}
                    style={{
                      fontFamily: "Cormorant Garamond, Cormorant, serif",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    AVERRA
                  </h2>
                </div>
              )}
              
              {/* Hero Content - Only on first image */}
              {index === 0 && (
                <div className={`absolute inset-0 flex items-center justify-center z-10 ${isMobile ? "px-6" : "px-8 pt-36"}`}>
                  <div className={`w-full text-center mx-auto ${isMobile ? "max-w-md" : "max-w-4xl"}`}>
                    <div className={`${isMobile ? "space-y-3 mb-6" : "space-y-4 mb-8"}`}>
                      <p
                        className={`leading-tight text-white/95 whitespace-nowrap ${isMobile ? "text-[36px]" : "text-5xl xl:text-6xl 2xl:text-7xl"}`}
                        style={{ fontFamily: "Cormorant, serif", fontWeight: 400 }}
                      >
                        Beauty&apos;s New Blueprint
                      </p>
                      <p
                        className={`text-white/80 tracking-wide ${isMobile ? "text-xl mt-6" : "text-2xl xl:text-3xl 2xl:text-4xl mt-8"}`}
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                      >
                        Hesitation Is Expensive.
                      </p>
                    </div>

                    <div className={`flex flex-col items-center ${isMobile ? "space-y-3 mt-8" : "space-y-4 mt-10"}`}>
                      <a
                        href="/quiz"
                        className={`inline-block bg-[#DCDACC] text-[#301710] uppercase tracking-[0.3em] shadow-2xl ${
                          isMobile 
                            ? "px-8 py-3 text-[0.75rem] w-full max-w-xs" 
                            : "px-12 py-4 text-[0.875rem] hover:bg-[#BFBBA7] transition-all duration-300"
                        }`}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                          letterSpacing: "0.15em",
                        }}
                      >
                        Start Your Brand Quiz
                      </a>
                    </div>
                  </div>
                  
                  {/* Spread out text at bottom */}
                  <div className={`absolute bottom-12 left-0 right-0 ${isMobile ? "px-6" : "px-12"}`}>
                    <div className={`flex ${isMobile ? "flex-col space-y-2 text-center" : "justify-between items-center"}`}>
                      <p
                        className={`text-white/80 tracking-wide ${isMobile ? "text-sm" : "text-lg xl:text-xl"}`}
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                      >
                        No Shoots.
                      </p>
                      <p
                        className={`text-white/80 tracking-wide ${isMobile ? "text-sm" : "text-lg xl:text-xl"}`}
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                      >
                        No Designers.
                      </p>
                      <p
                        className={`text-white/80 tracking-wide ${isMobile ? "text-sm" : "text-lg xl:text-xl"}`}
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                      >
                        No Stress.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Editorial Content - Only on select images */}
              {editorialContent[index] && (
                <div className={`absolute inset-0 z-10 ${isMobile ? "px-6" : "px-12"}`}>
                  {/* Vertical text watermark on select slides */}
                  {(index === 2 || index === 6 || index === 9) && (
                    <div className={`absolute ${isMobile ? "right-4 top-1/2 -translate-y-1/2" : "right-12 top-1/2 -translate-y-1/2"}`}>
                      <p 
                        className={`${isMobile ? "text-sm" : "text-base"} text-white/20 uppercase tracking-[0.5em] select-none`}
                        style={{ 
                          fontFamily: "Inter, sans-serif", 
                          fontWeight: 300,
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          letterSpacing: '0.3em'
                        }}
                      >
                        {index === 2 ? 'BEAUTY ARCHIVE' : index === 6 ? 'LUXURY EDITORIAL' : 'AVERRA STUDIO'}
                      </p>
                    </div>
                  )}
                  
                  {/* Magazine-style number in corner for numbered slides */}
                  {'number' in editorialContent[index]! && (
                    <>
                      <div className={`absolute ${isMobile ? "top-24 left-6" : "top-32 left-12"}`}>
                        <div 
                          className={`${isMobile ? "text-[120px]" : "text-[180px]"} leading-none text-white/5 select-none`}
                          style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}
                        >
                          {editorialContent[index].number}
                        </div>
                      </div>
                      <div className={`absolute ${isMobile ? "bottom-24 left-6" : "bottom-32 left-12"} max-w-lg`}>
                        <h3 
                          className={`${isMobile ? "text-4xl mb-2" : "text-6xl mb-4"} text-white tracking-wide`}
                          style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.05em" }}
                        >
                          {editorialContent[index].title}
                        </h3>
                        <p 
                          className={`${isMobile ? "text-sm" : "text-base"} text-white/70 uppercase tracking-[0.3em]`}
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                        >
                          {editorialContent[index].subtitle}
                        </p>
                        {'archiveDate' in editorialContent[index]! && (
                          <p 
                            className={`${isMobile ? "text-xs" : "text-sm"} text-white/60 uppercase tracking-[0.3em]`}
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                          >
                            {editorialContent[index].archiveDate}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* Pull quote style for quote slides */}
                  {'quote' in editorialContent[index]! && (
                    <div className={`absolute inset-0 flex items-center ${isMobile ? "px-6" : "px-12"} justify-center`}>
                      <div className={`${isMobile ? "max-w-md" : "max-w-2xl"} text-center`}>
                        <div className={`${isMobile ? "mb-6" : "mb-8"} relative`}>
                          <div 
                            className={`${isMobile ? "text-[120px]" : "text-[200px]"} leading-none text-white/10 absolute ${isMobile ? "-top-12 left-0" : "-top-16 left-8"}`}
                            style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}
                          >
                            &ldquo;
                          </div>
                          <p 
                            className={`${isMobile ? "text-2xl pt-8" : "text-4xl xl:text-5xl pt-12"} text-white italic leading-relaxed relative z-10`}
                            style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                          >
                            {editorialContent[index].quote}
                          </p>
                        </div>
                        <div className={`h-[1px] w-12 bg-white/30 mx-auto ${isMobile ? "mb-3" : "mb-4"}`}></div>
                        <p 
                          className={`${isMobile ? "text-xs" : "text-sm"} text-white/60 uppercase tracking-[0.3em]`}
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                        >
                          {editorialContent[index].author}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Process steps for process slides */}
                  {'process' in editorialContent[index]! && (
                    <div className={`absolute inset-0 flex items-center ${isMobile ? "px-6" : "px-12"} justify-center`}>
                      <div className={`${isMobile ? "max-w-md" : "max-w-3xl"} w-full`}>
                        <div className="text-center mb-12">
                          <h3 
                            className={`${isMobile ? "text-4xl mb-4" : "text-6xl mb-6"} text-white tracking-wide`}
                            style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.05em" }}
                          >
                            {editorialContent[index].title}
                          </h3>
                        </div>
                        <div className={`grid ${isMobile ? "grid-cols-1 gap-8" : "grid-cols-3 gap-12"} mb-12`}>
                          {editorialContent[index].steps.map((step, i) => (
                            <div key={i} className="text-center space-y-3">
                              <div 
                                className={`${isMobile ? "text-5xl" : "text-6xl"} text-white/20 mb-3`}
                                style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}
                              >
                                {step.number}
                              </div>
                              <h4 
                                className={`${isMobile ? "text-xl" : "text-2xl"} text-white mb-3 uppercase tracking-wider`}
                                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                              >
                                {step.label}
                              </h4>
                              <p 
                                className={`${isMobile ? "text-xs" : "text-sm"} text-white/70 leading-relaxed mb-3`}
                                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                              >
                                {step.subtitle}
                              </p>
                              <p 
                                className={`${isMobile ? "text-sm" : "text-base"} text-white/90 leading-relaxed italic whitespace-pre-line`}
                                style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}
                              >
                                {step.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="text-center">
                          <p 
                            className={`${isMobile ? "text-xl" : "text-3xl xl:text-4xl"} text-white/90 leading-relaxed italic whitespace-pre-line`}
                            style={{ fontFamily: "Cormorant, serif", fontWeight: 500 }}
                          >
                            {editorialContent[index].subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Call to action for CTA slides */}
                  {'cta' in editorialContent[index]! && (
                    <div className={`absolute ${isMobile ? "bottom-16 left-6 right-6" : "bottom-32 left-12"} max-w-2xl`}>
                      <h3 
                        className={`${isMobile ? "text-3xl mb-4" : "text-5xl xl:text-6xl mb-6"} text-white tracking-wide leading-tight`}
                        style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                      >
                        {editorialContent[index].headline}
                      </h3>
                      <p 
                        className={`${isMobile ? "text-sm mb-6" : "text-base mb-8"} text-white/70 leading-relaxed max-w-xl`}
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                      >
                        {editorialContent[index].subtitle}
                      </p>
                      <div className={`flex ${isMobile ? "flex-col space-y-3" : "flex-row space-x-4"}`}>
                        {editorialContent[index].buttons.map((button, i) => (
                          <a
                            key={i}
                            href={button.href}
                            className={`inline-block text-center uppercase tracking-[0.3em] ${ 
                              i === 0 
                                ? "bg-[#DCDACC] text-[#301710]" 
                                : "bg-transparent border border-white/30 text-white"
                            } ${
                              isMobile 
                                ? "px-8 py-3 text-[0.7rem]" 
                                : "px-10 py-3.5 text-[0.8rem] hover:bg-white/10 transition-all duration-300"
                            }`}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 500,
                              letterSpacing: "0.15em",
                            }}
                          >
                            {button.text}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}