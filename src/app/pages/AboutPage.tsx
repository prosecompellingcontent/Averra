// src/app/pages/AboutPage.tsx
import { Navigation } from "@/app/components/Navigation";
import { useIsMobile } from "@/app/hooks/useIsMobile";

export function AboutPage() {
  const isMobile = useIsMobile();
  const cardClass = "glass-effect border border-white/30 p-8 md:p-12";

  // ✅ UPDATED: file exists in /public as about-ABOUT.png, so use root URL path
  const bgImage = "/about-ABOUT.png";

  return (
    <div className="min-h-screen bg-[#DCDACC] text-[#301710] relative">
      {!isMobile && (
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-[#DCDACC]/40" />
        </div>
      )}

      <div className="relative z-10">
        <Navigation />

        <div className="max-w-4xl mx-auto px-8 py-24 md:py-32">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#654331] font-light mb-4">
              About AVERRA
            </p>
            <h1
              className="text-[clamp(2.5rem,8vw,4.5rem)] text-[#301710] leading-tight mb-8"
              style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}
            >
              Talent fills the chair.<br />
              A brand fills the calendar.
            </h1>
          </div>

          <div className="space-y-16">
            <div className={cardClass}>
              <p className="text-base text-[#301710] font-normal leading-relaxed mb-4" style={{ fontFamily: "Lora, serif" }}>
                In the beauty industry, skill is rarely the issue. It&apos;s visibility.
              </p>
              <p className="text-base text-[#301710] font-normal leading-relaxed mb-4" style={{ fontFamily: "Lora, serif" }}>
                There are stylists creating flawless color but posting inconsistently. Lash artists posting perfect sets but blending into similar feeds. Estheticians produce glowing results without content that reflect their level.
              </p>
              <p className="text-base text-[#301710] font-normal leading-relaxed" style={{ fontFamily: "Lora, serif" }}>
                The work is strong. The presentation isn&apos;t.
              </p>
            </div>

            <div className={cardClass}>
              <p className="text-2xl text-[#301710] mb-4 font-semibold" style={{ fontFamily: "Cormorant, serif", fontWeight: 600 }}>
                The Perception Gap
              </p>
              <div className="text-base text-[#301710] font-normal leading-relaxed space-y-4" style={{ fontFamily: "Lora, serif" }}>
                <p>
                  Clients book what they can see. Perception forms before an appointment is ever scheduled. If the content looks unorganized, your pricing may feel like it&apos;s negotiable. When the brand looks elevated, expectations shift. When expectations shift, the entire client experience changes.
                </p>
                <p>
                  <strong className="text-[#301710] font-semibold">AVERRA was built to close that gap.</strong>
                </p>
                <p>
                  We use strategy to create AI-powered brand imagery structured with intention and built specifically for beauty professionals who are growing and raising their standards.
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <p className="text-2xl text-[#301710] mb-4 font-semibold" style={{ fontFamily: "Cormorant, serif", fontWeight: 600 }}>
                AI Is Simply a Tool
              </p>
              <div className="text-base text-[#301710] font-normal leading-relaxed space-y-4" style={{ fontFamily: "Lora, serif" }}>
                <p>AI in beauty can feel unfamiliar. It can raise some questions.</p>
                <p>However, AI is simply a tool.</p>
                <p>A camera is a tool. Lighting is a tool. Social media is a tool.</p>
                <p>
                  AVERRA does not replace real work, real results, or real clients. It supports how that work is presented. Every visual is created for marketing and brand-building purposes to strengthen consistency, elevate perception, and maintain visibility even when content slows.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={cardClass}>
                <p className="text-2xl text-[#301710] mb-4 font-semibold" style={{ fontFamily: "Cormorant, serif", fontWeight: 600 }}>
                  Strategy First
                </p>
                <p className="text-base text-[#301710] font-normal leading-relaxed" style={{ fontFamily: "Lora, serif" }}>
                  We start with you: your goals, your ideal clientele, your goals &amp; aspirations. Every design decision is intentional.
                </p>
              </div>

              <div className={cardClass}>
                <p className="text-2xl text-[#301710] mb-4 font-semibold" style={{ fontFamily: "Cormorant, serif", fontWeight: 600 }}>
                  AI-Powered Precision
                </p>
                <p className="text-base text-[#301710] font-normal leading-relaxed" style={{ fontFamily: "Lora, serif" }}>
                  Our custom AI models create visuals that feel uniquely yours. No stock photos. No generic templates. Just your brand, custom made to be elevated.
                </p>
              </div>

              <div className={cardClass}>
                <p className="text-2xl text-[#301710] mb-4 font-semibold" style={{ fontFamily: "Cormorant, serif", fontWeight: 600 }}>
                  Luxury Accessibility
                </p>
                <p className="text-base text-[#301710] font-normal leading-relaxed" style={{ fontFamily: "Lora, serif" }}>
                  High-end branding shouldn&apos;t require a five-figure budget. We&apos;ve made premium design accessible through a seamless process and smart technology.
                </p>
              </div>

              <div className={cardClass}>
                <p className="text-2xl text-[#301710] mb-4 font-semibold" style={{ fontFamily: "Cormorant, serif", fontWeight: 600 }}>
                  Results-Driven Design
                </p>
                <p className="text-base text-[#301710] font-normal leading-relaxed" style={{ fontFamily: "Lora, serif" }}>
                  Beautiful isn&apos;t enough. Your brand needs to convert. We design with booking rates, perceived value, and premium positioning in mind.
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <p className="text-2xl text-[#301710] mb-4 font-semibold" style={{ fontFamily: "Cormorant, serif", fontWeight: 600 }}>
                When Presentation Matches Talent
              </p>
              <div className="text-base text-[#301710] font-normal leading-relaxed space-y-4" style={{ fontFamily: "Lora, serif" }}>
                <p>
                  When beauty professionals finally see their work reflected at the level it deserves, the right clients feel easier to attract.
                </p>
                <p>
                  AVERRA exists to ensure talent and presentation match so visibility never depends on chances.
                </p>
              </div>
            </div>

            <div className={cardClass}>
              <p className="text-2xl text-[#301710] mb-4 font-semibold" style={{ fontFamily: "Cormorant, serif", fontWeight: 600 }}>
                The Standard
              </p>
              <div className="text-base text-[#301710] font-normal leading-relaxed space-y-4" style={{ fontFamily: "Lora, serif" }}>
                <p>
                  AVERRA exists to create alignment between the level of the work and the way that work is presented to the world. Alignment is always the standard.
                </p>
                <p>
                  Perfection has never been a requirement. However, we help brands communicate themselves at the right level, to the right audience, with consistency. Beauty professionals should not have to choose between looking established and remaining financially practical, nor should elevated branding be limited to five-figure agencies disconnected from the ideal client.
                </p>
                <p>
                  Technology makes leveling up more accessible than ever before, but this accessibility without direction creates noise. AI is simply a tool and custom brand strategy is what gives it purpose. When that structure is in place, everything else moves effortlessly.
                </p>
              </div>
            </div>

            <div className="text-center pt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/services"
                  className="inline-block px-10 py-4 bg-[#301710] text-[#DCDACC] uppercase tracking-[0.3em] hover:bg-[#654331] transition-all duration-300 shadow-lg"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 700 }}
                >
                  Explore All Tiers
                </a>
                <a
                  href="/services"
                  className="inline-block px-10 py-4 glass-effect-light border border-white/40 text-[#301710] uppercase tracking-[0.3em] hover:bg-white/30 transition-all"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 700 }}
                >
                  Browse Digital Products
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
