REDESIGN THE AVERRA SITE SERVICE PAGE VISUALLY ONLY. DO NOT CHANGE THE CURRENT EXISTING TEXT, BRAND VOICE, OR COPY STRUCTURE. KEEP ALL CURRENT WORDING EXACTLY AS WRITTEN UNLESS NECESSARY FOR UI LABELS. CHANEG THE WORDING OF THIS ATTACHEMENT BUT TAKE THE VISUAL ELEMENT AND COPY IT TO THIS CURRENT
import { Navigation } from "@/app/components/Navigation";
import { Link, useNavigate } from "react-router";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { CTAFooter } from "@/app/components/CTAFooter";
import { MarqueeScroll } from "@/app/components/MarqueeScroll";
import { trackAction } from "@/utils/analytics";
import { getImageUrl } from "@/utils/imageHelpers";

const brandAlignmentService = {
  id: "brand-alignment",
  name: "AVERRA Brand Alignment System",
  subtitle: "Industry Standard Alignment",
  price: "$250",
  salePrice: "$100",
  priceNum: 100,
  originalPriceNum: 250,
  description:
    "A complete alignment system built to ensure your brand reflects the level you're intentionally operating at so the right clients find you.",
  industryStandard: {
    title: "The Industry Standard",
    intro:
      "When there's no defined brand identity behind your visuals, content becomes scattered, clients become inconsistent, and loyalty drops no matter how good the work is.",
    standards: [
      {
        name: "Perception",
        description: "How your brand is seen at first glance.",
      },
      {
        name: "Translation",
        description: "How clearly your message is communicated.",
      },
      {
        name: "Visual Clarity",
        description: "How aligned your visuals appear.",
      },
      {
        name: "Consistency",
        description: "How reliable your brand identity remains.",
      },
    ],
    conclusionPart1: "If any of these are off, your value decreases.",
    conclusionPart2: "Our system corrects that.",
  },
  stages: [
    {
      name: "Interpretation",
      subtitle: "Determining Brand Direction",
      detail:
        "We establish your brand identity and intention so everything you create leaves no room for misinterpretation.",
    },
    {
      name: "Alignment",
      subtitle: "Unifies The Presentation",
      detail:
        "We evaluate every visual element so everything communicates equally. This eliminates mixed signals and strengthens how your brand is perceived.",
    },
    {
      name: "Stabilization",
      subtitle: "Maintaining Consistency",
      detail:
        "A structured visual system is built custom to your brand so your content stays consistent, controlled, and aligned as you grow.",
    },
  ],
  deliverables: [
    "Defined brand direction",
    "Aligned visual framework",
    "Corrected perception and positioning",
    "Structured content system with clear standards for future content",
  ],
};

const auditAddOns = [
  {
    id: "brand-perception-audit",
    name: "Brand Perception Audit",
    price: "$100",
    salePrice: "$75",
    priceNum: 75,
    originalPriceNum: 100,
    subtitle: "A focused evaluation of how your brand is currently being seen",
    whatThisCovers:
      "Visual consistency, message clarity, perceived value, and overall brand presence.",
    whatIsIdentified:
      "What your visuals are actually communicating and where they're lowering the level of your brand.",
    outcome:
      "Exact direction on what to address so nothing about your brand undersells or contradicts what you're actually capable of.",
  },
  {
    id: "brand-expansion-audit",
    name: "Brand Expansion Audit",
    price: "$100",
    salePrice: "$75",
    priceNum: 75,
    originalPriceNum: 100,
    subtitle:
      "A focused consultation on how to scale your brand without your identity or perception shifting in the process.",
    whatThisCovers:
      "Where your brand starts to drift as content increases and what's needed to keep it controlled.",
    whatIsIdentified:
      "Where your brand loses control as content and output increase.",
    outcome:
      "A brand that holds its standard, its identity, and its level regardless of how far it grows",
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
      "Three individual lash focused visuals featuring clean isolation, full lash lines, soft volume, and a polished finish, this pack highlights the detail and precision behind expert lash work. Ideal for set promos, fill reminders, new announcements, retention or education posts. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      {
        title: "Scene 1: The Service Moment",
        detail:
          "A relaxed in service lash appointment capturing focused application, clean placement, and steady hands at work. A professional behind the bed moment that shows care and control.",
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
      "3 high resolution AI generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
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
          "A focused in service shot capturing mapping, shaping, and hands on detail. Clean lines and steady technique that show real expertise.",
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
      "3 high resolution AI generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
  {
    id: "makeup-artistry-look",
    name: "The Base Bundle",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three elevated visuals designed to make artistry feel visible, polished, and undeniable. Featuring seamless blend, flawless base, clean liner work, soft highlight, and camera ready finish, this pack captures the level of detail clients expect from a serious MUA. Ideal for brand announcements, glam promos, launches, sales, or showcasing signature looks. Built to use immediately across socials, booking platforms, and promotional graphics.",
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
      "3 high resolution AI generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
  {
    id: "hair-styling-look",
    name: "Fresh Out The Chair",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three hair focused visuals created to showcase precision, shine, and that polished finish clients book for. Ideal for launches, specials, promos, seasonal hair campaigns, or transformations. Built to use immediately across socials, booking platforms, and promotional graphics.",
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
      "3 high resolution AI generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
  {
    id: "nail-services-look",
    name: "The Cuticle Collection",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description:
      "Three manicure visuals designed to highlight structure, precision, and that flawless finished set clients zoom in on. Featuring clean cuticle work, sharp shaping, smooth structure, and high gloss shine, this pack makes detail visible at first glance. Ideal for new set promos, seasonal design launches, retention education posts, price increases, or showcasing signature shapes and finishes. Built to use immediately across socials, booking platforms, and promotional graphics.",
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
      "3 high resolution AI generated scenes",
      "Commercial use license",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
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
      "3 AI generated brand scenes",
      "Commercial use license for marketing and promotional materials",
      "Instant download",
      "No edits or customization",
    ],
    positioning:
      "All visuals are AI generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
];

const painPoints = [
  `"I'm posting consistently but nobody's booking"`,
  `"My content gets views but no appointments"`,
  `"I keep lowering my prices just to fill my chair"`,
  `"My visuals don't match the level of my work"`,
  `"Other pros are booked out. What am I doing wrong?"`,
  `"I have no idea how to make my brand feel premium"`,
];

const serviceTypes = [
  "Lashes",
  "Brows",
  "Nails",
  "Makeup",
  "Hair",
  "Facials",
  "Skincare",
  "Waxing",
  "Injections",
  "And more",
];

const reviewCards = [
  {
    initial: "J",
    text:
      "After the alignment work, I raised my prices and bookings didn’t drop. They improved. People came in already understanding the value.",
    name: "Jade M.",
    role: "Lash Artist · AVERRA Client",
  },
  {
    initial: "C",
    text:
      "My work was strong, but my feed didn’t show it. Once my brand was aligned, clients started calling it luxury and booking like it.",
    name: "Camille R.",
    role: "Makeup Artist · AVERRA Client",
  },
  {
    initial: "K",
    text:
      "The Brand Perception Audit showed exactly where my visuals were undercutting pricing. Fixing it changed the conversations immediately.",
    name: "Kezia T.",
    role: "Nail Artist · AVERRA Client",
  },
  {
    initial: "S",
    text:
      "I finally got a system. Every post feels like the same brand now. That consistency changed loyalty and how clients talk about me.",
    name: "Simone A.",
    role: "Esthetician · AVERRA Client",
  },
  {
    initial: "B",
    text:
      "I stopped blending in. My brand reads elevated, and now people tag me as the standard in my city.",
    name: "Brianna H.",
    role: "Hair Stylist · AVERRA Client",
  },
  {
    initial: "M",
    text:
      "The Brand Expansion Audit helped me scale without my brand cracking. Everything stayed aligned as I grew.",
    name: "Maya L.",
    role: "Brow Artist · AVERRA Client",
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

  const handleStartBrandAlignment = () => {
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
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7] text-[#251218]">
      <div className="bg-[#fdf5f7]">
        <Navigation />
return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Lora:wght@300;400;500&family=Montserrat:wght@400;500;600;700&display=swap');

      .services-page-root {
        background: #fdf5f7;
        color: #251218;
      }

      .services-page-root .pf {
        font-family: "Playfair Display", serif;
      }

      .services-page-root .lr {
        font-family: "Lora", serif;
      }

      .services-page-root .ms {
        font-family: "Montserrat", sans-serif;
      }
    `}</style>

    <div className="services-page-root min-h-screen bg-[#fdf5f7] text-[#251218]">
      <div className="bg-[#251218] px-4 py-3 text-center">
        <p className="ms text-[10px] font-medium uppercase tracking-[0.24em] text-[#fdf5f7] md:text-[11px]">
          Founding Member Pricing · Limited Time Only · Up To 50% Off
        </p>
      </div>

      <div
        className="border-b border-[#251218]/10 bg-[#251218] px-4 py-3 text-center text-[10px] uppercase tracking-[0.22em] text-[#fdf5f7]/90 md:text-[11px]"
        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
      >
        Founding Member Pricing · Limited Time Only · Up To 50% Off
      <div className="border-b border-[#251218]/10 bg-[#fdf5f7]">
        <Navigation />
      </div>

      <div className="bg-[#c9969e] py-2">
      <div className="bg-[#c9969e] py-2.5">
        <MarqueeScroll disableOnMobile={false} duration={28}>
          <div
            className="flex items-center gap-8 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-[#fdf5f7]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
          <div className="ms flex items-center gap-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.22em] text-[#fdf5f7]">
            <span>Founding Members Only</span>
            <span>•</span>
            <span>Launch Pricing Up To 50% Off</span>
@@ -459,88 +50,50 @@ export function ServicesPage() {
        </MarqueeScroll>
      </div>

      <section className="grid min-h-[88vh] grid-cols-1 bg-[#fdf5f7] lg:grid-cols-2">
      <section className="grid min-h-[86vh] grid-cols-1 bg-[#fdf5f7] lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 md:px-10 lg:px-16 xl:px-20">
          <div className="max-w-[560px]">
            <p
              className="mb-6 text-[10px] uppercase tracking-[0.28em] text-[#c9969e]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
            >
            <p className="ms mb-6 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c9969e]">
              Brand Alignment System
            </p>

            <h1
              className="mb-4 text-[clamp(2.9rem,6vw,5rem)] leading-[1.02] text-[#251218]"
              style={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
            <h1 className="pf mb-4 text-[clamp(2.8rem,5.5vw,5.2rem)] leading-[1.02] text-[#251218]">
              Your brand should work
              <br />
              <span className="italic text-[#c9969e]">as hard as you do.</span>
            </h1>

            <p
              className="mb-10 max-w-[470px] text-[15px] leading-[1.9] text-[#251218]/72 md:text-[16px]"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
            <p className="lr mb-10 max-w-[470px] text-[15px] font-light leading-[1.9] text-[#251218]/72 md:text-[16px]">
              The market is full of brands built on talent. Very few are built
              on clarity. When your brand doesn't communicate at the level
              you're operating at, clients hesitate, pricing becomes harder to
              justify, and your work gets lost in a saturated market.
            </p>

            <div className="mb-8 flex items-end gap-4 md:gap-6">
              <span
                className="text-2xl text-[#251218]/30 line-through md:text-3xl"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 300,
                }}
              >
              <span className="pf text-2xl font-light text-[#251218]/30 line-through md:text-3xl">
                {brandAlignmentService.price}
              </span>
              <span
                className="text-5xl leading-none text-[#251218] md:text-6xl"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                }}
              >
              <span className="pf text-5xl leading-none text-[#251218] md:text-6xl">
                {brandAlignmentService.salePrice}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStartBrandAlignment}
                className={`group relative inline-block overflow-hidden bg-[#251218] px-10 py-4 text-[11px] uppercase tracking-[0.22em] text-[#fdf5f7] transition-all duration-500 ${
                className={`ms inline-block bg-[#251218] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#fdf5f7] transition-all duration-300 ${
                  !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
                <span className="relative z-10">Get Started</span>
                <div
                  className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ${
                    !isMobile ? "group-hover:translate-x-full" : ""
                  }`}
                />
                Get Started
              </button>

              <Link
                to="/about"
                className={`inline-block border border-[#251218] px-10 py-4 text-[11px] uppercase tracking-[0.22em] text-[#251218] transition-all duration-500 ${
                className={`ms inline-block border border-[#251218] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#251218] transition-all duration-300 ${
                  !isMobile ? "hover:bg-[#251218] hover:text-[#fdf5f7]" : ""
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
                The Process
              </Link>
@@ -554,88 +107,63 @@ export function ServicesPage() {
            alt="AVERRA Services"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#251218]/15 via-[#251218]/50 to-[#251218]/78" />
          <div className="absolute inset-0 bg-[#251218]/45" />
          <div className="absolute bottom-10 left-10 bg-[#c9969e] px-5 py-2.5">
            <p
              className="text-[10px] uppercase tracking-[0.18em] text-[#fdf5f7]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
            >
            <p className="ms text-[10px] font-bold uppercase tracking-[0.18em] text-[#fdf5f7]">
              Clarity Through Alignment
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#251218] px-6 py-16 md:px-10 lg:px-20">
        <p
          className="mb-8 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
        >
        <p className="ms mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
          Sound Familiar?
        </p>

        <h2
          className="mb-12 max-w-[720px] text-[clamp(2rem,4vw,3.15rem)] leading-[1.14] text-[#fdf5f7]"
          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
        >
        <h2 className="pf mb-12 max-w-[720px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.14] text-[#fdf5f7]">
          If you're being honest, you've probably said this before…
        </h2>

        <div className="grid border-t border-[#fdf5f7]/10 md:grid-cols-2">
          {painPoints.map((point, index) => (
            <div
              key={point}
              className={`flex items-start gap-4 border-b border-[#fdf5f7]/10 py-6 text-[14px] leading-[1.7] text-[#fdf5f7]/82 ${
              className={`lr flex items-start gap-4 border-b border-[#fdf5f7]/10 py-6 text-[14px] font-light leading-[1.7] text-[#fdf5f7]/82 ${
                index % 2 === 0
                  ? "md:border-r md:border-[#fdf5f7]/10 md:pr-10"
                  : "md:pl-10"
              }`}
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              <span className="mt-[2px] text-[#c9969e]">•</span>
              <span className="mt-[2px] text-[#c9969e]">—</span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        <p
          className="mt-12 text-[clamp(1.6rem,3vw,2.2rem)] italic text-[#c9969e]"
          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
        >
        <p className="pf mt-12 text-[clamp(1.6rem,3vw,2.2rem)] italic text-[#c9969e]">
          The AVERRA Brand Alignment System was built to fix exactly that.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-12 bg-[#fbf0f3] px-6 py-16 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-20">
        <div>
          <p
            className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
          <p className="ms mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            Built For You
          </p>

          <h2
            className="mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
          <h2 className="pf mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            If you're a beauty service provider, this is for you.
          </h2>

          <p
            className="mb-6 text-[15px] leading-[1.9] text-[#251218]/70"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
          <p className="lr mb-6 text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Whether you specialize in lashes, brows, nails, hair, facials,
            makeup, skincare, or waxing, if clients book appointments with you,
            your brand identity determines everything. Perception, pricing,
            loyalty, and growth all start here.
          </p>

          <p
            className="text-[15px] leading-[1.9] text-[#251218]/70"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
          <p className="lr text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Any other beauty service? If you rely on clients to book, the
            AVERRA system applies to you.
          </p>
@@ -645,8 +173,7 @@ export function ServicesPage() {
          {serviceTypes.map((item) => (
            <div
              key={item}
              className="border-l-2 border-[#c9969e] bg-[#fdf5f7] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#251218]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              className="ms border-l-2 border-[#c9969e] bg-[#fdf5f7] px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#251218]"
            >
              {item}
            </div>
@@ -661,63 +188,44 @@ export function ServicesPage() {
            alt="The System Behind AVERRA"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#251218]/10 via-[#251218]/42 to-[#251218]/70" />
          <div className="absolute inset-0 bg-[#251218]/40" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#c9969e]" />
        </div>

        <div className="flex items-center bg-[#fdf5f7] px-6 py-16 md:px-10 lg:px-20">
          <div className="max-w-[620px]">
            <p
              className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
            >
            <p className="ms mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
              The System Behind AVERRA
            </p>

            <h2
              className="mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
            <h2 className="pf mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
              Built from experience, not theory.
            </h2>

            <p
              className="mb-6 text-[15px] leading-[1.9] text-[#251218]/70"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
            <p className="lr mb-6 text-[15px] font-light leading-[1.9] text-[#251218]/70">
              I have been exactly where you are. Building a brand without a
              system, posting without direction, and watching clients choose
              someone else, not because the work wasn't there, but because the
              brand wasn't communicating it.
            </p>

            <p
              className="mb-6 text-[15px] leading-[1.9] text-[#251218]/70"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
            <p className="lr mb-6 text-[15px] font-light leading-[1.9] text-[#251218]/70">
              I stopped guessing and started building with intention. The result
              was a brand that attracted the right clients, supported premium
              pricing, and stayed consistent as it grew. What took years to
              figure out, AVERRA has simplified into a structured system you can
              start using immediately.
            </p>

            <p
              className="mb-8 text-[16px] italic text-[#251218]"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
            <p className="lr mb-8 text-[16px] italic text-[#251218]">
              Real clarity. Real alignment. Real results.
            </p>

            <button
              onClick={handleStartBrandAlignment}
              className={`inline-block bg-[#251218] px-10 py-4 text-[11px] uppercase tracking-[0.22em] text-[#fdf5f7] transition-all duration-500 ${
              className={`ms inline-block bg-[#251218] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#fdf5f7] transition-all duration-300 ${
                !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
              }`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
              }}
            >
              Start The Process
            </button>
@@ -727,26 +235,17 @@ export function ServicesPage() {

      <section className="bg-[#fdf5f7] px-6 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-[760px] text-center">
          <p
            className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            {brandAlignmentService.industryStandard.title}
          </p>

          <h2
            className="mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
          <h2 className="pf mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            When any of these are off,
            <br />
            your value decreases.
          </h2>

          <p
            className="mx-auto max-w-[560px] text-[15px] leading-[1.9] text-[#251218]/70"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
          <p className="lr mx-auto max-w-[560px] text-[15px] font-light leading-[1.9] text-[#251218]/70">
            {brandAlignmentService.industryStandard.intro}
          </p>
        </div>
@@ -755,30 +254,15 @@ export function ServicesPage() {
          {brandAlignmentService.industryStandard.standards.map(
            (standard, index) => (
              <div key={standard.name} className="bg-[#fbf0f3] px-7 py-9">
                <div
                  className="mb-3 text-5xl text-[#c9969e]/25"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                  }}
                >
                <div className="pf mb-3 text-5xl text-[#c9969e]/25">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3
                  className="mb-3 text-[13px] uppercase tracking-[0.1em] text-[#251218]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                  }}
                >
                <h3 className="ms mb-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#251218]">
                  {standard.name}
                </h3>

                <p
                  className="text-[13px] leading-[1.85] text-[#251218]/70"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                <p className="lr text-[13px] font-light leading-[1.85] text-[#251218]/70">
                  {standard.description}
                </p>
              </div>
@@ -787,41 +271,26 @@ export function ServicesPage() {
        </div>

        <div className="mx-auto mt-14 max-w-[720px] text-center">
          <p
            className="text-[18px] leading-[1.8] text-[#251218]/75"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
          <p className="lr text-[18px] font-light leading-[1.8] text-[#251218]/75">
            {brandAlignmentService.industryStandard.conclusionPart1}
          </p>
          <p
            className="mt-2 text-[28px] italic text-[#c9969e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
          <p className="pf mt-2 text-[28px] italic text-[#c9969e]">
            {brandAlignmentService.industryStandard.conclusionPart2}
          </p>
        </div>
      </section>

      <section className="bg-[#fbf0f3] px-6 py-20 md:px-10 lg:px-20">
        <div className="mx-auto mb-14 max-w-[760px] text-center">
          <p
            className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            The System
          </p>

          <h2
            className="mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
          <h2 className="pf mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            Three Stage Process
          </h2>

          <p
            className="mx-auto max-w-[500px] text-[15px] leading-[1.9] text-[#251218]/70"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
          <p className="lr mx-auto max-w-[500px] text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Everything you create should leave no room for misinterpretation.
            The AVERRA process ensures it.
          </p>
@@ -837,55 +306,41 @@ export function ServicesPage() {
                className={`${isMiddle ? "bg-[#251218]" : "bg-[#fdf5f7]"} px-9 py-12`}
              >
                <div
                  className={`mb-2 text-7xl ${
                  className={`pf mb-2 text-7xl ${
                    isMiddle ? "text-[#c9969e]/30" : "text-[#c9969e]/25"
                  }`}
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                  }}
                >
                  {index + 1}
                </div>

                <p
                  className={`mb-4 text-[10px] uppercase tracking-[0.2em] ${
                  className={`ms mb-4 text-[10px] font-bold uppercase tracking-[0.2em] ${
                    isMiddle ? "text-[#fdf5f7]/80" : "text-[#c9969e]"
                  }`}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Stage {["One", "Two", "Three"][index]}
                </p>

                <h3
                  className={`mb-3 text-[28px] ${
                  className={`pf mb-3 text-[28px] ${
                    isMiddle ? "text-[#fdf5f7]" : "text-[#251218]"
                  }`}
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                  }}
                >
                  {stage.name}
                </h3>

                <p
                  className={`mb-4 text-[14px] italic ${
                  className={`lr mb-4 text-[14px] font-light italic ${
                    isMiddle ? "text-[#fdf5f7]/70" : "text-[#251218]/60"
                  }`}
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  {stage.subtitle}
                </p>

                <p
                  className={`text-[14px] leading-[1.85] ${
                  className={`lr text-[14px] font-light leading-[1.85] ${
                    isMiddle ? "text-[#fdf5f7]/75" : "text-[#251218]/75"
                  }`}
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  {stage.detail}
                </p>
@@ -909,13 +364,7 @@ export function ServicesPage() {
              "Identity that scales",
            ].map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center">
                <span
                  className="px-12 text-[22px] italic text-[#fdf5f7]"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                  }}
                >
                <span className="pf px-12 text-[22px] italic text-[#fdf5f7]">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#fdf5f7]/50" />
@@ -927,17 +376,11 @@ export function ServicesPage() {

      <section className="bg-[#251218] px-6 py-20 md:px-10 lg:px-20">
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            Client Results
          </p>

          <h2
            className="mx-auto max-w-[760px] text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#fdf5f7]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
          <h2 className="pf mx-auto max-w-[760px] text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#fdf5f7]">
            These results aren't luck. They're what happens when a brand is
            aligned.
          </h2>
@@ -949,31 +392,19 @@ export function ServicesPage() {
              key={review.name}
              className="border-t-2 border-[#c9969e] bg-white/[0.04] px-7 py-9"
            >
              <div
                className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#c9969e] text-[13px] text-[#fdf5f7]"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
              >
              <div className="ms mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#c9969e] text-[13px] font-bold text-[#fdf5f7]">
                {review.initial}
              </div>

              <p
                className="mb-6 text-[13px] italic leading-[1.85] text-[#fdf5f7]/82"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
              <p className="lr mb-6 text-[13px] font-light italic leading-[1.85] text-[#fdf5f7]/82">
                “{review.text}”
              </p>

              <p
                className="text-[11px] uppercase tracking-[0.14em] text-[#fdf5f7]"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
              >
              <p className="ms text-[11px] font-bold uppercase tracking-[0.14em] text-[#fdf5f7]">
                {review.name}
              </p>

              <p
                className="mt-1 text-[11px] text-[#fdf5f7]/45"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
              <p className="ms mt-1 text-[11px] text-[#fdf5f7]/45">
                {review.role}
              </p>
            </div>
@@ -983,24 +414,15 @@ export function ServicesPage() {

      <section id="audits" className="bg-[#fdf5f7] px-6 py-20 md:px-10 lg:px-20">
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            Add On Services
          </p>

          <h2
            className="mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
          <h2 className="pf mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            Focused Brand Audits
          </h2>

          <p
            className="mx-auto max-w-[500px] text-[15px] leading-[1.9] text-[#251218]/70"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
          <p className="lr mx-auto max-w-[500px] text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Targeted evaluations for specific brand problems, standalone or as
            an add on to your alignment system.
          </p>
@@ -1009,47 +431,23 @@ export function ServicesPage() {
        <div className="mx-auto grid max-w-[980px] gap-[2px] lg:grid-cols-2">
          {auditAddOns.map((audit) => (
            <div key={audit.id} className="bg-[#fbf0f3] px-8 py-9">
              <p
                className="mb-3 text-[9px] uppercase tracking-[0.22em] text-[#c9969e]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
              <p className="ms mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c9969e]">
                Brand Audit
              </p>

              <h3
                className="mb-3 text-[30px] leading-[1.2] text-[#251218]"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                }}
              >
              <h3 className="pf mb-3 text-[30px] leading-[1.2] text-[#251218]">
                {audit.name}
              </h3>

              <p
                className="mb-6 text-[13px] leading-[1.8] text-[#251218]/70"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
              <p className="lr mb-6 text-[13px] font-light leading-[1.8] text-[#251218]/70">
                {audit.subtitle}
              </p>

              <div className="mb-6 flex items-baseline gap-3">
                <span
                  className="text-[32px] text-[#251218]"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                  }}
                >
                <span className="pf text-[32px] text-[#251218]">
                  {audit.salePrice}
                </span>
                <span
                  className="text-[14px] text-[#251218]/45 line-through"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                <span className="ms text-[14px] text-[#251218]/45 line-through">
                  {audit.price}
                </span>
              </div>
@@ -1062,8 +460,7 @@ export function ServicesPage() {
                ].map((item, index) => (
                  <li
                    key={`${audit.id}-${index}`}
                    className="flex items-start gap-2 border-b border-[#251218]/10 py-3 text-[11px] text-[#251218]/70"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    className="ms flex items-start gap-2 border-b border-[#251218]/10 py-3 text-[11px] text-[#251218]/70"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#c9969e]" />
                    <span>{item}</span>
@@ -1082,13 +479,9 @@ export function ServicesPage() {
                    type: "service",
                  })
                }
                className={`w-full bg-[#251218] px-6 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#fdf5f7] transition-all duration-500 ${
                className={`ms w-full bg-[#251218] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fdf5f7] transition-all duration-300 ${
                  !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
                Add to Cart
              </button>
@@ -1097,36 +490,24 @@ export function ServicesPage() {
        </div>
      </section>

      <section id="digitals" className="bg-[#fbf0f3] px-6 py-20 md:px-10 lg:px-20">
      <section id="digitals" className="bg-[#fdf5f7] px-6 py-20 md:px-10 lg:px-20">
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            Digital Products
          </p>

          <h2
            className="mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
          <h2 className="pf mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            Brand Ready Visuals
          </h2>

          <p
            className="mx-auto max-w-[520px] text-[15px] leading-[1.9] text-[#251218]/70"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
          <p className="lr mx-auto max-w-[520px] text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Instant access. No revisions. Ready to use.
          </p>
        </div>

        <div className="mx-auto mb-14 max-w-4xl">
          <div className="border-l-2 border-[#c9969e] bg-[#fdf5f7] px-8 py-6">
            <p
              className="text-[13px] leading-[1.8] text-[#251218]/70"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
          <div className="border-l-2 border-[#c9969e] bg-[#fbf0f3] px-8 py-6">
            <p className="lr text-[13px] font-light leading-[1.8] text-[#251218]/70">
              All visuals are AI generated brand imagery created for marketing
              and promotional use. These images are intended to elevate brand
              presentation and should not be used to misrepresent real client
@@ -1135,63 +516,35 @@ export function ServicesPage() {
          </div>
        </div>

        <div className="grid gap-[2px] lg:grid-cols-3">
        <div className="grid gap-x-14 gap-y-14 lg:grid-cols-3">
          {digitalProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#fdf5f7] px-8 py-9 transition-transform duration-200 hover:-translate-y-1"
            >
              <p
                className="mb-3 text-[9px] uppercase tracking-[0.22em] text-[#c9969e]"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
            <div key={product.id}>
              <p className="ms mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c9969e]">
                Digital Pack
              </p>

              <h3
                className="mb-3 text-[28px] leading-[1.2] text-[#251218]"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                }}
              >
              <h3 className="pf mb-4 text-[30px] leading-[1.15] text-[#251218]">
                {product.name}
              </h3>

              <p
                className="mb-6 text-[12px] leading-[1.85] text-[#251218]/70"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
              <p className="lr mb-8 text-[13px] font-light leading-[1.9] text-[#251218]/66">
                {product.description}
              </p>

              <div className="mb-5 flex items-baseline gap-3">
                <span
                  className="text-[30px] text-[#251218]"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                  }}
                >
              <div className="mb-8 flex items-baseline gap-3">
                <span className="pf text-[34px] text-[#251218]">
                  {product.price}
                </span>
                <span
                  className="text-[14px] text-[#251218]/45 line-through"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                <span className="ms text-[14px] text-[#251218]/45 line-through">
                  {product.originalPrice}
                </span>
              </div>

              <ul className="mb-7">
              <ul className="mb-8">
                {product.scenes.map((scene) => (
                  <li
                    key={scene.title}
                    className="flex items-start gap-2 border-b border-[#251218]/10 py-3 text-[11px] text-[#251218]/70"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    className="ms flex items-start gap-2 border-b border-[#251218]/10 py-3 text-[11px] text-[#251218]/66"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#c9969e]" />
                    <span>{scene.title}</span>
@@ -1210,27 +563,19 @@ export function ServicesPage() {
                    description: product.description,
                  })
                }
                className={`w-full bg-[#251218] px-6 py-3.5 text-[10px] uppercase tracking-[0.18em] text-[#fdf5f7] transition-all duration-500 ${
                className={`ms w-full bg-[#251218] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fdf5f7] transition-all duration-300 ${
                  !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
                Add to Cart
                Add To Cart
              </button>
            </div>
          ))}
        </div>

        <p
          className="mt-10 text-center text-[11px] leading-[1.7] text-[#251218]/60"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
        <p className="ms mt-14 text-center text-[11px] leading-[1.7] text-[#251218]/50">
          All digital products include commercial use rights · Files delivered
          instantly after purchase · No edits, swaps, or personalization
          included
          instantly after purchase · No edits, swaps, or personalization included
        </p>
      </section>

@@ -1239,50 +584,31 @@ export function ServicesPage() {
        className="grid grid-cols-1 gap-12 bg-[#251218] px-6 py-20 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-20"
      >
        <div>
          <p
            className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
          <p className="ms mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            The Complete System
          </p>

          <h2
            className="mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#fdf5f7]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
          <h2 className="pf mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#fdf5f7]">
            AVERRA Brand Alignment
          </h2>

          <p
            className="mb-8 max-w-[560px] text-[15px] leading-[1.9] text-[#fdf5f7]/70"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
          <p className="lr mb-8 max-w-[560px] text-[15px] font-light leading-[1.9] text-[#fdf5f7]/70">
            {brandAlignmentService.description}
          </p>

          <div
            className="mb-2 text-[64px] leading-none text-[#c9969e]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 300 }}
          >
          <div className="pf mb-2 text-[64px] leading-none text-[#c9969e]">
            {brandAlignmentService.salePrice}
          </div>

          <p
            className="mb-9 text-[10px] uppercase tracking-[0.18em] text-[#fdf5f7]/45"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
          <p className="ms mb-9 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fdf5f7]/45">
            Founding Member Pricing · Was {brandAlignmentService.price}
          </p>

          <button
            onClick={handleStartBrandAlignment}
            className={`bg-[#c9969e] px-10 py-4 text-[11px] uppercase tracking-[0.22em] text-[#251218] transition-all duration-500 ${
            className={`ms bg-[#c9969e] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#251218] transition-all duration-300 ${
              !isMobile ? "hover:bg-[#fdf5f7]" : ""
            }`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
            }}
          >
            Get Started
          </button>
@@ -1321,30 +647,15 @@ export function ServicesPage() {
                key={module.title}
                className="flex gap-4 border-b border-[#fdf5f7]/10 py-5"
              >
                <span
                  className="w-8 shrink-0 text-[18px] text-[#c9969e]"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                  }}
                >
                <span className="pf w-8 shrink-0 text-[18px] text-[#c9969e]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <strong
                    className="mb-1 block text-[13px] text-[#fdf5f7]"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                  <strong className="ms mb-1 block text-[13px] font-semibold text-[#fdf5f7]">
                    {module.title}
                  </strong>
                  <p
                    className="text-[12px] leading-[1.75] text-[#fdf5f7]/75"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                  <p className="lr text-[12px] font-light leading-[1.75] text-[#fdf5f7]/75">
                    {module.body}
                  </p>
                </div>
@@ -1354,7 +665,31 @@ export function ServicesPage() {
        </div>
      </section>

      <section className="bg-[#fdf5f7] px-6 py-24 text-center md:px-10 lg:px-20">
        <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
          Exclusive Offer · Limited Time
        </p>

        <h2 className="pf mx-auto mb-4 max-w-[760px] text-[clamp(2rem,4vw,3.4rem)] leading-[1.12] text-[#251218]">
          Ready to be the face of your brand?
        </h2>

        <p className="lr mx-auto mb-10 max-w-[560px] text-[15px] font-light leading-[1.9] text-[#251218]/65">
          Discover your beauty brand style. Get your palette, voice tone, and
          next steps delivered in minutes.
        </p>

        <button
          onClick={handleStartBrandAlignment}
          className={`ms bg-[#251218] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#fdf5f7] transition-all duration-300 ${
            !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
          }`}
        >
          Start Brand Quiz
        </button>
      </section>

      <CTAFooter />
    </div>
  );
}
  </>
);

MAIN PUBLIC SITE:
The public-facing website should remain clean and premium:
— AVERRA (Homepage)
— About
— Services
— Members
— Contact
— Brand Quiz
MEMBERSHIP SYSTEM:
Create an entirely separate gated membership platform hosted INSIDE the AVERRA site.
MEMBERSHIP STRUCTURE:
There are TWO memberships:
The Blueprint
The Gold Standard
Both memberships require:
— Email login
— Password login
— Stripe subscription verification
— Protected routes
— Session persistence
— Active subscription checks
When users purchase:
— Stripe subscription is created
— User account is created automatically
— Welcome email is triggered through Resend
— Login credentials/setup link sent via email
— User redirected into onboarding flow
ONBOARDING EXPERIENCE:
After login, users first enter:
COMMUNITY WELCOME PAGE
This should feel cinematic, warm, elevated, and intentional.
WELCOME PAGE INCLUDES:
— Welcome message
— AVERRA mission
— Orientation video area
— “Start Here” steps
— Navigation overview
— Community standards
— Quick links into member sections
After onboarding, members access THEIR specific membership dashboard only.
THE BLUEPRINT MEMBERSHIP EXPERIENCE:
Minimal.
Focused.
Structured.
Strategic.
Dashboard sections:
— Monthly Frameworks
— eBook Access
— Community Discussions
— Saved Resources
— Business Notes
— Progress Tracker
THE GOLD STANDARD MEMBERSHIP EXPERIENCE:
More premium.
More expansive.
Higher touch.
Dashboard sections:
— Monthly Strategy Calls
— Replay Library
— Business Audit Portal
— Priority Community
— Brand Spotlight
— Resource Vault
— First Access Releases
— Direct Support Area
— Progress Dashboard
SIDEBAR EXPERIENCE:
Each membership gets its OWN dedicated sidebar navigation.
The sidebar should feel like:
Notion x Apple x Editorial Luxury Brand
Very clean.
Minimal icons.
Soft hover states.
Same color palette as on the current site.
Elegant transitions.
COMMUNITY FORUM:
Build a fully integrated internal AVERRA community forum hosted on-site.
NOT Facebook style.
NOT Discord style.
More refined and intentional.
The community should feel:
— Exclusive
— Professional
— Elevated
— Curated
FEATURES:
— Member profiles
— Topic categories
— Comment threads
— Announcements
— Pinned strategy posts
— Saved posts
— Search functionality
— Member badges
— Monthly challenge areas
— Community wins section
Separate access levels:
Blueprint users see Blueprint community spaces.
Gold Standard users see everything including premium discussions.
DIGITAL EBOOK DELIVERY SYSTEM:
The Gold Standard eBook should NOT simply download immediately.
NEW FLOW:
User purchases product
Stripe confirms payment
Resend triggers email automatically
Email contains:
— Thank you message
— Secure access link
— “Open Your Library” button
User clicks link
Redirects back to AVERRA website
Opens protected DIGITAL LIBRARY EXPERIENCE
DIGITAL LIBRARY EXPERIENCE:
Create a luxury reading experience.
The eBook should:
— Open in-browser
— Be readable on desktop/mobile
— Have “Read Aloud” support UI
— Have bookmark functionality
— Have progress saving
— Have download option
— Have fullscreen reading mode
— Feel like Kindle + Masterclass + luxury magazine
Do NOT make it feel like a basic PDF download page.
PAYMENT + SUBSCRIPTION FLOW:
Integrate:
— Stripe subscriptions
— Stripe customer portal
— Stripe webhook verification
— Resend email automation
IF SUBSCRIPTION IS ACTIVE:
Allow dashboard access.
IF SUBSCRIPTION FAILS OR EXPIRES:
Redirect user to:
MEMBERSHIP STATUS PAGE
This page should:
— Explain membership expired
— Offer update payment button
— Offer cancel membership button
— Maintain luxury design language
IF USER UPDATES PAYMENT:
Return them directly into their dashboard.
IF USER CANCELS:
Show confirmation state then redirect them back to main AVERRA website.
ADMIN EXPERIENCE:
Create internal admin dashboard concept for:
— Viewing members
— Managing subscriptions
— Uploading new frameworks
— Uploading strategy call replays
— Posting announcements
— Managing community posts
— Viewing engagement
UI STYLE:
Everything should feel:
— Calm
— Premium
— Structured
— Cinematic
— Intentional
— High-trust
— Elegant
NO harsh SaaS look.
NO bright tech startup feel.
NO generic templates.
ANIMATIONS:
Subtle only.
— Soft fades
— Slow hover movement
— Marquee motion matching existing pacing
— Smooth page transitions
— Elegant loading states
MOBILE EXPERIENCE:
Must be fully mobile optimized.
The membership area should feel APP-LIKE on mobile.
BOTTOM LINE:
This redesign should make AVERRA feel like:
A luxury beauty business education ecosystem.
Not just a website.
Not just a membership.
An entire protected business growth environment.
DO NOT CHANGE THE CURRENT COPY.
DO NOT CHANGE BRAND POSITIONING.
ONLY ELEVATE THE EXPERIENCE VISUALLY, STRUCTURALLY, AND FUNCTIONALLY.
