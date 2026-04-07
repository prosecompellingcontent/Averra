import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react";

import { Navigation } from "@/app/components/Navigation";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { getImageUrl } from "@/utils/imageHelpers";
import { FadeInUp, FloatingBox, StaggeredText } from "@/app/components/AnimatedText";
import { MagneticButton } from "@/app/components/MagneticButton";
import { CookieConsent } from "@/app/components/CookieConsent";

// All gallery images from /public folder - hero is first
const galleryImages = [
  '/about-hero.png',
  '/archive-portrait.png', // The Archive - stunning orange eyeshadow beauty closeup (SLIDE 2)
  '/hair-braiding.png', // Beautiful red hair braiding moment (SLIDE 3)
  '/carousel-6.webp', // THE AVERRA METHOD image (SLIDE 4)
  '/carousel-5.webp', // Nail photo (SLIDE 5)
  '/carousel-7.webp', // Lash photo (SLIDE 6)
  '/facial-treatment.png', // Luxurious facial treatment with mask application (SLIDE 7)
];

// Editorial content overlays for select slides
const editorialContent = [
  null, // Hero has its own content
  {
    number: "01",
    title: "THE ARCHIVE",
    subtitle: "Premium Beauty",
    archiveDate: "Spring 2026"
  },
  {
    splitText: {
      top: "Most beauty professionals struggle not because they lack skill,",
      bottom: "Their brand doesn't reflect how good they actually are."
    }
  },
  {
    process: true,
    title: "THE AVERRA METHOD",
    subtitle: "Clarify  Align  Standardize",
    steps: [
  { number: "01", label: "CLARIFY", subtitle: "Identify Current Brand Perception", detail: " " },
  { number: "02", label: "ALIGN", subtitle: "Establish Clarity & Value In Visual Direction", detail: " " },
  { number: "03", label: "STANDARDIZE", subtitle: "Execute Your New System", detail: " " }
]
  },
  null, // Nail Photo - clean, no text
  {
boldStatement: {
  lines: [
    { text: "Set your", size: "small", align: "left" },
    { text: "STANDARD", size: "large", align: "left" },
    { text: "Control your", size: "small", align: "center" },
    { text: "PERCEPTION", size: "large", align: "center" },
    { text: "Your pricing", size: "small", align: "right" },
    { text: "FOLLOWS", size: "large", align: "right" }
      ]
    },
  }, // Lash Photo - from about
  null, // Facial Treatment - clean, no text
  {
    parallelStatement: {
      pairs: [
        { 
          setup: "When you look the part,",
          payoff: "you feel the part.",
          emphasis: "LOOK → FEEL"
        },
        { 
          setup: "When you feel the part,",
          payoff: "you charge accordingly.",
          emphasis: "FEEL → CHARGE"
        }
      ]
    }
  },
  {
    number: "03",
    title: "THE NEW ERA",
    subtitle: "Premium Beauty",
    archiveDate: "Spring 2026"
  },
  null, // Last image - clean, no text
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
    <>
      {/* Fixed Navigation - Outside main container */}
      <Navigation />

      {/* Main Content Container */}
      <div 
        className={`bg-black text-white ${isMobile ? "min-h-screen" : "h-screen overflow-y-hidden"}`}
        style={{
          '--background': '#000',
          '--text': '#fff',
          '--video-width': '100vw',
          '--video-height': '100vh',
        } as React.CSSProperties}
      >
        {/* Gallery Section - Horizontal on desktop, Vertical on mobile */}
        <section ref={galleryRef} className={`relative bg-black ${isMobile ? "" : "h-screen overflow-hidden"}`}>
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
    ? "w-full flex-shrink-0 overflow-hidden h-[100svh] pb-[env(safe-area-inset-bottom)]"
    : "min-w-full h-full flex-shrink-0"
}`}
              >
                {/* Gradient overlay - fills gaps with soft fade - DESKTOP ONLY */}
                {!isMobile && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 0%, transparent 45%, rgba(0,0,0,0.4) 48%, black 52%)'
                    }}
                  />
                )}
                
                {/* Main image layer - 95% size on desktop, full natural height on mobile */}
                {isMobile ? (
                  <img
  src={getImageUrl(image)}
  alt=""
  className="absolute inset-0 w-full h-full object-cover"
  style={{ objectPosition: "center" }}
  loading={index === 0 ? "eager" : "lazy"}
  decoding="async"
/>
                ) : (
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${getImageUrl(image)})`,
                      backgroundSize: '95%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                )}
                
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
                  <div className={`absolute inset-0 flex items-center justify-center z-10 ${isMobile ? "px-6" : "px-8"}`}>
                    <div className={`w-full text-center mx-auto ${isMobile ? "max-w-md mt-24" : "max-w-4xl mt-24"}`}>
                      <motion.div 
                        className={`${isMobile ? "space-y-2 mb-8" : "space-y-4 mb-8"}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                      >
                        <motion.p
                          className={`leading-tight text-white/95 ${isMobile ? "text-[2rem]" : "text-4xl xl:text-5xl 2xl:text-6xl"}`}
                          style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 500, letterSpacing: "0.03em" }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                        >
                          Beauty&apos;s New Blueprint
                        </motion.p>
                        <motion.p
                          className={`text-white/80 tracking-wide ${isMobile ? "text-lg mt-3" : "text-2xl xl:text-3xl 2xl:text-4xl mt-6"}`}
                          style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400, letterSpacing: "0.04em" }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                        >
                          Hesitation Is Expensive.
                        </motion.p>
                      </motion.div>

                      <motion.div 
                        className={`flex flex-col items-center ${isMobile ? "space-y-3 mt-6" : "space-y-4 mt-10"}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      >
                        {!isMobile ? (
                          <MagneticButton
                            href="/quiz"
                            className={`inline-block bg-transparent border-2 border-[#DCDACC] text-[#DCDACC] uppercase tracking-[0.3em] shadow-2xl px-12 py-4 text-[1rem] hover:bg-[#DCDACC] hover:text-[#301710] transition-all duration-300`}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 600,
                              letterSpacing: "0.15em",
                            }}
                          >
                            Start Your Brand Quiz
                          </MagneticButton>
                        ) : (
                          <a
                            href="/quiz"
                            className="inline-block bg-transparent border-2 border-[#DCDACC] text-[#DCDACC] uppercase tracking-[0.3em] shadow-2xl px-6 py-3 text-[0.75rem] w-full max-w-xs"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 600,
                              letterSpacing: "0.15em",
                            }}
                          >
                            Start Your Brand Quiz
                          </a>
                        )}
                      </motion.div>
                    </div>
                    
                    {/* Spread out text at bottom */}
                    <div className={`absolute ${isMobile ? "bottom-6 left-0 right-0 px-6" : "bottom-12 left-0 right-0 px-12"}`}>
                      <motion.div 
                        className={`flex ${isMobile ? "justify-between items-center" : "justify-between items-center"}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1, staggerChildren: 0.2 }}
                      >
                        <motion.p
                          className={`text-white/80 tracking-wide ${isMobile ? "text-xs" : "text-lg xl:text-xl"}`}
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 1.1 }}
                        >
                          No Shoots.
                        </motion.p>
                        <motion.p
                          className={`text-white/80 tracking-wide ${isMobile ? "text-xs" : "text-lg xl:text-xl"}`}
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1.3 }}
                        >
                          No Designers.
                        </motion.p>
                        <motion.p
                          className={`text-white/80 tracking-wide ${isMobile ? "text-xs" : "text-lg xl:text-xl"}`}
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 1.5 }}
                        >
                          No Stress.
                        </motion.p>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Brand Quiz CTA - On last image */}
                {index === galleryImages.length - 1 && (
                  <div className={`absolute inset-0 z-10 ${isMobile ? "px-6 py-20" : "px-20 py-24"}`}>
                    {/* Split diagonal design */}
                    <div className="absolute inset-0">
                      {/* Large question on left/top */}
                      <div className={`absolute ${isMobile ? "top-12 left-6 right-6" : "top-24 left-20 max-w-3xl"}`}>
                        <FadeInUp delay={0.2}>
                          <div className={`${isMobile ? "mb-4" : "mb-6"} flex items-center gap-4`}>
                            <div className={`${isMobile ? "w-8" : "w-12"} h-[2px] bg-white/60`} />
                            <p 
                              className={`${isMobile ? "text-[0.6rem]" : "text-xs"} text-white/50 uppercase tracking-[0.5em]`}
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                            >
                              AVERRA ASSESSMENT
                            </p>
                          </div>
                        </FadeInUp>
                        
                        <FadeInUp delay={0.3}>
                          <h2 
                            className={`${isMobile ? "text-[2.75rem] leading-[0.95]" : "text-[6.5rem] xl:text-[7.5rem] leading-[0.9]"} text-white uppercase mb-6`}
                            style={{ 
                              fontFamily: "Bebas Neue, sans-serif", 
                              fontWeight: 700, 
                              letterSpacing: "0.03em"
                            }}
                          >
                            What Is<br />
                            Your Brand<br />
                            Actually<br />
                            Saying?
                          </h2>
                        </FadeInUp>
                        
                        {/* Mobile description */}
                        {isMobile && (
                          <FadeInUp delay={0.4}>
                            <p 
                              className="text-base text-white/85 leading-relaxed mb-8 max-w-sm"
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}
                            >
                              Take the quick quiz and get a personalized breakdown of where you stand and what it&apos;s going to take to get to the next level.
                            </p>
                          </FadeInUp>
                        )}
                      </div>

                      {/* Description and CTAs on right/bottom */}
                      <div className={`absolute ${isMobile ? "bottom-12 left-6 right-6" : "bottom-24 right-20 max-w-2xl"}`}>
                        {/* Desktop description */}
                        {!isMobile && (
                          <FadeInUp delay={0.4}>
                            <p 
                              className="text-2xl xl:text-3xl text-white/90 leading-relaxed mb-10"
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.01em" }}
                            >
                              Take the quick quiz and get a personalized breakdown of where you stand and what it&apos;s going to take to get to the next level.
                            </p>
                          </FadeInUp>
                        )}
                        
                        {/* CTAs side by side */}
                        <div className={`grid ${isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-5"}`}>
                          <FadeInUp delay={0.5}>
                            {!isMobile ? (
                              <MagneticButton
                                href="/quiz"
                                className="bg-white text-black uppercase tracking-[0.3em] text-center px-8 py-5 text-sm hover:bg-white/90 transition-all duration-300"
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 700,
                                  letterSpacing: "0.15em",
                                }}
                              >
                                Take Quiz →
                              </MagneticButton>
                            ) : (
                              <a
                                href="/quiz"
                                className="block bg-white text-black uppercase tracking-[0.3em] text-center px-6 py-4 text-[0.7rem]"
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 700,
                                  letterSpacing: "0.15em",
                                }}
                              >
                                Take Quiz →
                              </a>
                            )}
                          </FadeInUp>
                          
                          <FadeInUp delay={0.6}>
                            {!isMobile ? (
                              <MagneticButton
                                href="/services"
                                className="bg-transparent border-2 border-white/70 text-white uppercase tracking-[0.3em] text-center px-8 py-5 text-sm hover:bg-white/10 transition-all duration-300"
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 600,
                                  letterSpacing: "0.15em",
                                }}
                              >
                                View Services
                              </MagneticButton>
                            ) : (
                              <a
                                href="/services"
                                className="block bg-transparent border-2 border-white/70 text-white uppercase tracking-[0.3em] text-center px-6 py-4 text-[0.7rem]"
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 600,
                                  letterSpacing: "0.15em",
                                }}
                              >
                                View Services
                              </a>
                            )}
                          </FadeInUp>
                        </div>
                        
                        {/* Small note */}
                        {!isMobile && (
                          <FadeInUp delay={0.7}>
                            <p 
                              className="text-xs text-white/40 uppercase tracking-[0.4em] mt-8 text-right"
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                            >
                              2 Minutes · Free Assessment
                            </p>
                          </FadeInUp>
                        )}
                      </div>
                      
                      {/* Diagonal accent line */}
                      {!isMobile && (
                        <motion.div
                          className="absolute top-1/2 left-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          style={{
                            transform: "translate(-50%, -50%) rotate(-25deg)",
                            transformOrigin: "center"
                          }}
                          initial={{ scaleX: 0, opacity: 0 }}
                          whileInView={{ scaleX: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.4 }}
                        />
                      )}
                    </div>
                  </div>
                )}
                
                {/* Editorial Content - Only on select images */}
                {editorialContent[index] && (
                  <div className={`absolute inset-0 z-10 ${isMobile ? "px-6" : "px-12"}`}>
                    {/* Vertical text watermark on select slides */}
                    {(index === 2 || index === 6 || index === 10) && (
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
                        <div className={`absolute ${isMobile ? "bottom-24 left-6" : "bottom-16 left-12"} max-w-lg`}>
                          <h3 
                            className={`${isMobile ? "text-7xl mb-3" : "text-[10rem] xl:text-[12rem] mb-6"} text-white uppercase leading-[0.85] whitespace-nowrap`}
                            style={{ 
                              fontFamily: "Bebas Neue, sans-serif", 
                              fontWeight: 400, 
                              letterSpacing: "0.08em",
                              textShadow: "0 8px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)"
                            }}
                          >
                            {editorialContent[index].title}
                          </h3>
                          <p 
                            className={`${isMobile ? "text-xs" : "text-sm xl:text-base"} text-white/80 uppercase tracking-[0.3em]`}
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                            {editorialContent[index].subtitle}
                          </p>
                          {'archiveDate' in editorialContent[index]! && (
                            <p 
                              className={`${isMobile ? "text-xs mt-2" : "text-sm mt-3"} text-white/50 uppercase tracking-[0.3em]`}
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                            >
                              {editorialContent[index].archiveDate}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Title overlay for slides with title but no number */}
                    {'title' in editorialContent[index]! && !('number' in editorialContent[index]!) && !('quote' in editorialContent[index]!) && !('process' in editorialContent[index]!) && (
                      <div className={`absolute ${isMobile ? "bottom-16 left-6 right-6" : "bottom-16 left-12"} max-w-lg`}>
                        <h3 
                          className={`${isMobile ? "text-5xl mb-2" : "text-[10rem] xl:text-[12rem] mb-6"} text-white uppercase leading-[0.85]`}
                          style={{ 
                            fontFamily: "Bebas Neue, sans-serif", 
                            fontWeight: 400, 
                            letterSpacing: "0.08em",
                            textShadow: "0 8px 24px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)"
                          }}
                        >
                          {editorialContent[index].title}
                        </h3>
                        <p 
                          className={`${isMobile ? "text-[0.65rem]" : "text-sm xl:text-base"} text-white/80 uppercase tracking-[0.3em]`}
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                          {editorialContent[index].subtitle}
                        </p>
                        {'archiveDate' in editorialContent[index]! && (
                          <p 
                            className={`${isMobile ? "text-[0.65rem] mt-1.5" : "text-sm mt-3"} text-white/50 uppercase tracking-[0.3em]`}
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                          >
                            {editorialContent[index].archiveDate}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Pull quote style for quote slides */}
                    {'quote' in editorialContent[index]! && (
                      <div className={`absolute inset-0 flex items-center ${isMobile ? "px-6" : "px-12"} justify-center`}>
                        <FadeInUp className={`${isMobile ? "max-w-md" : "max-w-2xl"} text-center`} delay={0.2}>
                          <div className={`${isMobile ? "mb-6" : "mb-8"} relative`}>
                            <motion.div 
                              className={`${isMobile ? "text-[120px]" : "text-[200px]"} leading-none text-white/10 absolute ${isMobile ? "-top-12 left-0" : "-top-16 left-8"}`}
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 0.1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8 }}
                            >
                              &ldquo;
                            </motion.div>
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
                        </FadeInUp>
                      </div>
                    )}
                    
                    {/* Stats display for stats slides */}
                    {'stats' in editorialContent[index]! && (
                      <div className={`absolute inset-0 flex items-center ${isMobile ? "px-6" : "px-12"} justify-center`}>
                        <div className={`${isMobile ? "max-w-md" : "max-w-4xl"} w-full`}>
                          <div className={`grid ${isMobile ? "grid-cols-1 gap-8" : "grid-cols-3 gap-12"}`}>
                            {editorialContent[index].stats.map((stat, i) => (
                              <div key={i} className="text-center">
                                <div 
                                  className={`${isMobile ? "text-6xl mb-3" : "text-8xl xl:text-9xl mb-6"} text-white`}
                                  style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                                >
                                  {stat.number}
                                </div>
                                <p 
                                  className={`${isMobile ? "text-xs" : "text-sm xl:text-base"} text-white/70 uppercase tracking-[0.3em]`}
                                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                >
                                  {stat.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* CTA slide for service teasers */}
                    {'cta' in editorialContent[index]! && (
                      <div className={`absolute inset-0 flex items-center ${isMobile ? "px-6" : "px-12"} justify-center`}>
                        <div className={`${isMobile ? "max-w-md" : "max-w-3xl"} text-center`}>
                          <h3 
                            className={`${isMobile ? "text-4xl mb-4" : "text-6xl xl:text-7xl mb-8"} text-white tracking-wide leading-tight`}
                            style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.03em" }}
                          >
                            {editorialContent[index].title}
                          </h3>
                          <p 
                            className={`${isMobile ? "text-base mb-6" : "text-2xl xl:text-3xl mb-10"} text-white/80 tracking-wider`}
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, letterSpacing: "0.15em" }}
                          >
                            {editorialContent[index].subtitle}
                          </p>
                          <a
                            href={editorialContent[index].ctaLink}
                            className={`inline-block bg-[#DCDACC] text-[#301710] uppercase tracking-[0.3em] shadow-2xl ${
                              isMobile 
                                ? "px-8 py-3 text-[0.65rem]" 
                                : "px-12 py-5 text-base hover:bg-[#BFBBA7] transition-all duration-300"
                            }`}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 600,
                              letterSpacing: "0.15em",
                            }}
                          >
                            {editorialContent[index].cta}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Process steps for process slides */}
                    {'process' in editorialContent[index]! && (
                      <div className={`absolute inset-0 flex items-center ${isMobile ? "px-6 py-8" : "px-12"} justify-center`}>
                        <div className={`${isMobile ? "max-w-md w-full" : "max-w-3xl w-full"}`}>
                          <div className={`text-center ${isMobile ? "mb-6" : "mb-12"}`}>
                            <h3 
                              className={`${isMobile ? "text-2xl mb-2" : "text-6xl mb-6"} text-white tracking-wide`}
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.05em" }}
                            >
                              {editorialContent[index].title}
                            </h3>
                            <p 
                              className={`${isMobile ? "text-xs" : "text-xl"} text-white/90 leading-relaxed italic`}
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 500 }}
                            >
                              {editorialContent[index].subtitle}
                            </p>
                          </div>
                          <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-3 gap-12"}`}>
                            {editorialContent[index].steps.map((step, i) => (
                              <div key={i} className={`text-center ${isMobile ? "space-y-1" : "space-y-3"}`}>
                                <div 
                                  className={`${isMobile ? "text-3xl" : "text-6xl"} text-white/20 ${isMobile ? "mb-1" : "mb-3"}`}
                                  style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}
                                >
                                  {step.number}
                                </div>
                                <h4 
                                  className={`${isMobile ? "text-base" : "text-2xl"} text-white ${isMobile ? "mb-1" : "mb-3"} uppercase tracking-wider`}
                                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                                >
                                  {step.label}
                                </h4>
                                <p 
                                  className={`${isMobile ? "text-[0.65rem]" : "text-sm"} text-white/70 leading-relaxed ${isMobile ? "mb-1" : "mb-3"}`}
                                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
                                >
                                  {step.subtitle}
                                </p>
                                <p 
                                  className={`${isMobile ? "text-xs" : "text-base"} text-white/90 leading-relaxed italic`}
                                  style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}
                                >
                                  {step.detail}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Text overlay for text slides */}
                    {'text' in editorialContent[index]! && !(('quote' in editorialContent[index]!) || ('process' in editorialContent[index]!)) && (
                      <div className={`absolute inset-0 flex items-center ${isMobile ? "px-6" : "px-12"} justify-center`}>
                        <FadeInUp className={`${isMobile ? "max-w-md" : "max-w-4xl"} text-center`} delay={0.2}>
                          <div 
                            className={`${isMobile ? "text-3xl" : "text-5xl xl:text-6xl"} text-white leading-tight italic space-y-6`}
                            style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                          >
                            {editorialContent[index].text.split('\\n\\n').map((paragraph, i) => (
                              <p key={i}>{paragraph}</p>
                            ))}
                          </div>
                        </FadeInUp>
                      </div>
                    )}
                    
                    {/* Split text overlay - top and bottom with decorative elements */}
                    {'splitText' in editorialContent[index]! && (
                      <>
                        {/* Top text */}
                        <FadeInUp 
                          className={`absolute ${isMobile ? "top-24 left-6 right-6" : "top-20 left-12 right-12"}`} 
                          delay={0.1}
                        >
                          <div className="relative">
                            {/* Decorative line above text */}
                            <motion.div 
                              className={`${isMobile ? "w-12 mb-3" : "w-16 mb-4"} h-[2px] bg-white/40`}
                              initial={{ width: 0 }}
                              whileInView={{ width: isMobile ? 48 : 64 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                            />
                            <p 
                              className={`${isMobile ? "text-lg" : "text-2xl xl:text-3xl"} text-white/90 leading-relaxed max-w-2xl`}
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                            >
                              {editorialContent[index].splitText.top}
                            </p>
                          </div>
                        </FadeInUp>

                        {/* Bottom text */}
                        <FadeInUp 
                          className={`absolute ${isMobile ? "bottom-24 right-6 left-6" : "bottom-20 right-12 left-12"} flex justify-end`} 
                          delay={0.3}
                        >
                          <div className="relative text-right">
                            <p 
                              className={`${isMobile ? "text-lg" : "text-2xl xl:text-3xl"} text-white/90 leading-relaxed max-w-2xl`}
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                            >
                              {editorialContent[index].splitText.bottom}
                            </p>
                            {/* Decorative line below text */}
                            <motion.div 
                              className={`${isMobile ? "w-12 mt-3 ml-auto" : "w-16 mt-4 ml-auto"} h-[2px] bg-white/40`}
                              initial={{ width: 0 }}
                              whileInView={{ width: isMobile ? 48 : 64 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.5 }}
                            />
                          </div>
                        </FadeInUp>
                      </>
                    )}
                    
                    {/* Centered split text overlay with side decorative lines */}
                    {'centeredSplit' in editorialContent[index]! && (
                      <div className={`absolute inset-0 flex flex-col justify-between ${isMobile ? "py-24 px-6" : "py-20 px-12"}`}>
                        {/* First statement */}
                        <FadeInUp delay={0.1}>
                          <div className="flex items-center justify-center gap-6">
                            <motion.div 
                              className={`${isMobile ? "w-16" : "w-24"} h-[1px] bg-white/30`}
                              initial={{ width: 0 }}
                              whileInView={{ width: isMobile ? 64 : 96 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                            />
                            <p 
                              className={`${isMobile ? "text-lg" : "text-2xl xl:text-3xl"} text-white/90 leading-relaxed text-center max-w-2xl`}
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                            >
                              {editorialContent[index].centeredSplit.first}
                            </p>
                            <motion.div 
                              className={`${isMobile ? "w-16" : "w-24"} h-[1px] bg-white/30`}
                              initial={{ width: 0 }}
                              whileInView={{ width: isMobile ? 64 : 96 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                            />
                          </div>
                        </FadeInUp>

                        {/* Second statement */}
                        <FadeInUp delay={0.3}>
                          <div className="flex items-center justify-center gap-6">
                            <motion.div 
                              className={`${isMobile ? "w-16" : "w-24"} h-[1px] bg-white/30`}
                              initial={{ width: 0 }}
                              whileInView={{ width: isMobile ? 64 : 96 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.5 }}
                            />
                            <p 
                              className={`${isMobile ? "text-lg" : "text-2xl xl:text-3xl"} text-white/90 leading-relaxed text-center max-w-2xl`}
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                            >
                              {editorialContent[index].centeredSplit.second}
                            </p>
                            <motion.div 
                              className={`${isMobile ? "w-16" : "w-24"} h-[1px] bg-white/30`}
                              initial={{ width: 0 }}
                              whileInView={{ width: isMobile ? 64 : 96 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.5 }}
                            />
                          </div>
                        </FadeInUp>
                      </div>
                    )}
                    
                    {/* L-shaped text overlay */}
                    {'lShapeText' in editorialContent[index]! && (
                      <>
                        {/* Left edge text */}
                        <FadeInUp 
                          className={`absolute ${isMobile ? "left-6 top-1/2 -translate-y-1/2" : "left-12 top-1/2 -translate-y-1/2"}`}
                          delay={0.1}
                        >
                          <div className="max-w-xs">
                            <p 
                              className={`${isMobile ? "text-base" : "text-xl xl:text-2xl"} text-white/90 leading-relaxed`}
                              style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                            >
                              {editorialContent[index].lShapeText.left}
                            </p>
                            {/* Small decorative accent */}
                            <motion.div 
                              className={`${isMobile ? "w-8 mt-3" : "w-12 mt-4"} h-[1px] bg-white/40`}
                              initial={{ width: 0 }}
                              whileInView={{ width: isMobile ? 32 : 48 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.4 }}
                            />
                          </div>
                        </FadeInUp>

                        {/* Bottom edge text */}
                        <FadeInUp 
                          className={`absolute ${isMobile ? "bottom-20 right-6 left-6" : "bottom-16 right-12 left-12"}`}
                          delay={0.3}
                        >
                          <div className="flex justify-end">
                            <div className="max-w-xl text-right">
                              {/* Small decorative accent */}
                              <motion.div 
                                className={`${isMobile ? "w-8 mb-3 ml-auto" : "w-12 mb-4 ml-auto"} h-[1px] bg-white/40`}
                                initial={{ width: 0 }}
                                whileInView={{ width: isMobile ? 32 : 48 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                              />
                              <p 
                                className={`${isMobile ? "text-base" : "text-xl xl:text-2xl"} text-white/90 leading-relaxed`}
                                style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                              >
                                {editorialContent[index].lShapeText.bottom}
                              </p>
                            </div>
                          </div>
                        </FadeInUp>
                      </>
                    )}
                    
                    {/* Bold statement overlay */}
                    {'boldStatement' in editorialContent[index]! && (
                      <div className={`absolute inset-0 flex flex-col justify-center ${isMobile ? "px-6 gap-6" : "px-12 gap-8"}`}>
                        {editorialContent[index].boldStatement.lines.map((line, i) => {
                          const getSizeClasses = () => {
                            if (line.size === "large") return isMobile ? "text-5xl" : "text-7xl xl:text-8xl";
                            if (line.size === "medium") return isMobile ? "text-3xl" : "text-4xl xl:text-5xl";
                            return isMobile ? "text-sm" : "text-xl xl:text-2xl";
                          };
                          
                          const getAlignClasses = () => {
                            if (line.align === "center") return "mx-auto text-center";
                            if (line.align === "right") return "ml-auto text-right";
                            return "mr-auto text-left";
                          };
                          
                          const getMaxWidth = () => {
                            if (line.size === "small") return isMobile ? "max-w-xs" : "max-w-2xl";
                            return "max-w-fit";
                          };
                          
                          return (
                            <FadeInUp key={i} delay={0.1 + i * 0.15}>
                              <div className={`${getAlignClasses()} ${getMaxWidth()}`}>
                                <p 
                                  className={`${getSizeClasses()} text-white/95 leading-tight ${line.size === "large" ? "uppercase tracking-wide" : "tracking-normal"}`}
                                  style={{ 
                                    fontFamily: line.size === "large" ? "Bebas Neue, sans-serif" : "Cormorant, serif", 
                                    fontWeight: line.size === "large" ? 700 : 300,
                                    letterSpacing: line.size === "large" ? "0.08em" : "0.02em"
                                  }}
                                >
                                  {line.text}
                                </p>
                              </div>
                            </FadeInUp>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Parallel statement overlay */}
                    {'parallelStatement' in editorialContent[index]! && (
                      <div className={`absolute inset-0 flex flex-col justify-center items-center ${isMobile ? "px-6 gap-16" : "px-12 gap-24"}`}>
                        {editorialContent[index].parallelStatement.pairs.map((pair, pairIndex) => (
                          <div key={pairIndex} className={`w-full ${isMobile ? "max-w-md" : "max-w-5xl"}`}>
                            {/* Emphasis label at top */}
                            <FadeInUp delay={0.1 + pairIndex * 0.4}>
                              <div className="flex justify-center mb-6">
                                <p 
                                  className={`${isMobile ? "text-sm" : "text-lg xl:text-xl"} text-white/40 uppercase tracking-[0.4em]`}
                                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                                >
                                  {pair.emphasis}
                                </p>
                              </div>
                            </FadeInUp>
                            
                            {/* Setup and payoff in visual flow */}
                            <div className={`flex ${isMobile ? "flex-col gap-3" : "flex-row items-center gap-12 justify-center"}`}>
                              {/* Setup */}
                              <FadeInUp delay={0.2 + pairIndex * 0.4}>
                                <p 
                                  className={`${isMobile ? "text-2xl" : "text-3xl xl:text-4xl"} text-white/90 leading-relaxed ${isMobile ? "text-center" : "text-right"} whitespace-nowrap`}
                                  style={{ fontFamily: "Cormorant, serif", fontWeight: 300, letterSpacing: "0.02em" }}
                                >
                                  {pair.setup}
                                </p>
                              </FadeInUp>
                              
                              {/* Arrow connector */}
                              {!isMobile && (
                                <FadeInUp delay={0.25 + pairIndex * 0.4}>
                                  <motion.div 
                                    className="flex items-center"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 0.6, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 + pairIndex * 0.4 }}
                                  >
                                    <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M0 16H45M45 16L30 2M45 16L30 30" stroke="white" strokeOpacity="0.6" strokeWidth="2.5"/>
                                    </svg>
                                  </motion.div>
                                </FadeInUp>
                              )}
                              
                              {/* Payoff */}
                              <FadeInUp delay={0.3 + pairIndex * 0.4}>
                                <p 
                                  className={`${isMobile ? "text-2xl" : "text-3xl xl:text-4xl"} text-white/90 leading-relaxed ${isMobile ? "text-center" : "text-left"} whitespace-nowrap`}
                                  style={{ fontFamily: "Cormorant, serif", fontWeight: 500, letterSpacing: "0.02em" }}
                                >
                                  {pair.payoff}
                                </p>
                              </FadeInUp>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* Cookie Consent Banner - Sticky at bottom, expands on click */}
      <CookieConsent />
    </>
  );
}
