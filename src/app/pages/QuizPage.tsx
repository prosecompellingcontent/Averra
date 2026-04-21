import { useState } from "react";
import { Navigation } from "@/app/components/Navigation";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { trackQuizCompletion, trackAction } from "@/utils/analytics";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useMemo } from "react";
import { getImageUrl } from "@/utils/imageHelpers";

const questions = [
  {
    id: 1,
    question: "What's actually going on with your brand right now?",
    options: [
      { text: "My brand doesn't match the work I'm putting out", type: "system" },
      { text: "I don't know how my clients view me", type: "perception" },
      { text: "It's fine but I'm ready to grow", type: "expansion" },
      { text: "There's no real brand, I'm starting from zero", type: "system" }
    ]
  },
  {
    id: 2,
    question: "Be honest, what do think is affecting you most?",
    options: [
      { text: "My content is all over the place", type: "system" },
      { text: "Clients aren't loyal to me and I don't know why", type: "perception" },
      { text: "The more I post the less engagement I get", type: "expansion" },
      { text: "Nothing feels intentional or put together", type: "system" }
    ]
  },
  {
    id: 3,
    question: "Which part do you keep avoiding?",
    options: [
      { text: "Figuring out my brand identity", type: "system" },
      { text: "Actual structure behind my content", type: "perception" },
      { text: "Building something worth maintaining long term", type: "expansion" },
      { text: "Admitting I don't know where to start", type: "system" }
    ]
  },
  {
    id: 4,
    question: "If a potential client landed on your page today, what would they see?",
    options: [
      { text: "Outdated content that doesn't reflect my current skill", type: "system" },
      { text: "Something decent but I'm not sure what impression it leaves", type: "perception" },
      { text: "Good work but it looks different every time", type: "expansion" },
      { text: "Something that doesn't represent me at all", type: "system" }
    ]
  },
  {
    id: 5,
    question: "What's actually stopping you from charging more?",
    options: [
      { text: "My brand doesn't look like it's worth more yet", type: "system" },
      { text: "I'm not confident in how I'm coming across", type: "perception" },
      { text: "My content is too inconsistent to justify it", type: "expansion" },
      { text: "Everything needs to be rebuilt before I can", type: "system" }
    ]
  },
  {
    id: 6,
    question: "How long has this been an issue?",
    options: [
      { text: "I never had a real foundation", type: "system" },
      { text: "Something has always felt slightly off", type: "perception" },
      { text: "It started when I began growing", type: "expansion" },
      { text: "It got to a point where I had to stop and reset", type: "system" }
    ]
  },
  {
    id: 7,
    question: "How do you feel about your content currently?",
    options: [
      { text: "Nothing feels consistent", type: "system" },
      { text: "Fine but I'm not sure it's working", type: "perception" },
      { text: "Like it's hard to keep up with", type: "expansion" },
      { text: "Like I'm guessing every single time", type: "system" }
    ]
  },
  {
    id: 8,
    question: "What do you actually need right now?",
    options: [
      { text: "A brand that finally looks like what I want to do", type: "system" },
      { text: "To understand miscommunication with future clients and why", type: "perception" },
      { text: "A foundation that holds as my brand grows", type: "expansion" },
      { text: "A clear direction. I'm starting from scratch", type: "system" }
    ]
  },
  {
    id: 9,
    question: "What would actually change if this was fixed?",
    options: [
      { text: "My brand would finally match my skill", type: "system" },
      { text: "I'd know exactly how clients are seeing me", type: "perception" },
      { text: "I could grow without my brand falling apart", type: "expansion" },
      { text: "I'd stop second guessing everything I put out", type: "system" }
    ]
  },
  {
    id: 10,
    question: "What's the real priority right now?",
    options: [
      { text: "Building something that actually reflects my expertise", type: "system" },
      { text: "Finding out where my brand is losing people", type: "perception" },
      { text: "Creating structure I can sustain as I scale", type: "expansion" },
      { text: "Getting clear direction so I can move forward", type: "system" }
    ]
  }
]

export function QuizPage() {
  const isMobile = useIsMobile();
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const selectedOption = questions[currentQuestion].options[optionIndex];
      const answerType = typeof selectedOption === 'string' ? 'system' : selectedOption.type;
      trackQuizCompletion(answerType === 'perception' ? "Brand Perception Audit" : answerType === 'expansion' ? "Brand Expansion Audit" : "AVERRA Brand Alignment System", newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const getTierRecommendation = useMemo(() => {
    if (answers.length === 0) return "AVERRA Brand Alignment System";

    const typeCounts = { system: 0, perception: 0, expansion: 0 };

    answers.forEach((answerIndex, questionIndex) => {
      const option = questions[questionIndex].options[answerIndex];
      const type = typeof option === 'string' ? 'system' : option.type;
      typeCounts[type as keyof typeof typeCounts]++;
    });

    if (typeCounts.perception > typeCounts.system && typeCounts.perception > typeCounts.expansion) {
      return "Brand Perception Audit";
    } else if (typeCounts.expansion > typeCounts.system && typeCounts.expansion > typeCounts.perception) {
      return "Brand Expansion Audit";
    } else {
      return "AVERRA Brand Alignment System";
    }
  }, [answers]);

  const getTierContent = useMemo(() => {
    return (tier: string) => {
      if (tier === "Brand Perception Audit") {
        return {
          subtitle: "Your brand needs a focused evaluation to understand what's not translating.",
          sections: [
            {
              title: "Here's What We're Seeing",
              content: "You have a brand presence, but something feels off and you're not sure exactly what's lowering your perceived value.\n\nYour visuals might look decent at first glance, but when someone scrolls through, the message isn't landing. Elements conflict. The cohesion is missing. And as a result, your brand doesn't communicate the level of work you're actually delivering.\n\nYou don't need a full rebuild. You need clarity on what's not working."
            },
            {
              title: "What You Need Right Now",
              subtitle: "Brand Perception Audit",
              content: "A focused evaluation of how your brand is currently being seen.\n\nWhat This Covers: Message clarity, visual consistency, perceived value, and content performance.\n\nWhat Is Identified: Where your brand loses its message, where visuals conflict, and what is lowering how your work is perceived.\n\nYou'll receive a clear breakdown of what's not translating so you know exactly what needs to change."
            },
            {
              title: "What Changes After This",
              content: "You'll have a clear understanding of what's holding your brand back and a roadmap for what needs to be corrected. No more guessing. You'll know exactly where the gaps are and how to close them."
            }
          ]
        };
      } else if (tier === "Brand Expansion Audit") {
        return {
          subtitle: "Your brand needs structured support to scale without losing consistency.",
          sections: [
            {
              title: "Here's What We're Seeing",
              content: "Your brand has a foundation, but as output increases, consistency is starting to slip.\n\nThis happens when you're creating more content, booking more clients, or expanding your offerings but your brand wasn't built with systems that can hold that growth.\n\nYour visuals start to drift. Your messaging becomes less cohesive. And over time, the brand you worked to build no longer feels aligned. You don't need to start over. You need an extension that supports where you're going."
            },
            {
              title: "What You Need Right Now",
              subtitle: "Brand Expansion Audit",
              content: "An extension of your brand system designed to support growth without losing consistency.\n\nWhat This Covers: Scaling content, maintaining visual alignment, and reinforcing brand standards at a higher level.\n\nWhat Is Identified: Where your brand begins to drift as output increases and what is needed to maintain control.\n\nYou'll receive guidance on how to scale confidently without losing your brand identity."
            },
            {
              title: "What Changes After This",
              content: "Your brand remains consistent, aligned, and recognizable as it grows. You'll have the structure to scale confidently, knowing your brand won't lose its identity in the process."
            }
          ]
        };
      } else {
        return {
          subtitle: "Your brand needs clear direction, visual alignment, and consistent structure.",
          sections: [
            {
              title: "Here's What We're Seeing",
              content: "You're talented, skilled, and ready for more. But somewhere between the work you do and how you show up, there's a disconnect.\n\nYour content may feel scattered. Your pricing may not reflect your value. Your visuals may contradict each other. And when potential clients land on your page, they're not seeing the full picture of what you offer.\n\nThis isn't about working harder or doing better work. It's about alignment.\n\nWhen your brand communicates clearly, clients recognize your value immediately. When it doesn't, they scroll past regardless of how good you actually are."
            },
            {
              title: "What You Need Right Now",
              subtitle: "The AVERRA Brand Alignment System",
              content: "You need a complete system that addresses perception, translation, visual clarity, and consistency.\n\nThe AVERRA Brand Alignment System takes you through three critical stages:\n\nInterpretation: We define what your brand is actually trying to communicate. \n\nAlignment: We evaluate your visuals through a our 6 step visual system. Any inconsistencies are corrected so your visuals no longer conflict and your perceived value is elevated.\n\nStabilization: We create defined visual direction custom to your brand so that it's no longer inconsistent. This removes confusion and burnout for long term consistency.\n\nYou walk away with a custom brand direction, aligned visual framework, corrected perception and brand positioning, and a structured content system with clear standards for future content."
            },
            {
              title: "What Happens If You Don't Fix This",
              content: "You may keep attracting price shoppers instead of ideal clients. You may keep second guessing your rates. You may lose bookings to competitors who aren't better than you, just better branded.\n\nAnd you stay stuck in the cycle of I'll fix my brand later when later never comes."
            },
            {
              title: "What Happens If You Do",
              content: "Your brand becomes clear, consistent, and recognizable. Your content holds together. Your pricing feels justified. Clients see you at the level you're actually operating at.\n\nYou stop blending into an oversaturated market and start standing out with intention."
            }
          ]
        };
      }
    };
  }, []);

  const getColorScheme = useMemo(() => {
    return () => {
      const schemes = [
        { name: "Deep Noir & Champagne", colors: ["#0d0d0d", "#f9f6f0", "#d4c5a9"] },
        { name: "Midnight & Gold", colors: ["#0d0d0d", "#d4c5a9", "#f9f6f0"] },
        { name: "Couture Spring", colors: ["#f9f6f0", "#0d0d0d", "#d4c5a9"] }
      ];
      return schemes[answers[0] % schemes.length];
    };
  }, [answers]);

  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#fdf5f7]">
        <Navigation />

        {/* Intro - Centered elegant design over gradient */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Soft gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#fdf5f7] via-[#c9969e]/10 to-[#fdf5f7]"></div>

          {/* Subtle decorative elements */}
          <div className="absolute inset-0 opacity-5 hidden md:block">
            <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#c9969e] rounded-full blur-[100px]"></div>
            <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-[#251218] rounded-full blur-[90px]"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
            <div className="mb-16">
              <div className="inline-block px-10 py-3 bg-[#c9969e]/10 border border-[#c9969e]/30 backdrop-blur-sm mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                  Brand Assessment
                </p>
              </div>

              <h1
                className="text-[clamp(3rem,8vw,6rem)] text-[#251218] leading-[0.95] mb-12"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
              >
                Where Does Your Brand<br/>
                <span className="italic font-light">Stand?</span>
              </h1>

              <div className="w-20 h-px bg-[#c9969e] mx-auto mb-16"></div>

              <div className="space-y-6 mb-16 max-w-2xl mx-auto">
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  You've grown a lot since you first started.
                </p>
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  Your work is better. Your clientele is better. Your standards are higher.
                </p>
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  But sometimes the brand doesn't evolve at the same pace.
                </p>
              </div>

              <button
                onClick={() => setShowIntro(false)}
                className={`group relative inline-block px-16 py-6 bg-[#251218] text-[#fdf5f7] uppercase tracking-[0.5em] text-sm overflow-hidden ${
                  !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218] hover:scale-105" : ""
                } transition-all duration-700`}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
              >
                <span className="relative z-10">Begin Assessment</span>
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full ${!isMobile ? "group-hover:translate-x-full" : ""} transition-transform duration-1000`}></div>
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-[#c9969e] to-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const tier = getTierRecommendation;
    const colorScheme = getColorScheme();
    const tierContent = getTierContent(tier);

    return (
      <div className="min-h-screen bg-[#fdf5f7] text-[#251218] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 hidden md:block">
          <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-[#c9969e] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#251218] rounded-full blur-[90px]"></div>
        </div>

        <div className="relative z-10">
          <Navigation />
          <div className="max-w-5xl mx-auto px-8 py-32">

            <div className="text-center mb-32">
              <div className="inline-block mb-12 px-12 py-4 bg-white/50 backdrop-blur-sm border-y border-[#c9969e]/30">
                <p className="text-xs uppercase tracking-[0.5em] text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                  Your Results
                </p>
              </div>

              <div className="relative inline-block mb-12">
                <div className="absolute inset-0 bg-[#c9969e]/20 blur-[80px]"></div>
                <div className="relative px-16 py-10 bg-white/30 backdrop-blur-md border border-[#c9969e]/30 shadow-[0_20px_60px_rgba(201,150,158,0.15)]">
                  <h1
                    className="text-[clamp(2.5rem,8vw,5.5rem)] text-[#251218] leading-[0.95]"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                  >
                    {tier}
                  </h1>
                </div>
              </div>

              <p
                className="text-xl text-[#251218]/70 max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: "Lora, serif", fontWeight: 300, fontStyle: "italic" }}
              >
                {tierContent.subtitle}
              </p>
            </div>

            <div className="space-y-20 mb-32">
              {tierContent.sections.map((section, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-12 -top-12 text-[8rem] text-[#c9969e]/8 leading-none select-none z-10" style={{ fontFamily: "Playfair Display, serif" }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="relative bg-white/40 backdrop-blur-sm p-16 border-l-2 border-[#c9969e] hover:bg-white hover:shadow-[0_20px_60px_rgba(201,150,158,0.15)] transition-all duration-700 z-0">
                    <h2
                      className="text-3xl text-[#251218] mb-8"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                    >
                      {section.title}
                    </h2>

                    {section.subtitle && (
                      <div>
                        <div className="w-16 h-px bg-[#c9969e] mb-6"></div>
                        <p
                          className="text-xl text-[#c9969e] mb-8"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300, fontStyle: "italic" }}
                        >
                          {section.subtitle}
                        </p>
                      </div>
                    )}

                    <div className="text-base text-[#251218]/80 leading-relaxed whitespace-pre-line" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to={tier === "AVERRA Brand Alignment System" ? "/services" : "/services#audits"}
                onClick={() => {
                  sessionStorage.setItem(
                    "selectedServiceTier",
                    JSON.stringify({
                      id: tier.toLowerCase().replace(/\s+/g, '-'),
                      name: tier,
                      type: "service",
                    })
                  );
                  trackAction("CTA Click", { location: "Quiz Results", tier });
                }}
                className={`group relative inline-block px-24 py-7 bg-[#251218] text-[#fdf5f7] uppercase tracking-[0.5em] text-sm overflow-hidden ${
                  !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218] hover:scale-105" : ""
                } transition-all duration-700`}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
              >
                <span className="relative z-10">Get Started</span>
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full ${!isMobile ? "group-hover:translate-x-full" : ""} transition-transform duration-1000`}></div>
              </Link>

              <div className="mt-12">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers([]);
                  }}
                  className="text-sm text-[#251218]/60 uppercase tracking-[0.3em] hover:text-[#c9969e] transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf5f7] text-[#251218] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 hidden md:block">
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-[#c9969e] rounded-full blur-[90px]"></div>
        <div className="absolute bottom-40 left-20 w-[450px] h-[450px] bg-[#251218] rounded-full blur-[80px]"></div>
      </div>

      <Navigation />
      <div className="relative max-w-4xl mx-auto px-8 py-24 min-h-screen flex flex-col justify-center">
        <div className="mb-20">
          {/* Progress - Rose gold dots */}
          <div className="flex justify-center items-center gap-3 mb-16">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index <= currentQuestion
                    ? 'w-3 h-3 bg-[#c9969e]'
                    : 'w-2 h-2 bg-[#c9969e]/20'
                } rounded-full`}
              />
            ))}
          </div>

          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.5em] text-[#251218]/40 mb-8" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
              Question {currentQuestion + 1} of {questions.length}
            </p>

            <h1
              className="text-[clamp(1.75rem,5vw,3rem)] text-[#251218] leading-[1.2]"
              style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              {questions[currentQuestion].question}
            </h1>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`group w-full text-center relative bg-white/40 backdrop-blur-sm px-10 py-8 border border-[#c9969e]/20 ${
                  !isMobile ? "hover:border-[#c9969e] hover:bg-white hover:shadow-[0_10px_40px_rgba(201,150,158,0.15)] hover:-translate-y-1" : ""
                } transition-all duration-500 overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-[#c9969e]/0 via-[#c9969e]/10 to-[#c9969e]/0 -translate-x-full ${!isMobile ? "group-hover:translate-x-0" : ""} transition-transform duration-700`}></div>
                <span className="relative text-lg text-[#251218]" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  {typeof option === 'string' ? option : option.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {currentQuestion > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-3 text-sm text-[#251218]/60 uppercase tracking-[0.3em] hover:text-[#c9969e] transition-colors mx-auto"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}
          >
            <ArrowLeft size={16} />
            Previous
          </button>
        )}
      </div>
    </div>
  );
}
