// src/app/components/QuickShowcase.tsx
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";

const allImages = [
  "/carousel-1.webp",
  "/carousel-2.webp",
  "/carousel-3.webp",
  "/carousel-4.webp",
  "/carousel-5.webp",
  "/carousel-6.webp",
  "/carousel-7.webp",
  "/carousel-8.webp",
];

export function QuickShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const isMobile = useIsMobile();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;

    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) setCurrentIndex((prev) => (prev + 1) % allImages.length);
      else setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  useEffect(() => {
    const preloadImage = (index: number) => {
      if (loadedImages.has(index) || imageErrors.has(index)) return;

      const img = new Image();
      img.onload = () => setLoadedImages((prev) => new Set([...prev, index]));
      img.onerror = () => setImageErrors((prev) => new Set([...prev, index]));
      img.src = allImages[index];
    };

    preloadImage(currentIndex);
    preloadImage((currentIndex + 1) % allImages.length);
    preloadImage((currentIndex - 1 + allImages.length) % allImages.length);
  }, [currentIndex, loadedImages, imageErrors]);

  const handleImageError = () => {
    setImageErrors((prev) => new Set([...prev, currentIndex]));
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 z-0">
        {allImages.map((image, index) => {
          const isActive = currentIndex === index;
          const isAdjacent =
            isMobile &&
            (index === (currentIndex + 1) % allImages.length ||
              index === (currentIndex - 1 + allImages.length) % allImages.length);

          if (isMobile && !isActive && !isAdjacent) return null;

          const isSecondToLast = index === allImages.length - 2;
          const isLast = index === allImages.length - 1;

          return (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 1 : 0 }}
            >
              <img
                src={image}
                alt={`AI Model ${index + 1}`}
                className="w-full h-full object-cover"
                style={isSecondToLast || isLast ? { objectPosition: "center 35%" } : undefined}
                loading={index === 0 ? "eager" : "lazy"}
                onError={isActive ? handleImageError : undefined}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 z-10" />
      </div>

      <div className="relative z-20 flex items-center justify-center min-h-screen py-32 px-8">
        <div className="text-center max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#BFBBA7] font-light mb-4">AI Model Gallery</p>
          <h2
            className="text-[clamp(2.5rem,8vw,6rem)] text-[#DCDACC] mb-8"
            style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}
          >
            See The Transformation
          </h2>
          <p
            className="text-lg text-[#BFBBA7] max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "Cormorant, serif" }}
          >
            You deserve branding that matches your talent. AVERRA creates it.
          </p>

          <div className="flex gap-2 justify-center mt-12">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex ? "bg-[#DCDACC] w-12" : "bg-[#BFBBA7]/40 w-8"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 md:p-4 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % allImages.length)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 md:p-4 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white px-3 py-1 rounded text-sm">
        {currentIndex + 1} / {allImages.length}
      </div>
    </section>
  );
}


// src/app/components/HowItWorks.tsx
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useIsMobile } from "@/app/hooks/useIsMobile";

export function HowItWorks() {
  const isMobile = useIsMobile();

  const steps = [
    {
      number: "01",
      title: "Choose Your Tier",
      description: ["Essentials, Signature, or Muse.", "Built for where you are now", "and where you're headed."],
    },
    {
      number: "02",
      title: "Strategize",
      description: [
        "Answer a few quick questions at checkout.",
        "After checkout, complete a short brand customization form.",
        "",
        "Clarity first.",
        "Creation second.",
      ],
    },
    {
      number: "03",
      title: "Get Your Visuals",
      description: ["Delivered in 7–10 business days.", "", "Ready to use.", "Ready to elevate."],
    },
  ];

  return (
    <section className="relative bg-[#2d1810] py-28 px-8 overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="/how-it-works.png"
          alt="Luxury abstract beauty visual"
          className="w-full h-full object-cover scale-x-[-1]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#DCDACC]/[0.15]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white font-semibold mb-6">The Process</p>
          <h2 className="text-[clamp(2.5rem,6vw,4rem)] text-white mb-8" style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}>
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-white font-semibold italic max-w-2xl mx-auto" style={{ fontFamily: "Cormorant, serif" }}>
            Your brand shouldn&apos;t go quiet when bookings slow down.
          </p>
        </div>

        <div className="space-y-0 mb-20">
          {steps.map((step, index) => {
            const StepWithAnimation = () => {
              const stepRef = useRef(null);
              const isInView = useInView(stepRef, { once: true, amount: 0.3 });
              const Container = isMobile ? "div" : motion.div;

              return (
                <Container
                  ref={stepRef}
                  {...(!isMobile && {
                    initial: { opacity: 0, y: 20 },
                    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
                    transition: { duration: 0.5, ease: "easeOut" },
                  })}
                >
                  <div>
                    <div className="relative text-center pt-0">
                      <div className="mb-4">
                        <span className="text-6xl md:text-7xl text-white" style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}>
                          {step.number}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl md:text-3xl text-white mb-4" style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}>
                          {step.title}
                        </h3>

                        <div className="space-y-3 max-w-2xl mx-auto">
                          {step.description.map((line, lineIndex) =>
                            line ? (
                              <p
                                key={lineIndex}
                                className="text-base md:text-lg text-white leading-relaxed"
                                style={{ fontFamily: "Cormorant, serif", fontWeight: 600, fontStyle: "italic" }}
                              >
                                {line}
                              </p>
                            ) : (
                              <div key={lineIndex} className="h-2" />
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="flex justify-center my-8">
                        <svg
                          width="48"
                          height={index === 0 ? "135" : "165"}
                          viewBox={`0 0 48 ${index === 0 ? "135" : "165"}`}
                          fill="none"
                          className="text-white/60"
                        >
                          <path
                            d={
                              index === 0
                                ? "M24 0 L24 120 M24 120 L14 110 M24 120 L34 110"
                                : "M24 0 L24 150 M24 150 L14 140 M24 150 L34 140"
                            }
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </Container>
              );
            };

            return <StepWithAnimation key={step.number} />;
          })}
        </div>
      </div>
    </section>
  );
}
