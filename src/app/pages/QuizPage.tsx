import { useState, useEffect } from "react";
import { Navigation } from "@/app/components/Navigation";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { trackAction } from "@/utils/analytics";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// 9 Diagnostic Result Types
type DiagnosticResult =
  | "availability_trap"
  | "emotional_labor_debt"
  | "fully_booked_illusion"
  | "urgency_conditioning"
  | "burnout_architecture"
  | "service_ceiling"
  | "identity_based_burnout"
  | "nervous_system_business_models"
  | "building_beyond_the_chair";

interface QuizAnswer {
  text: string;
  patterns: DiagnosticResult[];
}

interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

const diagnosticQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What feels hardest to turn off after work?",
    answers: [
      { text: "Thinking about money", patterns: ["fully_booked_illusion", "nervous_system_business_models"] },
      { text: "Feeling responsible for everyone", patterns: ["emotional_labor_debt", "availability_trap"] },
      { text: "The pressure to stay booked", patterns: ["fully_booked_illusion", "urgency_conditioning"] },
      { text: "The feeling that I should still be doing more", patterns: ["identity_based_burnout", "burnout_architecture"] }
    ]
  },
  {
    id: 2,
    question: "What happens emotionally when someone cancels?",
    answers: [
      { text: "I immediately think about the money", patterns: ["fully_booked_illusion", "nervous_system_business_models"] },
      { text: "I feel anxious even if I'm booked", patterns: ["urgency_conditioning", "burnout_architecture"] },
      { text: "I start trying to fill the spot immediately", patterns: ["availability_trap", "urgency_conditioning"] },
      { text: "It affects my mood more than I want to admit", patterns: ["emotional_labor_debt", "identity_based_burnout"] }
    ]
  },
  {
    id: 3,
    question: "Which moment feels most familiar?",
    answers: [
      { text: "Checking my phone before I'm fully awake", patterns: ["urgency_conditioning", "nervous_system_business_models"] },
      { text: "Answering messages while trying to relax", patterns: ["emotional_labor_debt", "availability_trap"] },
      { text: "Feeling guilty during days off", patterns: ["identity_based_burnout", "burnout_architecture"] },
      { text: "Thinking about work during personal moments", patterns: ["nervous_system_business_models", "burnout_architecture"] }
    ]
  },
  {
    id: 4,
    question: "What makes rest feel uncomfortable?",
    answers: [
      { text: "Losing money", patterns: ["fully_booked_illusion", "service_ceiling"] },
      { text: "Falling behind", patterns: ["urgency_conditioning", "burnout_architecture"] },
      { text: "Feeling lazy", patterns: ["identity_based_burnout", "burnout_architecture"] },
      { text: "Feeling replaceable", patterns: ["emotional_labor_debt", "availability_trap"] }
    ]
  },
  {
    id: 5,
    question: "What quietly makes you feel safe in business?",
    answers: [
      { text: "Staying booked", patterns: ["fully_booked_illusion", "service_ceiling"] },
      { text: "Seeing appointments on my schedule", patterns: ["urgency_conditioning", "nervous_system_business_models"] },
      { text: "Clients needing me", patterns: ["emotional_labor_debt", "availability_trap"] },
      { text: "Immediate income coming in", patterns: ["service_ceiling", "fully_booked_illusion"] }
    ]
  },
  {
    id: 6,
    question: "What drains you most that people do not fully see?",
    answers: [
      { text: "Constant communication", patterns: ["emotional_labor_debt", "availability_trap"] },
      { text: "Carrying people emotionally all day", patterns: ["emotional_labor_debt", "burnout_architecture"] },
      { text: "Never mentally shutting off", patterns: ["nervous_system_business_models", "identity_based_burnout"] },
      { text: "Feeling emotionally responsible for everyone", patterns: ["emotional_labor_debt", "availability_trap"] }
    ]
  },
  {
    id: 7,
    question: "Which statement feels most true?",
    answers: [
      { text: "My business depends too heavily on me", patterns: ["availability_trap", "building_beyond_the_chair"] },
      { text: "Rest feels stressful instead of relaxing", patterns: ["urgency_conditioning", "nervous_system_business_models"] },
      { text: "I work constantly but still feel pressure", patterns: ["fully_booked_illusion", "burnout_architecture"] },
      { text: "My schedule controls my life more than I do", patterns: ["identity_based_burnout", "service_ceiling"] }
    ]
  },
  {
    id: 8,
    question: "What scares you most about slowing down?",
    answers: [
      { text: "Losing momentum", patterns: ["urgency_conditioning", "burnout_architecture"] },
      { text: "Losing money", patterns: ["fully_booked_illusion", "service_ceiling"] },
      { text: "Becoming irrelevant", patterns: ["emotional_labor_debt", "identity_based_burnout"] },
      { text: "Realizing how exhausted I actually am", patterns: ["burnout_architecture", "nervous_system_business_models"] }
    ]
  },
  {
    id: 9,
    question: "What happens internally during a slow week?",
    answers: [
      { text: "I panic", patterns: ["urgency_conditioning", "nervous_system_business_models"] },
      { text: "I question myself", patterns: ["identity_based_burnout", "emotional_labor_debt"] },
      { text: "I lower my standards too quickly", patterns: ["service_ceiling", "service_ceiling"] },
      { text: "I immediately try fixing it", patterns: ["availability_trap", "burnout_architecture"] }
    ]
  },
  {
    id: 10,
    question: "What role have you quietly become inside your business?",
    answers: [
      { text: "The provider everyone depends on", patterns: ["availability_trap", "building_beyond_the_chair"] },
      { text: "The person fixing everything", patterns: ["burnout_architecture", "identity_based_burnout"] },
      { text: "The person who never rests", patterns: ["urgency_conditioning", "nervous_system_business_models"] },
      { text: "The emotional support system for everyone else", patterns: ["emotional_labor_debt", "identity_based_burnout"] }
    ]
  },
  {
    id: 11,
    question: "What currently defines \"success\" for you emotionally?",
    answers: [
      { text: "Staying fully booked", patterns: ["fully_booked_illusion", "service_ceiling"] },
      { text: "Being constantly needed", patterns: ["emotional_labor_debt", "availability_trap"] },
      { text: "Never having empty spaces", patterns: ["urgency_conditioning", "burnout_architecture"] },
      { text: "Feeling productive all the time", patterns: ["identity_based_burnout", "nervous_system_business_models"] }
    ]
  },
  {
    id: 12,
    question: "What feels hardest to imagine?",
    answers: [
      { text: "Making money while resting", patterns: ["service_ceiling", "building_beyond_the_chair"] },
      { text: "Taking real time off", patterns: ["availability_trap", "nervous_system_business_models"] },
      { text: "A business that runs without constant pressure", patterns: ["burnout_architecture", "urgency_conditioning"] },
      { text: "Not tying my worth to productivity", patterns: ["identity_based_burnout", "emotional_labor_debt"] }
    ]
  },
  {
    id: 13,
    question: "What do you feel your business is actually missing?",
    answers: [
      { text: "Structure", patterns: ["building_beyond_the_chair", "availability_trap"] },
      { text: "Stability", patterns: ["nervous_system_business_models", "fully_booked_illusion"] },
      { text: "Systems", patterns: ["service_ceiling", "burnout_architecture"] },
      { text: "A way to grow without sacrificing more of myself", patterns: ["identity_based_burnout", "building_beyond_the_chair"] }
    ]
  },
  {
    id: 14,
    question: "If nothing changes over the next few years, what honestly worries you most?",
    answers: [
      { text: "Burning out completely", patterns: ["burnout_architecture", "identity_based_burnout"] },
      { text: "Resenting the business I built", patterns: ["emotional_labor_debt", "nervous_system_business_models"] },
      { text: "Staying trapped in nonstop appointments", patterns: ["service_ceiling", "building_beyond_the_chair"] },
      { text: "Realizing I built a business that only works if I never stop", patterns: ["availability_trap", "fully_booked_illusion"] }
    ]
  },
  {
    id: 15,
    question: "What do you actually want your business to feel like?",
    answers: [
      { text: "Calmer", patterns: ["nervous_system_business_models", "urgency_conditioning"] },
      { text: "More stable", patterns: ["fully_booked_illusion", "service_ceiling"] },
      { text: "Less emotionally heavy", patterns: ["emotional_labor_debt", "burnout_architecture"] },
      { text: "Able to grow without consuming my life", patterns: ["building_beyond_the_chair", "availability_trap"] }
    ]
  }
];

const resultContent: Record<DiagnosticResult, {
  title: string;
  subtitle: string;
  whatsHappening: string;
  whyItHappens: string;
  longTerm: string;
  whatFixes: string;
  whyGoldStandard: string;
}> = {
  availability_trap: {
    title: "THE AVAILABILITY TRAP",
    subtitle: "Your Business Still Depends Entirely On You",
    whatsHappening: "Right now, your business depends heavily on your availability, responsiveness, time, energy, and emotional presence. Every booking, cancellation, reschedule, client concern, and income fluctuation still runs directly through you. That is why the business never fully leaves your mind, even when the workday technically ends. Your nervous system knows that if you stop moving, the business slows down too.",
    whyItHappens: "Most beauty professionals were taught how to become great providers, not how to build businesses that could eventually operate with more structure and less emotional pressure. So every time things feel uncertain, the automatic response becomes: work more, answer faster, stay available longer, overextend yourself again. Over time, staying busy stopped feeling optional and started feeling emotionally necessary just to feel financially safe.",
    longTerm: "At first, the pressure feels manageable because growth feels exciting. Then eventually the business becomes emotionally heavy to maintain because your body is carrying the weight of keeping everything functioning constantly. Days off stop feeling restful. Slow weeks start affecting your mood immediately. The schedule may look successful from the outside while internally you feel like the business owns all of your mental space.",
    whatFixes: "The solution is not becoming more disciplined or working harder. The structure itself has to change. The business needs systems, positioning, leverage, and income opportunities that reduce emotional dependence on your nonstop availability. The goal is building something that can eventually support your life instead of requiring your constant physical presence just to survive.",
    whyGoldStandard: "The Gold Standard breaks down exactly why beauty businesses become emotionally tied to constant availability and how to begin building beyond that model without throwing away everything you already built."
  },
  emotional_labor_debt: {
    title: "EMOTIONAL LABOR DEBT",
    subtitle: "You're Carrying More Than The Service Itself",
    whatsHappening: "Your exhaustion is not only physical. A large part of it comes from constantly carrying emotional energy all day long. Listening to people. Managing emotions. Reassuring clients. Staying emotionally present. Absorbing stress while still needing to remain warm, calm, attentive, and professional yourself. Most beauty professionals normalize this so deeply they stop realizing how much emotional pressure they are carrying daily.",
    whyItHappens: "The beauty industry quietly rewards emotional availability. Clients come back because of how you make them feel, not only because of the technical service itself. Over time, emotional support becomes part of the business model whether you intended it to or not. That means your nervous system never fully gets to relax because emotionally, you are still \"on\" for people constantly.",
    longTerm: "Eventually the emotional exhaustion starts becoming heavier than the actual appointments. Providers begin feeling mentally overstimulated, emotionally drained, disconnected from themselves, or resentful without fully understanding why. A lot of people assume they are simply \"burned out,\" when really they have been emotionally overloaded for years without enough structure protecting them underneath it.",
    whatFixes: "You do not need to stop caring about people. You need stronger boundaries, systems, emotional separation, and a business structure that does not depend entirely on your emotional energy to maintain loyalty and income. The goal is building a business where connection still exists without emotional depletion becoming the cost of keeping it alive.",
    whyGoldStandard: "The Gold Standard explains why emotional labor affects beauty professionals so deeply and how structure, positioning, and boundaries directly impact long term emotional sustainability."
  },
  fully_booked_illusion: {
    title: "THE FULLY BOOKED ILLUSION",
    subtitle: "You're Busy Constantly But Still Don't Feel Stable",
    whatsHappening: "Your schedule may look successful, but emotionally and financially the business still feels fragile underneath it. You stay booked, work constantly, and keep pushing yourself, yet slow weeks still create stress and time off still feels expensive. That usually means the business is scaling labor instead of building real stability.",
    whyItHappens: "The industry teaches providers to chase bookings instead of building scalable business structure. So eventually many people become fully booked while still depending completely on nonstop appointments to maintain income. More growth creates more work. More work creates more pressure. And the nervous system never fully relaxes because the business still depends on constant physical output.",
    longTerm: "A lot of providers quietly realize they built a business that only works if they never stop moving. The schedule fills up, but freedom never fully arrives. Rest starts feeling financially dangerous. Burnout slowly increases even while the business technically appears successful online and to other people.",
    whatFixes: "The solution is not adding more appointments. The business needs structure that creates leverage instead of only creating more labor. Stronger positioning, scalable income opportunities, better systems, and less emotional dependency on being booked every hour of the week.",
    whyGoldStandard: "The Gold Standard explains why fully booked does not automatically mean financially free and how to begin building a business that eventually grows beyond nonstop appointments alone."
  },
  urgency_conditioning: {
    title: "URGENCY CONDITIONING",
    subtitle: "Your Nervous System Got Used To Constant Pressure",
    whatsHappening: "Your body has been operating under pressure for so long that urgency started feeling normal. Notifications, appointments, cancellations, reschedules, messages, income fluctuations, and constant decision making became part of everyday life. Now quiet moments almost feel uncomfortable because your nervous system adapted to functioning inside constant stimulation.",
    whyItHappens: "Every time pressure appeared, the business taught you to respond faster, work harder, and stay emotionally alert. Over time, urgency became tied to productivity and productivity became tied to emotional safety. That is why slowing down now feels emotionally unfamiliar even when your body clearly needs rest.",
    longTerm: "Many providers eventually lose the ability to feel calm without pressure attached to it. Rest becomes difficult. Slow periods create anxiety. The nervous system stays alert even after work is finished. Eventually the body starts carrying chronic emotional exhaustion because it never fully leaves survival mode.",
    whatFixes: "This is not fixed through motivation or \"better time management.\" The structure itself has to create more stability. The business needs systems, boundaries, predictable structure, and income models that reduce constant emotional reactivity and pressure.",
    whyGoldStandard: "The Gold Standard explains how beauty businesses unintentionally train providers into survival mode and how to begin building a calmer, more sustainable structure instead."
  },
  burnout_architecture: {
    title: "BURNOUT ARCHITECTURE",
    subtitle: "Your Business Was Built In A Way That Drains You",
    whatsHappening: "The exhaustion is not happening because you are weak, lazy, or unmotivated. The structure itself is creating pressure faster than your body can recover from it. The business currently depends on your constant output, emotional regulation, communication, availability, and labor all at the same time.",
    whyItHappens: "Most beauty businesses are unintentionally built around survival instead of sustainability. Providers keep adding more clients, more hours, more responsibilities, and more emotional labor without enough systems underneath them to reduce pressure. Eventually the business itself starts producing burnout structurally.",
    longTerm: "At first, overworking feels productive. Then eventually the business becomes emotionally expensive to maintain. Providers begin losing energy, clarity, patience, creativity, and emotional capacity while still forcing themselves to keep functioning because the structure leaves very little room to slow down safely.",
    whatFixes: "The answer is not simply resting more. The business itself has to become less emotionally consuming. Better systems, stronger boundaries, scalable structure, positioning, and leverage all reduce the amount of pressure your body is carrying every day.",
    whyGoldStandard: "The Gold Standard explains why burnout becomes built directly into beauty business models and how to start restructuring the business into something more stable and sustainable long term."
  },
  service_ceiling: {
    title: "THE SERVICE CEILING",
    subtitle: "Your Income Still Depends On Your Physical Output",
    whatsHappening: "You may already be talented, experienced, and in demand, but the business still depends heavily on how much your body can physically produce. More income still requires more appointments, more hours, more emotional energy, and more availability. That creates a ceiling where eventually growth starts feeling heavier instead of freer.",
    whyItHappens: "Most providers were taught how to perfect the service, not how to build beyond it. So the business continues scaling labor instead of scaling structure. Every increase in demand still requires more of your time, which means eventually the body itself becomes the limitation controlling business growth.",
    longTerm: "Many beauty professionals eventually realize they created a successful business that still cannot function without nonstop physical involvement. The schedule becomes emotionally overwhelming because growth no longer creates more freedom. It only creates more responsibility and more pressure to maintain momentum constantly.",
    whatFixes: "The business needs systems that eventually allow income, authority, and growth to expand beyond appointments alone. Strong positioning, scalable offers, operational structure, and leverage reduce dependency on physical output over time.",
    whyGoldStandard: "The Gold Standard explains why the service based business model eventually becomes emotionally and financially limiting and how to begin building a business capable of growing beyond nonstop labor."
  },
  identity_based_burnout: {
    title: "IDENTITY BASED BURNOUT",
    subtitle: "Exhaustion Slowly Became Part Of Who You Are",
    whatsHappening: "At some point, overworking stopped feeling temporary and started becoming your identity. You became known as the dependable one, the hardworking one, the booked one, the provider who always pushes through no matter how tired they are. Because people admired that version of you, it became harder to separate your worth from exhaustion itself.",
    whyItHappens: "The industry constantly rewards self sacrifice. More hours create more income. More availability creates more loyalty. More emotional labor creates stronger client attachment. Eventually burnout becomes normalized because overworking feels emotionally tied to ambition, responsibility, and success.",
    longTerm: "Many providers slowly lose the ability to recognize how exhausted they actually are because functioning overwhelmed became normal. The body keeps going while emotional capacity quietly shrinks underneath it. Eventually resentment, numbness, emotional exhaustion, and disconnection from the work itself start replacing passion.",
    whatFixes: "The goal is not becoming less ambitious. The goal is building a business that no longer requires self abandonment to survive. Structure, systems, boundaries, leverage, and calmer operational models reduce the emotional cost of growth long term.",
    whyGoldStandard: "The Gold Standard explains why burnout becomes emotionally attached to identity in beauty businesses and how to begin separating success from nonstop self sacrifice."
  },
  nervous_system_business_models: {
    title: "NERVOUS SYSTEM BUSINESS MODELS",
    subtitle: "Your Business Is Affecting Your Body More Than You Realize",
    whatsHappening: "Your business is not only affecting your schedule. It is affecting your nervous system constantly. The uncertainty, pressure, emotional labor, constant responsiveness, and financial inconsistency keep your body emotionally alert far more often than it should be. Over time, your nervous system adapts to operating inside chronic stress.",
    whyItHappens: "Most beauty businesses unintentionally create emotional unpredictability. Income changes constantly. Demand changes constantly. Client emotions change constantly. The business teaches providers to remain emotionally available and hyper responsive at all times just to maintain stability.",
    longTerm: "Eventually the body struggles to fully relax even during breaks. Many providers begin experiencing emotional exhaustion, overstimulation, anxiety, irritability, sleep issues, or chronic mental fatigue because the nervous system never fully exits work mode emotionally.",
    whatFixes: "The business itself needs more emotional stability built into it. Systems, structure, stronger positioning, boundaries, operational clarity, and more scalable income models reduce how much survival pressure the nervous system carries every day.",
    whyGoldStandard: "The Gold Standard explains how labor dependent beauty businesses directly affect emotional regulation and what it actually takes to build a calmer, more sustainable business structure long term."
  },
  building_beyond_the_chair: {
    title: "BUILDING BEYOND THE CHAIR",
    subtitle: "You're Ready For The Business To Grow Beyond Constant Labor",
    whatsHappening: "You are starting to realize the goal was never simply staying booked forever. You want more stability, more structure, more freedom, and a business that eventually supports your life instead of consuming all of it. You are no longer only thinking like a provider. You are starting to think like someone who wants to build something that lasts.",
    whyItHappens: "Eventually many beauty professionals reach a point where they understand that nonstop appointments alone cannot create the life they actually want long term. The body gets tired. Emotional capacity gets stretched thin. And the business starts revealing the limits of labor based growth models.",
    longTerm: "Without change, many providers remain trapped in cycles where success still requires nonstop physical output forever. But once this realization happens, people usually start craving something deeper than more bookings. They start craving sustainability, leverage, authority, freedom, and peace.",
    whatFixes: "This is where structure changes everything. Systems. Positioning. Scalable business models. Authority based growth. Income opportunities that do not disappear every time you step away. The goal becomes building a business that eventually expands beyond your constant physical availability.",
    whyGoldStandard: "The Gold Standard was built specifically for beauty professionals who know they are capable of more than surviving inside nonstop appointments forever. It explains how to begin transitioning from labor based survival into long term business structure and scalable growth."
  }
};

export function QuizPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { addItem } = useCart();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticResult[]>([]);
  const [answerTexts, setAnswerTexts] = useState<string[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [showResult, setShowResult] = useState(false);
  const [primaryResult, setPrimaryResult] = useState<DiagnosticResult | null>(null);
  const [secondaryResult, setSecondaryResult] = useState<DiagnosticResult | null>(null);

  const handleAnswer = async (answerIndex: number) => {
    const selectedAnswer = diagnosticQuestions[currentQuestion].answers[answerIndex];
    const newAnswers = [...answers, ...selectedAnswer.patterns];
    const newAnswerTexts = [...answerTexts, selectedAnswer.text];
    setAnswers(newAnswers);
    setAnswerTexts(newAnswerTexts);

    if (currentQuestion < diagnosticQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const patternCounts: Record<DiagnosticResult, number> = {
        availability_trap: 0,
        emotional_labor_debt: 0,
        fully_booked_illusion: 0,
        urgency_conditioning: 0,
        burnout_architecture: 0,
        service_ceiling: 0,
        identity_based_burnout: 0,
        nervous_system_business_models: 0,
        building_beyond_the_chair: 0
      };

      newAnswers.forEach(pattern => {
        patternCounts[pattern]++;
      });

      const sortedPatterns = (Object.keys(patternCounts) as DiagnosticResult[])
        .sort((a, b) => patternCounts[b] - patternCounts[a]);

      const primary = sortedPatterns[0];
      const secondary = sortedPatterns[1];

      setPrimaryResult(primary);
      setSecondaryResult(secondary);
      setShowResult(true);

      // Store diagnostic result via server
      try {
        const answerData: Record<string, string> = {};
        diagnosticQuestions.forEach((q, index) => {
          if (index < newAnswerTexts.length) {
            answerData[`question_${q.id}_answer`] = newAnswerTexts[index];
          }
        });

        const deviceType = isMobile ? "mobile" : "desktop";

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/save-diagnostic-result`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              session_id: sessionId,
              primary_result: primary,
              secondary_result: secondary,
              ...answerData,
              device_type: deviceType,
              traffic_source: document.referrer || "direct"
            })
          }
        );

        if (!response.ok) {
          // Silently log - don't break user experience
          console.warn("Diagnostic save warning");
        }

        trackAction("diagnostic_completed", {
          primary_result: primary,
          secondary_result: secondary
        });
      } catch (error) {
        // Silently fail - server not required for quiz to function
      }
    }
  };

  const handleGetEbook = async () => {
    addItem({
      id: "gold-standard-ebook",
      name: "The Gold Standard eBook",
      price: 97,
      originalPrice: 147,
      quantity: 1,
      type: "digital"
    });

    trackAction("diagnostic_ebook_cta_clicked", {
      primary_result: primaryResult,
      secondary_result: secondaryResult
    });

    // Update CTA click via server
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/diagnostic-result/${sessionId}/cta-click`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`
          }
        }
      );
    } catch (error) {
      // Silently fail - server not required for checkout to function
    }

    navigate("/checkout");
  };

  const progress = ((currentQuestion + 1) / diagnosticQuestions.length) * 100;

  if (showResult && primaryResult && secondaryResult) {
    const primary = resultContent[primaryResult];
    const secondary = resultContent[secondaryResult];

    return (
      <div className="min-h-screen bg-[#fdf5f7]">
        <Navigation />

        <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
          {/* Primary Result */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e] mb-6" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                Your Primary Diagnosis
              </p>
              <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] text-[#251218] mb-4" style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
                {primary.title}
              </h1>
              <p className="text-2xl text-[#c9969e] italic" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                {primary.subtitle}
              </p>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="text-xl uppercase tracking-[0.3em] text-[#c9969e] mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  What's Actually Happening
                </h3>
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  {primary.whatsHappening}
                </p>
              </section>

              <section>
                <h3 className="text-xl uppercase tracking-[0.3em] text-[#c9969e] mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Why This Keeps Happening
                </h3>
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  {primary.whyItHappens}
                </p>
              </section>

              <section>
                <h3 className="text-xl uppercase tracking-[0.3em] text-[#c9969e] mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  What This Usually Turns Into Long Term
                </h3>
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  {primary.longTerm}
                </p>
              </section>

              <section>
                <h3 className="text-xl uppercase tracking-[0.3em] text-[#c9969e] mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  What Actually Fixes It
                </h3>
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  {primary.whatFixes}
                </p>
              </section>

              <section>
                <h3 className="text-xl uppercase tracking-[0.3em] text-[#c9969e] mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Why The Gold Standard Was Built For You
                </h3>
                <p className="text-lg text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  {primary.whyGoldStandard}
                </p>
              </section>
            </div>
          </div>

          {/* Secondary Result */}
          <div className="mb-20 pt-20 border-t-2 border-[#c9969e]/30">
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e]/70 mb-4" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                Supporting Pattern
              </p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-[#251218] mb-3" style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
                {secondary.title}
              </h2>
              <p className="text-xl text-[#c9969e]/80 italic" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                {secondary.subtitle}
              </p>
            </div>

            <div className="space-y-8 opacity-90">
              <p className="text-base text-[#251218]/70 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                {secondary.whatsHappening}
              </p>
              <p className="text-base text-[#251218]/70 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                {secondary.whatFixes}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-20">
            <h3 className="text-3xl text-[#251218] mb-6" style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
              Ready to build beyond this?
            </h3>
            <p className="text-lg text-[#251218]/70 mb-10 max-w-2xl mx-auto" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
              The Gold Standard breaks down exactly why these patterns exist and how to begin building a business that doesn't require constant self-sacrifice to survive.
            </p>
            <button
              onClick={handleGetEbook}
              className={`inline-flex items-center gap-3 px-12 py-5 bg-[#251218] text-[#fdf5f7] uppercase tracking-[0.3em] ${!isMobile ? 'hover:bg-[#c9969e] hover:text-[#251218]' : ''} transition-all duration-300 shadow-xl`}
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.875rem" }}
            >
              Download The Gold Standard
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-[#c9969e] mt-4" style={{ fontFamily: "Lora, serif" }}>
              $97 Founder Pricing — Instant Access
            </p>
          </div>
        </div>
      </div>
    );
  }

  const question = diagnosticQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#fdf5f7]">
      <Navigation />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#251218]/10 z-50">
        <div
          className="h-full bg-[#c9969e] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-12 text-center">
          <p className="text-sm text-[#c9969e] mb-2" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
            Question {currentQuestion + 1} of {diagnosticQuestions.length}
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.3] text-[#251218] text-center mb-12" style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left px-8 py-6 bg-white/60 border-2 border-[#c9969e]/20 ${!isMobile ? 'hover:border-[#c9969e] hover:bg-[#c9969e]/5' : ''} transition-all duration-300 rounded-xl`}
              >
                <p className="text-lg text-[#251218]" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                  {answer.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {currentQuestion > 0 && (
          <div className="text-center">
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="inline-flex items-center gap-2 text-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", fontWeight: 600 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
