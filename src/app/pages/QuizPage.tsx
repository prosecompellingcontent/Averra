import { useState } from "react";
import { Navigation } from "@/app/components/Navigation";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { trackQuizCompletion, trackAction } from "@/utils/analytics";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useMemo } from "react";
import { getImageUrl } from "@/utils/imageHelpers";
import quizIntroImage from "figma:asset/d4efda984c6dfad6114ef6098e5b6b2c3fb062d2.png";

const questions = [
  {
    id: 1,
    question: "When you look at your brand online, what's the real feeling?",
    options: [
      "It doesn't reflect how good I actually am",
      "It feels a little scattered",
      "It's good, but it's not giving premium",
      "It looks fine… but it doesn't feel like me anymore"
    ]
  },
  {
    id: 2,
    question: "Have you ever hesitated raising your prices because of how your brand looks?",
    options: [
      "Yes. My content isn't there yet",
      "Sometimes. I know I'm undercharging",
      "I already raised them, but my brand still feels off",
      "No. I just want consistency"
    ]
  },
  {
    id: 3,
    question: "Before someone books, what do you think they assume about you?",
    options: [
      "They're talented",
      "They're affordable",
      "They're busy",
      "They're established"
    ]
  },
  {
    id: 4,
    question: "When you don't have new client photos to post, what do you usually do?",
    options: [
      "I throw something together",
      "My page starts looking random",
      "I repost older work",
      "I slow down and post less"
    ]
  },
  {
    id: 5,
    question: "Which one feels the most accurate right now?",
    options: [
      "My brand doesn't reflect my skill level",
      "My content feels old",
      "I'm ready to raise my prices and look the part",
      "My business is bigger than what my brand shows"
    ]
  },
  {
    id: 6,
    question: "If you're being honest, what feels missing?",
    options: [
      "Consistency",
      "Clear direction",
      "That premium feel",
      "Real structure behind it"
    ]
  },
  {
    id: 7,
    question: "When you hear \"AI\" in beauty, what's your honest reaction?",
    options: [
      "I'm not sure how that really works in this industry",
      "I don't want anything that looks fake",
      "If it's done well, I'm open",
      "I care more about the outcome"
    ]
  },
  {
    id: 8,
    question: "What are you actually building right now?",
    options: [
      "A stronger foundation",
      "A more elevated presence",
      "A name people recognize",
      "A business that lasts"
    ]
  },
  {
    id: 9,
    question: "If your brand finally matched your level, what would change first?",
    options: [
      "I'd market differently",
      "I'd charge differently",
      "I'd attract differently",
      "I'd operate differently"
    ]
  },
  {
    id: 10,
    question: "What feels true in your gut?",
    options: [
      "I'm ready to take my brand seriously",
      "I'm ready to be seen at a higher level",
      "I'm ready to raise my standards",
      "I'm ready to build something long term"
    ]
  }
];

export function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const isMobile = useIsMobile();

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const avgAnswer = newAnswers.reduce((a, b) => a + b, 0) / newAnswers.length;
      const tier = avgAnswer < 1 ? "AVERRA Muse" : avgAnswer < 2 ? "AVERRA Signature" : "AVERRA Essentials";
      trackQuizCompletion(tier, newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const getTierRecommendation = useMemo(() => {
    if (answers.length === 0) return "AVERRA Essentials";
    const avgAnswer = answers.reduce((a, b) => a + b, 0) / answers.length;
    if (avgAnswer < 1) return "AVERRA Muse";
    if (avgAnswer < 2) return "AVERRA Signature";
    return "AVERRA Essentials";
  }, [answers]);

  const getTierContent = useMemo(() => {
    return (tier: string) => {
      if (tier === "AVERRA Essentials") {
        return {
          subtitle: "From the start you've been building in the background, but it's time to step into your light.",
          sections: [
            {
              title: "Here's What We're Seeing",
              content: "You're talented, that's not the question. You wouldn't be here if you weren't.\n\nBut somewhere between doing the work and showing the work, things got stuck. Your content may feel scattered. Your social media may not quite match the level you're operating at.\n\nWhen you think about raising your prices or positioning yourself where you should be in the market, there's hesitation because your brand doesn't back it up yet.\n\nThat is costing you clients. It's costing you confidence. It's keeping you playing smaller than you actually are. This first step is about getting your foundation right so when people land on your page, they don't scroll past, they stop, scroll, & book."
            },
            {
              title: "What You Need Right Now",
              subtitle: "You need a solid foundation.",
              content: "You need clarity, consistency, and a brand that finally reflects the skill you've been building behind the scenes.\n\nAVERRA Essentials gives you that foundation:\n\nWith 10 custom AI brand models created specifically for your business, these visuals give your brand a steady presence from the start.\n\nYou'll get a focused strategy session to define your brand tone and audience alignment.\n\nYou'll also receive a Brand Presence Guide clarifying what your content communicates, the pricing it supports, and how perception shapes opportunity along with a defined Visual System to keep consistency across platforms.\n\nEssentials builds the foundation so your presentation finally reflects your level.\n\nThis is the structure that makes everything else easier. The visuals that let you raise your prices without second-guessing. The clarity that turns hesitation into confidence."
            },
            {
              title: "What Happens If You Don't Fix This",
              content: "You may keep starting over. You may keep second-guessing your prices and losing clients to people who aren't better than you, just better branded.\n\nAnd you stay stuck in the cycle of \"I'll fix my brand later\" when later never comes."
            },
            {
              title: "What Happens If You Do",
              content: "Your brand finally matches your skill. Your content may get stronger. You may even stop hesitating before you post. You can confidently raise your prices and it feels justified. Clients stop price-shopping and start booking. You walk into your brand like you own it.\n\nBecause you do."
            }
          ]
        };
      } else if (tier === "AVERRA Muse") {
        return {
          subtitle: "You've outgrown winging it and are ready to build something that actually lasts.",
          sections: [
            {
              title: "Here's What We're Seeing",
              content: "You've built something real already so you don't have to start over.\n\nYour clients trust you. Your work speaks for itself. What your answers reflect is that your brand is running on momentum. Momentum helps you build but will not sustain expansion without strategy.\n\nRight now, you may be managing your company like you're still solo when you're trying to or have expanded already. Your content may not position you as the expert you've become. And when you think about launching a course, building a team, or stepping into a bigger market your brand may feel like a liability and not an asset.\n\nThat gap is holding you back from your next level."
            },
            {
              title: "What You Need Right Now",
              subtitle: "You Need Systems That Scale",
              content: "You need a tactical strategy that scales with you. Something that positions you a Founder or CEO, not just another option in the market.\n\nAVERRA Muse gives you that structure:\n\nWith 30 custom AI company models built to support the full scope of a growing business including services, retail, launches, team features, and expansion moments. This gives you a full visual library designed to carry the company's content as it grows.\n\nYou'll receive a dedicated Executive Strategy Session centered on pricing confidence, market positioning, and business evolution. As revenue grows and responsibility expands, the company's brand must reflect that maturity.\n\nMuse also includes a complete Company System outlining tone, content presentation, industry standards, along with a Team Alignment Strategy Guide to ensure consistency across assistants, stylists, or multi-chair operations.\n\nThis will set the foundation for long-term growth."
            },
            {
              title: "What Happens If You Don't Fix This",
              content: "Your company may expand but the weight of that expansion may feel heavier. More chaotic. More reactive. Your brand becomes the thing you \"deal with\" instead of the thing that drives your business.\n\nAnd eventually, the lack of structure limits how far you can scale, especially with a team."
            },
            {
              title: "What Happens If You Do",
              content: "Your company becomes your engine. You can launch with confidence and ease. You can scale without losing clarity. You step into spaces with confidence that requires premium pull and your brand backs it all up.\n\nYou stop being \"good for your area\" and start being the standard."
            }
          ]
        };
      } else {
        return {
          subtitle: "You're ready to elevate your presence and attract the clients who value what you offer.",
          sections: [
            {
              title: "Here's What We're Seeing",
              content: "You've built something real. Your work is strong. Your clients are loyal.\n\nBut when you look at your brand, you know it could be more. It doesn't reflect the level you're operating at. It doesn't position you as premium. You may think about attracting higher-end clients or raising your rates, your content may feel like they're holding you back due to the brand presence that communicates it."
            },
            {
              title: "What You Need Right Now",
              subtitle: "Elevated Presence",
              content: "You don't need basic templates or a full luxury rebrand. You need a strategy for elevation.\n\nAVERRA Signature gives you that:\n\n20 custom AI brand models designed for premium positioning. A comprehensive strategy session focused on audience refinement and market differentiation. Complete visual guidelines that maintain consistency across all platforms.\n\nThis is the bridge between where you are and where you're going. The brand system that finally matches your ambition."
            },
            {
              title: "What Happens If You Don't Fix This",
              content: "You may keep attracting price-shoppers instead of your ideal clientele. You may keep second-guessing your rates. You may keep watching other beauty pros with similar skills charge more because their brand looks the part. The gap between where you are and where you want to be keeps widening."
            },
            {
              title: "What Happens If You Do",
              content: "Your brand may feel more aligned. Your content may look more intentional. You can raise your prices with confidence. Clients can see you as premium, not because you told them, but because everything about your presence communicates it. Stop competing on price and start attracting value."
            }
          ]
        };
      }
    };
  }, []);

  const getColorScheme = useMemo(() => {
    return () => {
      const schemes = [
        { name: "Deep Espresso & Champagne", colors: ["#301710", "#DCDACC", "#654331"] },
        { name: "Rose Gold & Blush", colors: ["#b76e79", "#f4e4e6", "#d4a5a5"] },
        { name: "Warm Luxury", colors: ["#654331", "#BFBBA7", "#DCDACC"] },
        { name: "Bold Contrast", colors: ["#1a1a1a", "#ffffff", "#c9a97e"] }
      ];
      return schemes[answers[0] % schemes.length];
    };
  }, [answers]);

  if (showResults) {
    const tier = getTierRecommendation;
    const colorScheme = getColorScheme();
    const tierContent = getTierContent(tier);

    return (
      <div className="min-h-screen bg-[#f4e4e6] text-[#301710] relative overflow-hidden pb-32 md:pb-0">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b76e79]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#301710]/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Navigation />
          <div className={`max-w-5xl mx-auto px-8 ${isMobile ? "py-16" : "py-24"}`}>
            
            {/* Hero Results Section */}
            <div className="text-center mb-16">
              <div className="inline-block mb-8 px-8 py-3 bg-white/60 border border-[#b76e79]/30 rounded-full">
                <p className="text-xs uppercase tracking-[0.4em] text-[#b76e79] font-semibold">
                  Your Results Are In
                </p>
              </div>
              
              <h1 className="text-[clamp(2.5rem,8vw,4rem)] text-[#301710] mb-8 leading-tight" style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
                You're Ready For
              </h1>
              
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-[#b76e79]/20 blur-xl"></div>
                <h2 className="relative text-[clamp(3.5rem,10vw,6rem)] text-[#301710] leading-none px-8 py-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 600 }}>
                  {tier}
                </h2>
              </div>
              
              <p className="text-2xl text-[#b76e79] max-w-3xl mx-auto font-medium italic leading-relaxed" style={{ fontFamily: 'Cormorant, serif' }}>
                {tierContent.subtitle}
              </p>
            </div>

            {/* Content Sections in Alternating Layout */}
            <div className="space-y-12 mb-20">
              {tierContent.sections.map((section, index) => (
                <div 
                  key={index} 
                  className={`glass-effect border border-white/40 p-8 md:p-12 ${
                    index % 2 === 0 
                      ? 'md:ml-0 md:mr-12' 
                      : 'md:ml-12 md:mr-0'
                  } transform ${!isMobile ? 'hover:scale-[1.02] hover:shadow-2xl' : ''} transition-all duration-500`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#b76e79]/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#b76e79]" style={{ fontFamily: 'Cormorant, serif' }}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl text-[#301710] mb-2 font-semibold" style={{ fontFamily: 'Cormorant, serif', fontWeight: 600 }}>
                        {section.title}
                      </h3>
                      {section.subtitle && (
                        <p className="text-xl text-[#b76e79] font-semibold italic" style={{ fontFamily: 'Cormorant, serif' }}>
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-base text-[#301710] font-normal leading-relaxed whitespace-pre-line pl-16" style={{ fontFamily: 'Lora, serif' }}>
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section with Visual Flair */}
            <div className="text-center pt-12 pb-20">
              <div className="mb-12">
                <h3 className="text-5xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 600 }}>
                  Ready to Transform?
                </h3>
                <p className="text-2xl text-[#b76e79] font-semibold" style={{ fontFamily: 'Cormorant, serif' }}>
                  Let's build your brand the right way
                </p>
              </div>
              
              {/* Primary CTA - Extra Prominent */}
              <div className="mb-8">
                <Link
                  to="/services"
                  onClick={() => trackAction('quiz_cta_click', { button: 'get_started', tier })}
                  className={`inline-block px-16 py-6 bg-[#301710] text-[#f4e4e6] text-sm uppercase tracking-[0.4em] font-semibold ${!isMobile ? 'hover:bg-[#b76e79] hover:scale-105 hover:shadow-2xl' : ''} transition-all duration-500 shadow-xl`}
                >
                  Get Started with {tier}
                </Link>
              </div>

              {/* Secondary Options in Grid */}
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
                <Link
                  to="/services"
                  onClick={() => trackAction('quiz_cta_click', { button: 'explore_tiers', tier })}
                  className={`px-8 py-5 glass-effect border border-[#b76e79]/50 text-[#301710] text-sm uppercase tracking-[0.3em] font-semibold ${!isMobile ? 'hover:bg-white/50 hover:border-[#b76e79] hover:scale-105' : ''} transition-all duration-500`}
                >
                  Explore All Tiers
                </Link>
                <Link
                  to="/services"
                  onClick={() => trackAction('quiz_cta_click', { button: 'browse_products', tier })}
                  className={`px-8 py-5 glass-effect border border-[#b76e79]/50 text-[#301710] text-sm uppercase tracking-[0.3em] font-semibold ${!isMobile ? 'hover:bg-white/50 hover:border-[#b76e79] hover:scale-105' : ''} transition-all duration-500`}
                >
                  Browse Digital Products
                </Link>
              </div>

              {/* Final encouragement */}
              <div className="pt-8 border-t border-[#b76e79]/20 max-w-2xl mx-auto">
                <p className="text-lg text-[#301710]/80 italic" style={{ fontFamily: 'Cormorant, serif' }}>
                  Your brand deserves to match the beauty you create every day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Intro screen before quiz questions
  if (showIntro) {
    return (
      <div className="min-h-svh flex flex-row">
        {/* Left Side - Quiz Intro */}
        <div className="w-1/2 bg-[#12080A] text-[#F1E9E9] relative z-10">
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#12080A]/95">
            <Navigation />
          </div>
          <div className={`mx-auto ${isMobile ? 'px-4 py-16' : 'px-8 py-32'} max-w-2xl min-h-svh flex flex-col justify-center items-center`}>
            <div className="text-center w-full">
              <p className={`uppercase tracking-[0.4em] text-[#F1E9E9]/60 mb-4 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
                Brand Assessment
              </p>
              <p className={`text-[#F1E9E9]/80 mb-6 font-light ${isMobile ? 'text-xl' : 'text-3xl'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                Be Honest.
              </p>
              <h1 className={`text-[#F1E9E9] mb-12 leading-[0.95] ${isMobile ? 'text-[clamp(1.5rem,6vw,3rem)]' : 'text-[clamp(3rem,8vw,5.5rem)]'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                Does Your Brand<br />Match Your Work?
              </h1>
              <div className={`text-[#F1E9E9]/90 font-light mx-auto leading-relaxed mb-16 ${isMobile ? 'text-sm max-w-xs' : 'text-xl max-w-xl'}`} style={{ fontFamily: 'Lora, serif' }}>
                <p className="mb-6">You've grown a lot since you first started.</p>
                <div className="space-y-2 mb-6">
                  <p>Your work is better.</p>
                  <p>Your clientele is better.</p>
                  <p>Your standards are higher.</p>
                </div>
                <p className="mb-8">But sometimes the brand doesn't evolve at the same pace.</p>
                <p className={`text-[#F1E9E9] font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                  See where yours stands.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowIntro(false)}
                  className={`inline-block bg-[#F1E9E9] text-[#12080A] uppercase tracking-[0.4em] font-semibold transition-all duration-500 shadow-2xl ${
                    isMobile 
                      ? 'px-8 py-3 text-[0.65rem]' 
                      : 'px-16 py-5 text-sm hover:bg-[#F1E9E9]/90 hover:scale-105'
                  }`}
                >
                  Start Your Brand Quiz
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual Panel */}
        <div className="w-1/2 relative bg-[#12080A]">
          <div className="sticky top-0 h-screen">
            <div className="absolute inset-0">
              <img 
                src={quizIntroImage}
                alt="AVERRA Brand Visual"
                className="w-full h-full object-cover"
                style={{ objectPosition: '40% 30%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#12080A]/10 to-[#12080A]/30"></div>
            </div>
            
            {!isMobile && (
              <div className="absolute bottom-12 left-12 z-10">
                <p className="text-white/40 text-sm uppercase tracking-[0.4em] font-light">
                  AVERRA AI Model Studio
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation overlay for desktop split-screen */}
        <div className="hidden lg:block fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4e4e6] text-[#301710]">
      <Navigation />
      <div className="max-w-2xl mx-auto px-8 py-16 lg:py-32 min-h-screen flex flex-col justify-center">
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#301710]/60">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-1 ${
                    index <= currentQuestion ? 'bg-[#b76e79]' : 'bg-[#b76e79]/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] text-[#301710] mb-8" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            {questions[currentQuestion].question}
          </h1>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-[#301710] text-left font-light transition-all duration-500 ${
                  isMobile 
                    ? 'px-6 py-5 bg-white/70 border border-[#b76e79]/30 text-base rounded-sm active:border-[#b76e79] active:bg-[#b76e79]/10 active:shadow-lg active:scale-[1.01]'
                    : 'px-6 py-5 bg-white/70 border border-[#b76e79]/30 text-lg rounded-sm hover:border-[#b76e79] hover:bg-[#b76e79]/10 hover:pl-8 hover:shadow-lg hover:scale-[1.01]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <div className="mt-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#b76e79]/50 text-[#301710] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#b76e79]/10 hover:border-[#b76e79] transition-all duration-500"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}