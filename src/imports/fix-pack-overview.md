Fix Pack Overview (do all of these)
A) Stop React #306 (undefined component) by fixing routing + router package
1) Ensure correct router dependency

In package.json dependencies, you must have:

"react-router-dom": "^6.0.0"

Then install:

npm i react-router-dom
2) Fix App.tsx RouterProvider import + remove crashy extras

Replace src/app/App.tsx with:

// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

This does not change visuals. It just stops “monitoring scripts” from masking the real UI and reduces random runtime crashes.

3) Replace routes with a known-good react-router-dom router

Create/replace: src/app/routes.tsx (and ensure App.tsx imports ./routes correctly)

// src/app/routes.tsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

import { HomePage } from "@/app/pages/HomePage";
import { ServicesPage } from "@/app/pages/ServicesPage";
import { AboutPage } from "@/app/pages/AboutPage";
import { ContactPage } from "@/app/pages/ContactPage";
import { QuizPage } from "@/app/pages/QuizPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/services", element: <ServicesPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/quiz", element: <QuizPage /> },
]);

This fixes “homepage showing services content” and eliminates a huge source of #306 errors.

B) Eliminate duplicate components (Figma Make’s biggest breakage)

You must have exactly one HowItWorks component export in the repo.

4) Ensure HowItWorks is ONLY here:

✅ src/app/components/HowItWorks.tsx

…and NOT inside QuickShowcase.tsx (or anywhere else).

Use this full file (background image stays background; no visual change):

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
          <h2
            className="text-[clamp(2.5rem,6vw,4rem)] text-white mb-8"
            style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}
          >
            How It Works
          </h2>
          <p
            className="text-xl md:text-2xl text-white font-semibold italic max-w-2xl mx-auto"
            style={{ fontFamily: "Cormorant, serif" }}
          >
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
                    <div className={`relative text-center ${index === 0 ? "pt-0" : "pt-0"}`}>
                      <div className="mb-4">
                        <span
                          className="text-6xl md:text-7xl text-white"
                          style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}
                        >
                          {step.number}
                        </span>
                      </div>

                      <div>
                        <h3
                          className="text-2xl md:text-3xl text-white mb-4"
                          style={{ fontFamily: "Cormorant, serif", fontWeight: 700 }}
                        >
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
5) Fix QuickShowcase.tsx so it exports ONLY QuickShowcase

Remove any accidental export function HowItWorks() from it.

Use public assets as strings (not import ... from "/...").

Use this pattern:

// src/app/components/QuickShowcase.tsx
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
  // keep your existing logic/markup; just ensure images come from allImages above
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ...your existing showcase markup here...
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* use allImages[currentIndex] etc */}
    </section>
  );
}
C) Fix HomePage stability (remove lazy and router Link)

Figma + multiple exports makes lazy() explode into #306. To stabilize:

6) Replace HomePage.tsx to use direct imports + <a> button

(Visual styling unchanged; it’s the same button classes.)

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

export function HomePage() {
  const isMobile = useIsMobile();

  const heroImage = "/about-hero.png";
  const [heroImageError, setHeroImageError] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setHeroImageLoaded(true);
  }, []);

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
D) Fix “assets missing / background images not loading”
7) Create public/ at repo root and place files there

These must exist exactly (case-sensitive):

public/how-it-works.png
public/about-hero.png
public/home-hero.png          (if used)
public/services-hero.png
public/quiz-hero.png
public/about-ABOUT.png
public/about-averra.png
public/carousel-1.webp
...
public/carousel-8.webp

And then reference them by string paths (like "/how-it-works.png"). Do not import from /public.

E) Fix typography mismatch (fonts not loading)
8) Add font imports once in your global CSS

In your main CSS file (where Tailwind base/imports are), add:

@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Cormorant:wght@300;400;600;700&family=Inter:wght@300;400;600;700&display=swap");

This restores the typography your inline fontFamily: 'Cormorant...' expects.

F) Fix the 401 (Deployment Protection)

If your git-main URL is 401, that’s Vercel Deployment Protection.

Vercel Project → Settings → Deployment Protection

Turn off protection for Preview/Production as desired

This is not a code change, but it’s required if you want the link publicly accessible.

Final “Tell Figma” instruction

Tell Figma Make to update GitHub with these rules:

Use react-router-dom for all web routing (RouterProvider, createBrowserRouter, Link if needed)

Do not duplicate component names across files (only one HowItWorks)

Do not use import image from "/file.png" for public assets—use "/file.png" strings

Keep HomePage direct-imported components until stable (no lazy/Suspense)