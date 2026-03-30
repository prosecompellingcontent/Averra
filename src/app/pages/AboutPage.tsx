import { Navigation } from "@/app/components/Navigation";
import { useIsMobile } from "@/app/hooks/useIsMobile";

export function AboutPage() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#D4CFC1] pb-32 md:pb-0">
      <Navigation />
      
      {/* Section 1 - About AVERRA */}
      <div className="relative py-20 lg:py-40 px-6 lg:px-8 bg-[#D4CFC1] overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#A88F6B]/10 rounded-full blur-3xl hidden lg:block"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="col-span-12 lg:col-span-4">
              <div className="relative">
                <div className="absolute -left-2 lg:-left-4 top-0 text-[4rem] lg:text-[8rem] text-[#A88F6B]/20 leading-none" style={{ fontFamily: 'Cormorant, serif' }}>01</div>
                <h2 
                  className="text-[2.5rem] lg:text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-[#1E2823] relative z-10"
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
                >
                  About<br/><span className="text-[#425145] italic">AVERRA</span>
                </h2>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-6">
              <div className="bg-[#1E2823] p-6 lg:p-10 relative group lg:hover:translate-x-2 transition-transform duration-300">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#A88F6B]"></div>
                <p 
                  className="text-[1.5rem] lg:text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] text-[#D4CFC1] mb-4 lg:mb-6"
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}
                >
                  Talent fills the chair.<br/>
                  <span className="text-[#A88F6B] italic">Brand fills the calendar.</span>
                </p>
                <p 
                  className="text-base lg:text-xl leading-relaxed text-[#D4CFC1]/80"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  Most entrepreneurs do not struggle because they lack skill. They struggle because their brand does not reflect how good they <span className="text-[#A88F6B]">actually are</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 - The Gap */}
      <div className="relative py-20 lg:py-40 px-6 lg:px-8 bg-[#C9C4B6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="col-span-12 lg:col-span-4">
              <div className="relative">
                <div className="absolute -left-2 lg:-left-4 top-0 text-[4rem] lg:text-[8rem] text-[#1E2823]/10 leading-none" style={{ fontFamily: 'Cormorant, serif' }}>02</div>
                <h2 
                  className="text-[2.5rem] lg:text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-[#1E2823] relative z-10"
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
                >
                  The<br/><span className="text-[#A88F6B] italic">Gap</span>
                </h2>
                <div className="w-16 lg:w-20 h-1 bg-[#A88F6B] mt-4 lg:mt-6"></div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-6">
              <div className="space-y-4 lg:space-y-6 text-lg lg:text-xl leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
                <p className="text-[#1E2823]/90">
                  Most brands start with an intention. A goal they’re working toward. A presence they want to be known for.
                </p>
                <div className="pl-4 lg:pl-6 space-y-2 lg:space-y-3 text-base lg:text-lg text-[#425145]">
                  <p>The talent evolves.</p>
                  <p>The pricing inches up.</p>
                  <p>The clientele improves.</p>
                </div>
                <p className="text-[#1E2823]/80 pt-4 border-l-4 border-[#A88F6B] pl-4 lg:pl-6 lg:hover:pl-8 transition-all duration-300">
                  But the visuals stay the same as when you first started. This almost never fully supports the level you intended to step into. The gap is subtle. But it shows up everywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - What We Do */}
      <div className="relative py-20 lg:py-40 px-6 lg:px-8 bg-[#D4CFC1] overflow-hidden">
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#425145]/5 rounded-full blur-3xl hidden lg:block"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="col-span-12 lg:col-span-4">
              <div className="relative">
                <div className="absolute -left-2 lg:-left-4 top-0 text-[4rem] lg:text-[8rem] text-[#A88F6B]/20 leading-none" style={{ fontFamily: 'Cormorant, serif' }}>03</div>
                <h2 
                  className="text-[2.5rem] lg:text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-[#1E2823] relative z-10"
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
                >
                  What We<br/><span className="text-[#425145] italic">Do</span>
                </h2>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-6">
              <div className="space-y-6 lg:space-y-8">
                <div className="bg-[#A88F6B] p-6 lg:p-8 relative group lg:hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute -top-2 -right-2 w-full h-full border-2 border-[#1E2823] -z-10 lg:group-hover:translate-x-1 lg:group-hover:translate-y-1 transition-transform duration-300"></div>
                  <p className="text-xl lg:text-2xl text-[#1E2823] font-medium" style={{ fontFamily: 'Cormorant, serif' }}>
                    AVERRA was built to close that gap.
                  </p>
                </div>
                <p className="text-base lg:text-lg leading-relaxed text-[#1E2823]/80" style={{ fontFamily: 'Lora, serif' }}>
                  AVERRA was created to align your beauty brand with the intention you already set out for it to be. We look at what you’re trying to create, identify where it’s not translating clearly, and define how it should actually present to create that perception you intended to have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 - Strategy First */}
      <div className="relative py-20 lg:py-40 px-6 lg:px-8 bg-[#1E2823]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="col-span-12 lg:col-span-4">
              <div className="relative">
                <div className="absolute -left-2 lg:-left-4 top-0 text-[4rem] lg:text-[8rem] text-[#A88F6B]/20 leading-none" style={{ fontFamily: 'Cormorant, serif' }}>04</div>
                <h2 
                  className="text-[2.5rem] lg:text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-[#D4CFC1] relative z-10"
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
                >
                  Strategy<br/><span className="text-[#A88F6B] italic">First</span>
                </h2>
                <div className="flex gap-2 mt-4 lg:mt-8">
                  <div className="w-8 lg:w-12 h-1 bg-[#A88F6B]"></div>
                  <div className="w-6 lg:w-8 h-1 bg-[#A88F6B]/50"></div>
                  <div className="w-3 lg:w-4 h-1 bg-[#A88F6B]/30"></div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-6">
              <div className="space-y-6 lg:space-y-8">
                <div className="relative">
                  <div className="text-[6rem] lg:text-[12rem] text-[#A88F6B]/10 absolute -top-10 lg:-top-20 -left-6 lg:-left-10 leading-none select-none" style={{ fontFamily: 'Cormorant, serif' }}>"</div>
                  <p 
                    className="text-xl lg:text-2xl leading-relaxed text-[#A88F6B] italic relative z-10 mb-4 lg:mb-6"
                    style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}
                  >
                    The skill is not the problem.
                  </p>
                </div>
                <p 
                  className="text-base lg:text-lg leading-relaxed text-[#D4CFC1]/80"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  Most have already set the level they’re trying to reach. What’s missing is alignment between that level and how their brand actually shows up. It’s about perception. If a brand’s perception is inconsistent, it gets questioned. That’s where the gap forms.
                </p>
                <p 
                  className="text-lg lg:text-xl leading-relaxed text-[#D4CFC1] pt-2 lg:pt-4"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  AVERRA exists to correct that. We build what’s already created &amp; translate properly. Clients don’t book what they have to figure out. They book what’s clear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5 - The Shift */}
      <div className="relative py-20 lg:py-40 px-6 lg:px-8 bg-[#C9C4B6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="col-span-12 lg:col-span-4">
              <div className="relative lg:sticky lg:top-32">
                <div className="absolute -left-2 lg:-left-4 top-0 text-[4rem] lg:text-[8rem] text-[#1E2823]/10 leading-none" style={{ fontFamily: 'Cormorant, serif' }}>05</div>
                <h2 
                  className="text-[2.5rem] lg:text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-[#1E2823] relative z-10"
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
                >
                  The<br/><span className="text-[#425145] italic">Shift</span>
                </h2>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-6">
              <div className="space-y-5 lg:space-y-6">
                <p className="text-base lg:text-lg leading-relaxed text-[#1E2823]/80" style={{ fontFamily: 'Lora, serif' }}>
                  We don’t create more content. We do not keep up with trends. We align your brand to operate at the level you intended to step into.
                </p>
                <p className="text-base lg:text-lg leading-relaxed text-[#1E2823]/80" style={{ fontFamily: 'Lora, serif' }}>
                  Perception happens fast in the beauty industry. Before someone reads your caption, they’ve already decided what your brand feels like. If your visuals don’t support your level, you get positioned below it.
                </p>
                <div className="bg-[#1E2823] p-6 lg:p-8 mt-6 lg:mt-8">
                  <div className="space-y-3 lg:space-y-4 text-base lg:text-lg text-[#D4CFC1]" style={{ fontFamily: 'Lora, serif' }}>
                    <p className="text-[#A88F6B] italic text-lg lg:text-xl" style={{ fontFamily: 'Cormorant, serif' }}>
                      We don’t create more content. We do not keep up with trends.
                    </p>
                    <p className="text-xl lg:text-2xl text-[#D4CFC1] font-medium" style={{ fontFamily: 'Cormorant, serif' }}>
                      It is about alignment.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 lg:space-y-3 pt-4 lg:pt-6 text-base lg:text-lg text-[#425145]" style={{ fontFamily: 'Lora, serif' }}>
                  <p>Perception happens fast in the beauty industry.</p>
                  <p>Before someone reads your caption, they’ve already decided what your brand feels like.</p>
                  <p>If your visuals don’t support your level, you get positioned below it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6 - Who It's For */}
      <div className="relative py-20 lg:py-40 px-6 lg:px-8 bg-[#425145] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-[#A88F6B]/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="col-span-12 lg:col-span-4">
              <div className="relative">
                <div className="absolute -left-2 lg:-left-4 top-0 text-[4rem] lg:text-[8rem] text-[#A88F6B]/30 leading-none" style={{ fontFamily: 'Cormorant, serif' }}>06</div>
                <h2 
                  className="text-[2.5rem] lg:text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] text-[#D4CFC1] relative z-10"
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
                >
                  Who It's<br/><span className="text-[#A88F6B] italic">For</span>
                </h2>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-6">
              <div className="space-y-6 lg:space-y-8">
                <p className="text-lg lg:text-xl leading-relaxed text-[#D4CFC1]/90" style={{ fontFamily: 'Lora, serif' }}>
                  AVERRA exists for the beauty brands who already know their visuals are not fully operating at their highest yet. For the business that is stepping into something bigger and needs its presence to reflect that.
                </p>
                <div className="border-l-4 border-[#A88F6B] pl-6 lg:pl-8 py-3 lg:py-4">
                  <div className="space-y-2 text-xl lg:text-2xl text-[#D4CFC1]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                    <p>Visibility should not pause.</p>
                    <p className="text-[#A88F6B] italic">Neither should the brand.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 lg:py-40 px-6 lg:px-8 bg-[#D4CFC1]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="col-span-12 lg:col-span-4">
              <div className="relative">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#A88F6B] rounded-full absolute -top-6 -left-6 lg:-top-8 lg:-left-8 opacity-30"></div>
                <p 
                  className="text-[2.5rem] lg:text-[clamp(2.5rem,5vw,4rem)] leading-[1] text-[#1E2823] relative z-10"
                  style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}
                >
                  Ready to<br/><span className="text-[#425145] italic">begin?</span>
                </p>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-6">
              <div className="flex flex-col gap-4">
                <a
                  href="/services"
                  className="group relative inline-block px-10 lg:px-12 py-5 lg:py-6 bg-[#1E2823] text-[#D4CFC1] uppercase tracking-[0.3em] text-xs lg:text-sm overflow-hidden transition-all duration-300 text-center"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  <span className="relative z-10">View Services</span>
                  <div className="absolute inset-0 bg-[#A88F6B] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </a>
                <a
                  href="/quiz"
                  className="group relative inline-block px-10 lg:px-12 py-5 lg:py-6 bg-transparent border-2 border-[#1E2823] text-[#1E2823] uppercase tracking-[0.3em] text-xs lg:text-sm overflow-hidden transition-all duration-300 text-center"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  <span className="relative z-10 group-hover:text-[#D4CFC1] transition-colors duration-300">Take The Quiz</span>
                  <div className="absolute inset-0 bg-[#1E2823] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
