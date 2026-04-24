import { Navigation } from "@/app/components/Navigation";
import { Link, useNavigate } from "react-router";
import { Check } from "lucide-react";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { CTAFooter } from "@/app/components/CTAFooter";
import { MarqueeScroll } from "@/app/components/MarqueeScroll";
import { trackAction } from "@/utils/analytics";
import { getImageUrl } from "@/utils/imageHelpers";

// Single AVERRA Brand Alignment System Service
const brandAlignmentService = {
  id: "brand-alignment",
  name: "AVERRA Brand Alignment System",
  subtitle: "Industry Standard Alignment",
  price: "$250",
  salePrice: "$100",
  priceNum: 100,
  originalPriceNum: 250,
  description: "A complete brand alignment system built to ensure everything you put out reflects the level you're intentionally operating at so the right clients find you.",
  industryStandard: {
    title: "The Industry Standard",
    intro: "When there's no defined identity behind what you're putting out, content becomes scattered, clients become inconsistent, and loyalty drops no matter how good the work is.",
    standards: [
      { name: "Perception", description: "How your brand is seen at first glance" },
      { name: "Translation", description: "How clearly your message is communicated" },
      { name: "Visual Clarity", description: "How aligned your visuals appear" },
      { name: "Consistency", description: "How reliable your brand identity remains" },
    ],
    conclusionPart1: "If any of these are off, your perceived value decreases.",
    conclusionPart2: "Our system corrects that."
  },
  stages: [
    {
      name: "Interpretation",
      subtitle: "Determining Brand Direction",
      detail: "We establish your brand identity and intention so everything you create leaves no room for misinterpretation.",
    },
    {
      name: "Alignment",
      subtitle: "Unifies The Brand's Presentation",
      detail: "We evaluate every visual element so everything communicates equally. This eliminates mixed signals and strengthens how your brand is perceived.",
    },
    {
      name: "Stabilization",
      subtitle: "Maintaining Consistency",
      detail: "A structured visual system is built custom your brand so your content stays consistent, controlled, and aligned as you grow.",
    },
  ],
  deliverables: [
    "Defined brand direction",
    "Aligned visual framework",
    "Corrected perception and positioning",
    "Structured content system with clear standards for future content",
  ],
};

// Add-on Audit Services
const auditAddOns = [
  {
    id: "brand-perception-audit",
    name: "Brand Perception Audit",
    price: "$100",
    salePrice: "$75",
    priceNum: 75,
    originalPriceNum: 100,
    subtitle: "A focused evaluation of how your brand is currently being seen",
    whatThisCovers: "Visual consistency, message clarity, perceived value, and overall brand presence.",
    whatIsIdentified: "What your visuals are actually communicating and where they're lowering the level of your brand.",
    outcome: "Exact direction on what to address so nothing about your brand undersells or contradicts what you're actually capable of.",
  },
  {
    id: "brand-expansion-audit",
    name: "Brand Expansion Audit",
    price: "$100",
    salePrice: "$75",
    priceNum: 75,
    originalPriceNum: 100,
    subtitle: "A focused consultation on how to scale your brand without your identity or perception shifting in the process.",
    whatThisCovers: "Where your brand starts to drift as content increases and what's needed to keep it controlled.",
    whatIsIdentified: "Where your brand loses control as content and output increase.",
    outcome: "A brand that holds its standard, its identity, and its level regardless of how far it grows",
  },
];

const digitalProducts = [
  {
    id: "lash-extension-look",
    name: "The Lash Collection",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three individual lash-focused visuals featuring clean isolation, full lash lines, soft volume, and a polished finish, this pack highlights the detail and precision behind expert lash work. Ideal for set promos, fill reminders, new announcements, retention or education posts. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      {
        title: "Scene 1: The Service Moment",
        detail:
          "A relaxed in-service lash appointment capturing focused application, clean placement, and steady hands at work. A professional behind the bed moment that shows care and control.",
      },
      {
        title: "Scene 2: The Finished Set",
        detail:
          "A close beauty shot highlighting fullness, symmetry, and a flawless lash line. Soft, defined, and made to stand out on the feed.",
      },
      {
        title: "Scene 3: The Detail Finish",
        detail:
          "A refined close up showcasing clean isolation, consistent mapping, and smooth density. Designed to spotlight the quality of the set and the professionalism that comes with it.",
      },
    ],
    includes: [
      "3 high-resolution AI-generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
  {
    id: "brow-services-look",
    name: "The Map Pack",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three brow visuals perfected for precision. Including clean mapping, crisp shaping, defined arches, and structured finishes, this pack highlights the level of control and detail behind expert brow work. Ideal for brow promos, tint and shape specials, new service launches, or collaborations. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      {
        title: "Scene 1: The Precision Moment",
        detail:
          "A focused in-service shot capturing mapping, shaping, and hands on detail. Clean lines and steady technique that show real expertise.",
      },
      {
        title: "Scene 2: The Sculpted Result",
        detail:
          "A polished brow finish with defined structure, balanced symmetry, and a sharp, refined outline. The kind of result that instantly looks high level.",
      },
      {
        title: "Scene 3: The Detail Close Up",
        detail:
          "A refined beauty shot highlighting clean edges, smooth tint, and precise definition. Designed to spotlight the quality of the work without overstatement.",
      },
    ],
    includes: [
      "3 high-resolution AI-generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
  {
    id: "makeup-artistry-look",
    name: "The Base Bundle",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three elevated visuals designed to make artistry feel visible, polished, and undeniable. Featuring seamless blend, flawless base, clean liner work, soft highlight, and camera-ready finish, this pack captures the level of detail clients expect from a serious MUA. Ideal for brand announcements, glam promos, launches, sales, or showcasing signature looks. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      {
        title: "Scene 1: The Application Moment",
        detail:
          "A mid service beauty shot capturing blending, brushwork, and focused technique in progress. A clean, professional image that shows real artistry at work.",
      },
      {
        title: "Scene 2: The Finished Glam Close Up",
        detail:
          "A striking final look with smooth skin, defined features, and balanced highlight. Polished, confident, and ready for the camera.",
      },
      {
        title: "Scene 3: The Beauty Detail",
        detail:
          "A refined close up highlighting texture, blend, and precision. Designed to spotlight the quality of the work without overstatement.",
      },
    ],
    includes: [
      "3 high-resolution AI-generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
  {
    id: "hair-styling-look",
    name: "Fresh Out The Chair",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three hair-focused visuals created to showcase precision, shine, and that polished finish clients book for. Ideal for launches, specials, promos, seasonal hair campaigns, or transformations. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      {
        title: "Scene 1: The Work Behind the Result",
        detail:
          "A hands on, behind the chair moment capturing clean sectioning, controlled tension, and focused technique in action. The foundation of every seamless blend, sharp cut, and high gloss finish clients book for.",
      },
      {
        title: "Scene 2: The Finished Transformation",
        detail:
          "A polished final look with visible shine, smooth movement, and a flawless finish. The kind of hair that photographs beautifully, feels healthy, and makes clients run to the mirror.",
      },
      {
        title: "Scene 3: The Detail Finish",
        detail:
          "A close up highlighting technique, clarity, and precision. Designed to spotlight the quality of the work without needing a before and after.",
      },
    ],
    includes: [
      "3 high-resolution AI-generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
  {
    id: "nail-services-look",
    name: "The Cuticle Collection",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three manicure visuals designed to highlight structure, precision, and that flawless finished set clients zoom in on. Featuring clean cuticle work, sharp shaping, smooth structure, and high-gloss shine, this pack makes detail visible at first glance. Ideal for new set promos, seasonal design launches, retention education posts, price increases, or showcasing signature shapes and finishes. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      {
        title: "Scene 1: The Precision Process",
        detail:
          "A close manicure moment capturing clean cuticle work, shaping, and hands on detail. The kind of angle that shows skill, not just polish.",
      },
      {
        title: "Scene 2: The Elevated Finish",
        detail:
          "A perfectly structured set shown up close with sharp shape, smooth application, and high gloss shine. Bold enough to stop scrolling and strong enough to support pricing.",
      },
      {
        title: "Scene 3: The Detail Standard",
        detail:
          "A set shot highlighting symmetry, structure, and consistency. Designed to visually emphasize the level of care behind every appointment.",
      },
    ],
    includes: [
      "3 high-resolution AI-generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
  {
    id: "esthetics-skincare-look",
    name: "You Glow Girl Bundle",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three esthetic visuals designed to make promotions look polished and professional from the first glance. Ideal for facial specials, new treatment launches, membership promotions, or skincare product features. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      {
        title: "Scene 1: The Treatment Moment",
        detail:
          "A calm facial appointment scene that captures the treatment table setup, clean linens, and hands on care clients expect. Soft lighting and a relaxed client position create the kind of environment that feels professional and safe.",
      },
      {
        title: "Scene 2: The Healthy Glow",
        detail:
          "A close up of fresh, glowing skin with natural texture and hydration visible. Perfect for promoting results focused services like custom facials, acne treatments, brightening services, or skin barrier repair.",
      },
      {
        title: "Scene 3: The Skin Detail",
        detail:
          "A polished detail shot highlighting smooth texture, even tone, and post treatment radiance. Ideal for showcasing expertise, precision, and high standard skincare work.",
      },
    ],
    includes: [
      "3 AI-generated brand scenes",
      "Commercial use license for marketing and promotional materials",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
];

export function ServicesPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = (item: {
    id: string;
    name: string;
    priceNum: number;
    originalPriceNum?: number;
    subtitle?: string;
    type: "service" | "digital";
    description?: string;
  }) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.priceNum,
      originalPrice: item.originalPriceNum,
      type: item.type,
      description: item.subtitle || item.description,
    });
    trackAction("Add to Cart", { item: item.name, type: item.type });
  };

  return (
    <>
      <div className="min-h-screen bg-[#fdf5f7] text-[#251218]">
        <div className="bg-[#fdf5f7]">
          <Navigation />
        </div>

        {/* Hero Section - Elegant Split Design */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#fdf5f7] pt-20">
          <div className="absolute inset-0 opacity-5 hidden md:block">
            <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-[#c9969e] rounded-full blur-[120px]"></div>
            <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#251218] rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Left - Elegant Text */}
              <div className="relative z-10">
                <div className="inline-block mb-8 px-8 py-3 bg-[#c9969e]/10 border-l-2 border-[#c9969e]">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e]">
                    The AVERRA Process
                  </p>
                </div>

                <h1
                  className="text-[clamp(3.5rem,8vw,6rem)] leading-[0.95] text-[#251218] mb-8"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                >
                  Clarity Through<br/>
                  <span className="italic font-light">Alignment</span>
                </h1>

                <div className="w-20 h-px bg-[#c9969e] mb-10"></div>

                <p className="text-xl text-[#251218]/80 leading-relaxed mb-12" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
Your work speaks for itself. Your brand should too. When it doesn't, clients hesitate, pricing stalls, and your content gets lost in a market full of people doing the same thing. AVERRA aligns your brand so everything you put out reflects the level you're actually at.
                </p>

                <div className="flex items-center gap-6 mb-8">
                  <span
                    className="text-3xl text-[#251218]/30 line-through"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 300 }}
                  >
                    $250
                  </span>
                  <span
                    className="text-6xl text-[#251218]"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    $100
                  </span>
                </div>

                <button
                  onClick={() => {
                    sessionStorage.setItem(
                      "selectedServiceTier",
                      JSON.stringify({
                        id: brandAlignmentService.id,
                        name: brandAlignmentService.name,
                        priceNum: brandAlignmentService.priceNum,
                        originalPriceNum: brandAlignmentService.originalPriceNum,
                        subtitle: brandAlignmentService.subtitle,
                        type: "service",
                        description: brandAlignmentService.description,
                      })
                    );
                    navigate("/brand-intake");
                  }}
                  className={`group relative inline-block px-16 py-5 bg-[#251218] text-[#fdf5f7] text-xs uppercase tracking-[0.5em] overflow-hidden ${
                    !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218] hover:scale-105" : ""
                  } transition-all duration-700 cursor-pointer`}
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
                >
                  <span className="relative z-10">Get Started</span>
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full ${!isMobile ? "group-hover:translate-x-full" : ""} transition-transform duration-1000`}></div>
                </button>
              </div>

              {/* Right - Image with soft frame */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#c9969e]/20 to-transparent blur-2xl"></div>
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(74,26,58,0.15)]">
                  <img
                    src={getImageUrl("/services-hero.png")}
                    alt="AVERRA Services"
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay - stronger on mobile at bottom and sides */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#251218]/60 via-transparent to-transparent md:from-[#251218]/20"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-radial from-transparent via-[#251218]/40 to-[#251218]/60 md:hidden"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-[#c9969e] to-transparent"></div>
          </div>
        </section>

        {/* Promo Banner - Refined dark section */}
        <div className="relative overflow-hidden bg-[#251218] py-20 mt-20">
          {/* Smooth gradient at top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#fdf5f7] to-transparent pointer-events-none"></div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#c9969e]/2 via-transparent to-[#c9969e]/2"></div>

          {/* Smooth gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fdf5f7] to-transparent pointer-events-none"></div>

          {/* Moving Marquee */}
          <div className="mb-12 border-y border-[#c9969e]/20 py-4">
            <MarqueeScroll disableOnMobile={false} duration={30}>
              <div className="flex items-center gap-8 text-[#c9969e] text-sm uppercase tracking-[0.3em] font-light whitespace-nowrap" style={{ fontFamily: "Montserrat, sans-serif" }}>
                <span>LAUNCH PRICING   May 1st to May 31st</span>
                <span className="text-[#c9969e]/50">•</span>
                <span>FOUNDING MEMBERS ONLY</span>
                <span className="text-[#c9969e]/50">•</span>
                <span>UP TO 50% OFF</span>
                <span className="text-[#c9969e]/50">•</span>
                <span>LAUNCH PRICING   April 1st to August 31st</span>
                <span className="text-[#c9969e]/50">•</span>
                <span>FOUNDING MEMBERS ONLY</span>
                <span className="text-[#c9969e]/50">•</span>
                <span>UP TO 50% OFF</span>
                <span className="text-[#c9969e]/50">•</span>
              </div>
            </MarqueeScroll>
          </div>

          <div className="max-w-4xl mx-auto px-8 text-center">
            <h3
              className="text-[clamp(3rem,6vw,5rem)] text-[#fdf5f7] mb-6 leading-[0.95] italic"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              Founding Members
            </h3>

            <div className="inline-block px-12 py-3 bg-[#c9969e]/10 border border-[#c9969e]/30 mb-8 backdrop-blur-sm">
              <span className="text-xs uppercase tracking-[0.5em] text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                Limited Time Offer
              </span>
            </div>

            <p
              className="text-2xl text-[#fdf5f7]/80 font-light max-w-xl mx-auto"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Early access never looked this good
            </p>
          </div>
        </div>

        {/* Service Section - Soft Blush Background */}
        <div className="bg-[#fdf5f7] relative overflow-hidden">
          {/* Elegant decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9969e]/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#251218]/5 rounded-full blur-3xl"></div>

          <div className="relative py-32">
            <div className="max-w-6xl mx-auto px-8">

              {/* INTRO - Elegant layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40 max-w-7xl mx-auto items-center">
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute -left-8 -top-12 text-[10rem] text-[#c9969e]/8 leading-none select-none" style={{ fontFamily: "Playfair Display, serif" }}>
                    01
                  </div>
                  <h2
                    className="text-[clamp(2.5rem,6vw,5rem)] text-[#251218] mb-8 leading-[0.95] relative z-10"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                  >
                    AVERRA Brand<br/>
                    <span className="italic font-light">Alignment</span>
                  </h2>
                  <div className="w-20 h-px bg-[#c9969e]"></div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                <div className="inline-block px-8 py-3 bg-white/50 backdrop-blur-sm border-l-2 border-[#c9969e]">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                    {brandAlignmentService.subtitle}
                  </p>
                </div>

                <p
                  className="text-2xl text-[#251218]/90 leading-relaxed"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  {brandAlignmentService.description}
                </p>
              </div>
            </div>

            {/* THE STANDARD - Refined editorial layout */}
            <div className="mb-40 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-20">
                <div className="sticky top-32">
                  <h3
                    className="text-[clamp(2.5rem,6vw,4.5rem)] text-[#251218] mb-8 leading-[0.95]"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                  >
                    The Industry<br/>
                    <span className="italic font-light">Standard</span>
                  </h3>
                  <p
                    className="text-xl text-[#251218]/70 leading-relaxed"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    {brandAlignmentService.industryStandard.intro}
                  </p>
                </div>

                <div className="space-y-12">
                  {brandAlignmentService.industryStandard.standards.map((standard, index) => (
                    <div key={standard.name} className="group">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-[#251218] group-hover:bg-[#c9969e] transition-colors duration-500">
                          <span
                            className="text-xl text-[#fdf5f7] group-hover:text-[#251218] transition-colors duration-500"
                            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4
                            className="text-2xl text-[#251218] mb-3"
                            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                          >
                            {standard.name}
                          </h4>
                          <p className="text-lg text-[#251218]/70 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                            {standard.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center max-w-5xl mx-auto mt-24">
                <div className="relative inline-block px-20 py-12">
                  {/* Decorative corner lines */}
                  <div className="absolute top-0 left-0 w-32 h-px bg-[#c9969e]"></div>
                  <div className="absolute top-0 left-0 w-px h-32 bg-[#c9969e]"></div>
                  <div className="absolute top-0 right-0 w-32 h-px bg-[#c9969e]"></div>
                  <div className="absolute top-0 right-0 w-px h-32 bg-[#c9969e]"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-px bg-[#c9969e]"></div>
                  <div className="absolute bottom-0 left-0 w-px h-32 bg-[#c9969e]"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-px bg-[#c9969e]"></div>
                  <div className="absolute bottom-0 right-0 w-px h-32 bg-[#c9969e]"></div>

                  <div className="space-y-6">
                    <p
                      className="text-2xl text-[#251218] font-light leading-relaxed"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      {brandAlignmentService.industryStandard.conclusionPart1}
                    </p>
                    <p
                      className="text-3xl text-[#c9969e] font-semibold leading-relaxed"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 600 }}
                    >
                      {brandAlignmentService.industryStandard.conclusionPart2}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* THE SYSTEM - Elegant cards */}
            <div className="mb-40">
              <div className="text-center mb-24">
                <h3
                  className="text-[clamp(2.5rem,7vw,5.5rem)] text-[#251218] mb-6 leading-[0.95] italic"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                >
                  The System
                </h3>
                <div className="inline-block px-10 py-4 bg-white/50 backdrop-blur-sm border-y border-[#c9969e]/30">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                    Three Stage Process
                  </p>
                </div>
              </div>

              {/* Three Stages - Refined cards */}
              <div className="space-y-8 max-w-7xl mx-auto">
                {brandAlignmentService.stages.map((stage, index) => (
                  <div
                    key={stage.name}
                    className="group relative bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-700 hover:shadow-[0_20px_60px_rgba(201,150,158,0.15)]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-12 lg:p-16">
                      {/* Number */}
                      <div className="lg:col-span-2 flex items-start">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#c9969e]/15 blur-2xl group-hover:bg-[#c9969e]/25 transition-all duration-700"></div>
                          <div className="relative text-[7rem] lg:text-[10rem] text-[#c9969e]/20 group-hover:text-[#c9969e]/30 leading-none transition-all duration-700" style={{ fontFamily: "Playfair Display, serif" }}>
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="lg:col-span-10 space-y-6">
                        <h4
                          className="text-[clamp(2rem,5vw,3.5rem)] text-[#251218] leading-[0.95]"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                        >
                          {stage.name}
                        </h4>

                        <div className="w-24 h-px bg-[#c9969e]"></div>

                        <p
                          className="text-xl text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300, fontStyle: "italic" }}
                        >
                          {stage.subtitle}
                        </p>

                        <p className="text-lg text-[#251218]/80 leading-relaxed max-w-3xl" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                          {stage.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
            </div>
          </div>
        </div>

        {/* Audit Add-Ons - Refined section */}
        <div id="audits" className="bg-[#251218] py-40 relative overflow-hidden">
          {/* Smooth gradient at top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#fdf5f7] to-transparent pointer-events-none"></div>

          <div className="absolute inset-0 bg-gradient-to-b from-[#c9969e]/5 via-transparent to-[#c9969e]/5"></div>

          {/* Smooth gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fdf5f7] to-transparent pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-8 relative">
            <div className="mb-24">
              <p className="text-xs uppercase tracking-[0.5em] text-[#c9969e] mb-8" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                Add On Services
              </p>
              <h2
                className="text-[clamp(2.5rem,7vw,5.5rem)] text-[#fdf5f7] leading-[0.95] italic"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
              >
                Focused Brand Audits
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {auditAddOns.map((audit, index) => (
                <div
                  key={audit.id}
                  className="group relative bg-[#fdf5f7] p-16 hover:-translate-y-2 transition-all duration-700 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
                >
                  <div className="absolute -top-6 -left-6 text-[7rem] text-[#c9969e]/10 leading-none select-none" style={{ fontFamily: "Playfair Display, serif" }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10">
                    <h3
                      className="text-3xl text-[#251218] mb-6 leading-tight"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                    >
                      {audit.name}
                    </h3>

                    <div className="w-16 h-px bg-[#c9969e] mb-8"></div>

                    <p
                      className="text-lg text-[#251218]/70 mb-10"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300, fontStyle: "italic" }}
                    >
                      {audit.subtitle}
                    </p>

                    <div className="flex items-center gap-6 mb-12">
                      <span
                        className="text-2xl text-[#251218]/30 line-through"
                        style={{ fontFamily: "Playfair Display, serif", fontWeight: 300 }}
                      >
                        {audit.price}
                      </span>
                      <span
                        className="text-5xl text-[#251218]"
                        style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                      >
                        {audit.salePrice}
                      </span>
                    </div>

                    <div className="space-y-8 mb-12">
                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-[#c9969e] mb-3" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                          Coverage
                        </p>
                        <p className="text-base text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                          {audit.whatThisCovers}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-[#c9969e] mb-3" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                          Identified
                        </p>
                        <p className="text-base text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                          {audit.whatIsIdentified}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-[#c9969e] mb-3" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                          Outcome
                        </p>
                        <p className="text-base text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                          {audit.outcome}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleAddToCart({
                          id: audit.id,
                          name: audit.name,
                          priceNum: audit.priceNum,
                          originalPriceNum: audit.originalPriceNum,
                          subtitle: audit.subtitle,
                          type: "service",
                        })
                      }
                      className={`group/btn relative w-full py-5 bg-[#251218] text-[#fdf5f7] text-xs uppercase tracking-[0.5em] overflow-hidden ${
                        !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                      } transition-all duration-700`}
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
                    >
                      <span className="relative z-10">Add to Cart</span>
                      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full ${!isMobile ? "group-hover/btn:translate-x-full" : ""} transition-transform duration-1000`}></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Digital Products - Elegant layout */}
        <div className="bg-[#fdf5f7] py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9969e]/5 to-transparent"></div>

          <div className="max-w-7xl mx-auto px-8 relative">
            <div className="mb-32">
              <div className="mb-24">
                <p className="text-xs uppercase tracking-[0.5em] text-[#c9969e] mb-8" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                  Digital Products
                </p>
                <h2
                  className="text-[clamp(2.5rem,7vw,5.5rem)] text-[#251218] mb-12 leading-[0.95] italic"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
                >
                  Brand Ready Visuals
                </h2>
                <p
                  className="text-xl text-[#251218]/70 max-w-xl"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Instant access. No revisions. Ready to use.
                </p>
              </div>

              <div className="max-w-4xl mb-20">
                <div className="bg-white/50 backdrop-blur-sm px-12 py-8 border-l-2 border-[#c9969e]">
                  <p className="text-sm text-[#251218]/70 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    All visuals are AI generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {digitalProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="group relative bg-white/40 hover:bg-white transition-all duration-700 hover:-translate-y-2 overflow-hidden shadow-[0_10px_40px_rgba(74,26,58,0.05)] hover:shadow-[0_20px_60px_rgba(201,150,158,0.15)]"
                  >
                    <div className="p-12">
                      <div className="mb-8">
                        <div className="text-5xl text-[#c9969e]/15 mb-4 leading-none select-none" style={{ fontFamily: "Playfair Display, serif" }}>
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <h3
                          className="text-2xl text-[#251218] mb-4"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                        >
                          {product.name}
                        </h3>
                        <div className="w-12 h-px bg-[#c9969e]"></div>
                      </div>

                      <div className="flex items-center gap-4 mb-8">
                        <span
                          className="text-xl text-[#251218]/30 line-through"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 300 }}
                        >
                          {product.originalPrice}
                        </span>
                        <span
                          className="text-3xl text-[#251218]"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                        >
                          {product.price}
                        </span>
                      </div>

                      <p className="text-sm text-[#251218]/70 mb-8 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                        {product.description}
                      </p>

                      <div className="mb-8 space-y-4">
                        <p className="text-[9px] uppercase tracking-[0.4em] text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 300 }}>
                          Includes
                        </p>
                        {product.scenes?.map((scene, idx) => (
                          <div key={idx}>
                            <p className="text-xs text-[#251218] mb-1" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}>
                              {scene.title}
                            </p>
                            <p className="text-xs text-[#251218]/60 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                              {scene.detail}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          handleAddToCart({
                            id: product.id,
                            name: product.name,
                            priceNum: product.priceNum,
                            originalPriceNum: product.originalPriceNum,
                            type: "digital",
                          })
                        }
                        className={`group/btn relative w-full py-4 bg-[#251218] text-[#fdf5f7] text-xs uppercase tracking-[0.5em] overflow-hidden ${
                          !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                        } transition-all duration-700`}
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
                      >
                        <span className="relative z-10">Add to Cart</span>
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full ${!isMobile ? "group-hover/btn:translate-x-full" : ""} transition-transform duration-1000`}></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            <div className="mt-16 text-center mx-auto max-w-4xl px-8 hidden md:block">
              <div className="h-px bg-gradient-to-r from-transparent via-[#c9969e]/30 to-transparent mb-8"></div>
              <p className="text-sm text-[#251218]/70 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                All digital products include commercial use rights   Files
                delivered instantly after purchase   No edits, swaps, or
                personalization included
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-[#c9969e]/30 to-transparent mt-8"></div>
            </div>

            <div className="mt-16 mb-32 hidden md:block text-center">
              <div className="relative mx-auto max-w-6xl">
                {/* Elegant corner accents */}
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t border-l border-[#c9969e]/40"></div>
                <div className="absolute -top-4 -right-4 w-12 h-12 border-t border-r border-[#c9969e]/40"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b border-l border-[#c9969e]/40"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b border-r border-[#c9969e]/40"></div>

                <div className="bg-gradient-to-br from-[#251218] to-[#251218]/95 px-24 py-12 relative overflow-hidden shadow-[0_30px_80px_rgba(74,26,58,0.3)]">
                  {/* Subtle shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9969e]/10 to-transparent"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-px bg-[#c9969e]/50"></div>
                      <span
                        className="text-[9px] uppercase tracking-[0.6em] text-[#c9969e]"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 300,
                        }}
                      >
                        Exclusive Offer
                      </span>
                      <div className="w-16 h-px bg-[#c9969e]/50"></div>
                    </div>

                    <p
                      className="text-4xl text-[#fdf5f7] mb-2 italic"
                      style={{
                        fontFamily: "Playfair Display, serif",
                        fontWeight: 400,
                      }}
                    >
                      Limited Time Only
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <CTAFooter />
      </div>
    </>
  );
}
