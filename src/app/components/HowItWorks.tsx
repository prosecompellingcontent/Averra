import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useIsMobile } from "@/app/hooks/useIsMobile";

export function HowItWorks() {
  const isMobile = useIsMobile();

  // MUST be inside the component so it cannot be out-of-scope
  const beautyImage = "/how-it-works.png";

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
      {/* Background Image with Overlay - Creates translucent bleed-through effect */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={beautyImage}
          alt="Luxury abstract beauty visual"
          className="w-full h-full object-cover scale-x-[-1]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#DCDACC]/[0.15]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Steps */}
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
