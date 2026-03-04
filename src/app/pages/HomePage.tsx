// src/app/pages/HomePage.tsx
import React, { useCallback, useState } from "react";
import { Navigation } from "@/app/components/Navigation";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { QuickShowcase } from "@/app/components/QuickShowcase";
import { ServiceTeaser } from "@/app/components/ServiceTeaser";
import { HowItWorks } from "@/app/components/HowItWorks";
import { BenefitsStrip } from "@/app/components/BenefitsStrip";
import { AboutAVERRA } from "@/app/components/AboutAVERRA";
import { CTAFooter } from "@/app/components/CTAFooter";
import { MobileDebug } from "@/app/components/MobileDebug";

type AnyComponent = unknown;
function assertComponent(name: string, c: AnyComponent) {
  if (!c) throw new Error(`[Import Error] ${name} is undefined.`);
}

export function HomePage() {
  assertComponent("Navigation", Navigation);
  assertComponent("QuickShowcase", QuickShowcase);
  assertComponent("ServiceTeaser", ServiceTeaser);
  assertComponent("HowItWorks", HowItWorks);
  assertComponent("BenefitsStrip", BenefitsStrip);
  assertComponent("AboutAVERRA", AboutAVERRA);
  assertComponent("CTAFooter", CTAFooter);
  assertComponent("MobileDebug", MobileDebug);

  const isMobile = useIsMobile();
  const heroImage = new URL("../../../public/about-hero.webp", import.meta.url).toString();

  const [heroImageError, setHeroImageError] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => setHeroImageLoaded(true), []);
  const handleImageError = useCallback(() => {
    console.error("Hero image failed to load:", heroImage);
    setHeroImageError(true);
  }, [heroImage]);

  return (
    <div className="min-h-screen bg-[#221412] text-neutral-100">
      <Navigation />

      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2d1810]">
          {!heroImageError ? (
            <>
              {!heroImageLoaded && (
                <div className="absolute inset-0 bg-[#2d1810] flex items-center justify-center">
                  <div className="text-white/40 text-sm">Loading...</div>
                </div>
              )}

              <img
                src={heroImage}
                alt="Hero background"
                className="w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={
                  isMobile
                    ? {
                        imageRendering: "auto",
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                        willChange: "auto",
                      }
                    : undefined
                }
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/40" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[#2d1810] flex items-center justify-center">
              <div className="text-white/40 text-sm">Image failed to load</div>
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
          <h2
            className={`whitespace-nowrap text-white/10 select-none ${
              isMobile
                ? "text-[clamp(6rem,14vw,16rem)]"
                : "text-[10rem] xl:text-[12rem] 2xl:text-[14rem]"
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

        <div className={`relative max-w-3xl mx-auto z-10 px-8 ${isMobile ? "mt-[11rem]" : "mt-31"}`}>
          <div className={`space-y-2 ${isMobile ? "" : "mb-6"}`}>
            <p
              className={`leading-relaxed text-white/95 text-center ${
                isMobile ? "text-[clamp(1.75rem,6vw,6rem)]" : "text-4xl xl:text-5xl 2xl:text-6xl"
              }`}
              style={{ fontFamily: "Cormorant, serif", fontWeight: 400 }}
            >
              Beauty&apos;s New Blueprint
            </p>
            <p
              className={`text-white/80 tracking-wide text-center ${
                isMobile ? "text-[clamp(1.125rem,2.5vw,2rem)]" : "text-xl xl:text-2xl"
              }`}
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
            >
              Hesitation Is Expensive.
            </p>
          </div>

          <div className={`space-y-4 text-center ${isMobile ? "mt-8" : ""}`}>
            <a
              href="/quiz"
              className={`inline-block px-12 py-4 bg-[#DCDACC] text-[#301710] uppercase tracking-[0.3em] ${
                !isMobile ? "hover:bg-[#BFBBA7] transition-all duration-300" : ""
              } shadow-2xl`}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
              }}
            >
              Start Your Brand Quiz
            </a>

            <p
              className={`text-white/80 tracking-wide ${
                isMobile ? "text-[clamp(1.125rem,2.5vw,2rem)]" : "text-xl xl:text-2xl"
              }`}
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
            >
              No Shoots. No Designers. No Stress.
            </p>
          </div>
        </div>
      </section>

      <QuickShowcase />
      <ServiceTeaser />
      {!isMobile && <HowItWorks />}
      <BenefitsStrip />
      <AboutAVERRA />
      <CTAFooter />
      {isMobile && <MobileDebug />}
    </div>
  );
}
