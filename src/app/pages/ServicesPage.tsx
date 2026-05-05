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
        description:
          "How your brand is seen at first glance — before a single word is read or a service is experienced.",
      },
      {
        name: "Translation",
        description:
          "How clearly your message is communicated — whether clients immediately understand your value or scroll past.",
      },
      {
        name: "Visual Clarity",
        description:
          "How aligned your visuals appear — whether every element communicates the same level you're operating at.",
      },
      {
        name: "Consistency",
        description:
          "How reliable your brand identity remains — whether your brand holds its standard as you grow and scale.",
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
        "A structured visual system is built custom your brand so your content stays consistent, controlled, and aligned as you grow.",
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
          "A perfectly structured set shown up close with sharp shape, smooth application, and high-gloss shine. Bold enough to stop scrolling and strong enough to support pricing.",
      },
      {
        title: "Scene 3: The Detail Standard",
        detail:
          "A set shot highlighting symmetry, structure, and consistency. Designed to visually emphasize the level of care behind every appointment.",
      },
    ],
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
  },
];

const painPoints = [
  `"I'm posting consistently but nobody's booking"`,
  `"My content gets views but no appointments"`,
  `"I keep lowering my prices just to fill my chair"`,
  `"My visuals don't match the level of my work"`,
  `"Other pros are booked out — what am I doing wrong?"`,
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

const testimonials = [
  {
    initial: "J",
    name: "Jade M.",
    role: "Lash Artist · AVERRA Client",
    text:
      "After going through the alignment process, I raised my prices and my bookings actually increased. The clarity in my brand changed how clients perceived my value before they even reached out.",
  },
  {
    initial: "C",
    name: "Camille R.",
    role: "Makeup Artist · AVERRA Client",
    text:
      "I had beautiful work but my brand didn't show it. Within weeks of working with AVERRA, I had new clients commenting that my feed looked like a luxury brand — and booking to match.",
  },
  {
    initial: "K",
    name: "Kezia T.",
    role: "Nail Artist · AVERRA Client",
    text:
      "The Brand Perception Audit alone was worth it. It showed me exactly where my visuals were undercutting my prices. I fixed those things and the difference was immediate — clients stopped negotiating.",
  },
  {
    initial: "S",
    name: "Simone A.",
    role: "Esthetician · AVERRA Client",
    text:
      "I always had a vibe for my brand but couldn't make it consistent. AVERRA gave me a system so every post, every story, every graphic — it all feels like the same brand. The loyalty I've built since then is different.",
  },
  {
    initial: "B",
    name: "Brianna H.",
    role: "Hair Stylist · AVERRA Client",
    text:
      "I went from looking like every other hair stylist on the feed to being the one people tag when they talk about elevated salons in my city. The visual system AVERRA built me did that.",
  },
  {
    initial: "M",
    name: "Maya L.",
    role: "Brow Artist · AVERRA Client",
    text:
      "The Brand Expansion Audit was exactly what I needed when I started scaling. My brand didn't drift — it grew. That's rare. AVERRA built me a system that grows with me, not against me.",
  },
];

const shimmerClass =
  "relative overflow-hidden before:absolute before:inset-y-0 before:left-[-140%] before:w-[120%] before:skew-x-[-24deg] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] before:transition-transform before:duration-1000 hover:before:translate-x-[240%]";

const headingStyle = { fontFamily: "Playfair Display, serif" } as const;
const bodyStyle = { fontFamily: "Lora, serif", fontWeight: 300 } as const;
const labelStyle = { fontFamily: "Montserrat, sans-serif" } as const;

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Lora:wght@300;400;500&family=Montserrat:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="min-h-screen bg-[#fdf5f7] text-[#251218]">
        <div className="bg-[#251218] px-4 py-3 text-center">
          <p
            className="text-[10px] uppercase tracking-[0.18em] text-[#fdf5f7] md:text-[11px]"
            style={{ ...labelStyle, fontWeight: 600 }}
          >
            Founding Member Pricing — Limited Time · Up To 50% Off · Spots Are Closing
          </p>
        </div>

        <div className="sticky top-0 z-50 border-b border-[#251218]/10 bg-[#fdf5f7]">
          <Navigation />
        </div>

        <div className="bg-[#c9969e] py-2">
          <MarqueeScroll disableOnMobile={false} duration={30}>
            <div
              className="flex items-center gap-7 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-[#fdf5f7]"
              style={{ ...labelStyle, fontWeight: 700 }}
            >
              <span>Founding Members Only</span>
              <span>•</span>
              <span>Launch Pricing — Up To 50% Off</span>
              <span>•</span>
              <span>Limited Time Only</span>
              <span>•</span>
              <span>Founding Members Only</span>
              <span>•</span>
              <span>Launch Pricing — Up To 50% Off</span>
              <span>•</span>
              <span>Limited Time Only</span>
              <span>•</span>
              <span>Founding Members Only</span>
              <span>•</span>
              <span>Launch Pricing — Up To 50% Off</span>
              <span>•</span>
              <span>Limited Time Only</span>
            </div>
          </MarqueeScroll>
        </div>

        <section className="grid min-h-[88vh] grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center bg-[#fdf5f7] px-6 py-16 md:px-10 lg:px-16 xl:px-20">
            <div className="max-w-[560px]">
              <div className="mb-8 inline-flex items-center border border-[#c9969e]/35 bg-[#fbf0f3] px-6 py-3">
                <p
                  className="text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
                  style={{ ...labelStyle, fontWeight: 700 }}
                >
                  Brand Alignment System
                </p>
              </div>

              <h1
                className="mb-4 text-[clamp(2.8rem,5vw,4.8rem)] leading-[1.08] text-[#251218]"
                style={{ ...headingStyle, fontWeight: 400 }}
              >
                Your brand should work
                <br />
                <span className="italic text-[#c9969e]">as hard as you do.</span>
              </h1>

              <p className="mb-10 max-w-[400px] text-[14px] leading-[1.8] text-[#251218]/65" style={bodyStyle}>
                The market is full of talent. Very few are built on <span style={{ fontWeight: 500, color: "#251218" }}>clarity.</span>
                <br />
                <br />
                When your brand doesn't communicate at the level you're operating at, clients hesitate, pricing becomes harder to justify, and your work gets lost in a saturated market.
              </p>

              <div className="mb-10 flex items-end gap-4">
                <span className="text-[28px] text-[#251218]/35 line-through" style={{ ...headingStyle, fontWeight: 300 }}>
                  {brandAlignmentService.price}
                </span>
                <span className="text-[56px] leading-none text-[#251218]" style={{ ...headingStyle, fontWeight: 400 }}>
                  {brandAlignmentService.salePrice}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleStartBrandAlignment}
                  className={`${shimmerClass} inline-block bg-[#251218] px-9 py-4 text-[11px] uppercase tracking-[0.16em] text-[#fdf5f7] transition-colors duration-200 ${
                    !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                  }`}
                  style={{ ...labelStyle, fontWeight: 700 }}
                >
                  Get Started
                </button>

                <Link
                  to="/about"
                  className="inline-block border border-[#251218] px-9 py-4 text-[11px] uppercase tracking-[0.16em] text-[#251218] transition-colors duration-200 hover:bg-[#251218] hover:text-[#fdf5f7]"
                  style={{ ...labelStyle, fontWeight: 700 }}
                >
                  The Process
                </Link>
              </div>
            </div>
          </div>

          <div className="relative hidden overflow-hidden bg-[#251218] lg:block">
            <img
              src={getImageUrl("/services-hero.png")}
              alt="AVERRA Services"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#251218]/45" />
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-[220px] text-[#c9969e]/12"
              style={{ ...headingStyle, fontWeight: 400 }}
            >
              A
            </div>
            <div className="absolute bottom-10 left-10 bg-[#c9969e] px-5 py-2.5">
              <p
                className="text-[10px] uppercase tracking-[0.18em] text-[#fdf5f7]"
                style={{ ...labelStyle, fontWeight: 700 }}
              >
                Clarity Through Alignment
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-12 left-1/2 hidden -translate-x-1/2 lg:block">
            <div className="h-16 w-px bg-gradient-to-b from-[#c9969e] to-transparent" />
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#251218] py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#fdf5f7] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fdf5f7] to-transparent" />

          <div className="border-y border-[#c9969e]/25 py-4">
            <MarqueeScroll disableOnMobile={false} duration={28}>
              <div
                className="flex items-center gap-8 whitespace-nowrap text-[10px] uppercase tracking-[0.24em] text-[#c9969e]"
                style={{ ...labelStyle, fontWeight: 700 }}
              >
                <span>Launch Pricing</span>
                <span>•</span>
                <span>Limited Time Only</span>
                <span>•</span>
                <span>Founding Members Only</span>
                <span>•</span>
                <span>Up To 50% Off</span>
                <span>•</span>
                <span>Launch Pricing</span>
                <span>•</span>
                <span>Limited Time Only</span>
                <span>•</span>
                <span>Founding Members Only</span>
                <span>•</span>
                <span>Up To 50% Off</span>
              </div>
            </MarqueeScroll>
          </div>

          <div className="mx-auto max-w-4xl px-8 py-16 text-center">
            <h2
              className="mb-4 text-[clamp(2.6rem,5vw,4.8rem)] italic text-[#fdf5f7]"
              style={{ ...headingStyle, fontWeight: 400 }}
            >
              Founding Members
            </h2>
            <div className="inline-block border border-[#c9969e]/30 bg-[#c9969e]/10 px-10 py-4">
              <p
                className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e]"
                style={{ ...labelStyle, fontWeight: 300 }}
              >
                Limited Time Offer
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fdf5f7] px-6 py-24 md:px-10 lg:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="relative">
                <div
                  className="pointer-events-none absolute -left-4 -top-10 text-[7rem] leading-none text-[#c9969e]/10 md:text-[10rem]"
                  style={{ ...headingStyle, fontWeight: 400 }}
                >
                  01
                </div>
                <h2
                  className="relative z-10 mb-6 text-[clamp(2.5rem,5vw,4.6rem)] leading-[0.95] text-[#251218]"
                  style={{ ...headingStyle, fontWeight: 400 }}
                >
                  AVERRA Brand
                  <br />
                  <span className="italic">Alignment</span>
                </h2>
                <div className="h-px w-20 bg-[#c9969e]" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="mb-8 inline-block border-l-2 border-[#c9969e] bg-[#fbf0f3] px-8 py-3">
                <p
                  className="text-[10px] uppercase tracking-[0.5em] text-[#c9969e]"
                  style={{ ...labelStyle, fontWeight: 300 }}
                >
                  {brandAlignmentService.subtitle}
                </p>
              </div>

              <p className="text-[22px] leading-[1.8] text-[#251218]/80 md:text-[26px]" style={bodyStyle}>
                {brandAlignmentService.description}
              </p>
            </div>
          </div>
        </section>

        <section id="system" className="bg-[#fdf5f7] px-6 py-24 md:px-10 lg:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <h2
                className="mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] text-[#251218]"
                style={{ ...headingStyle, fontWeight: 400 }}
              >
                The Industry
                <br />
                <span className="italic">Standard</span>
              </h2>
              <p className="text-[18px] leading-[1.9] text-[#251218]/68" style={bodyStyle}>
                {brandAlignmentService.industryStandard.intro}
              </p>
            </div>

            <div className="space-y-8">
              {brandAlignmentService.industryStandard.standards.map((standard, index) => (
                <div key={standard.name} className="group flex items-start gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#251218] transition-colors duration-300 group-hover:bg-[#c9969e]">
                    <span
                      className="text-[18px] text-[#fdf5f7] transition-colors duration-300 group-hover:text-[#251218]"
                      style={{ ...labelStyle, fontWeight: 300 }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-3 text-[28px] text-[#251218]" style={{ ...headingStyle, fontWeight: 400 }}>
                      {standard.name}
                    </h3>
                    <p className="text-[17px] leading-[1.9] text-[#251218]/68" style={bodyStyle}>
                      {standard.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-24 max-w-5xl text-center">
            <div className="relative inline-block px-12 py-10 md:px-20 md:py-12">
              <div className="absolute left-0 top-0 h-24 w-24 border-l border-t border-[#c9969e]" />
              <div className="absolute right-0 top-0 h-24 w-24 border-r border-t border-[#c9969e]" />
              <div className="absolute bottom-0 left-0 h-24 w-24 border-b border-l border-[#c9969e]" />
              <div className="absolute bottom-0 right-0 h-24 w-24 border-b border-r border-[#c9969e]" />

              <p className="text-[24px] leading-[1.8] text-[#251218]" style={bodyStyle}>
                {brandAlignmentService.industryStandard.conclusionPart1}
              </p>
              <p className="mt-3 text-[30px] italic text-[#c9969e]" style={{ ...headingStyle, fontWeight: 600 }}>
                {brandAlignmentService.industryStandard.conclusionPart2}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fbf0f3] px-6 py-24 md:px-10 lg:px-20">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
              style={{ ...labelStyle, fontWeight: 700 }}
            >
              The System
            </p>
            <h2
              className="mb-4 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] text-[#251218]"
              style={{ ...headingStyle, fontWeight: 400 }}
            >
              Three Stage Process
            </h2>
            <p className="text-[14px] leading-[1.85] text-[#251218]/65" style={bodyStyle}>
              Everything you create should leave no room for misinterpretation. The AVERRA process ensures it.
            </p>
          </div>

          <div className="mx-auto grid max-w-7xl gap-[2px] lg:grid-cols-3">
            {brandAlignmentService.stages.map((stage, index) => {
              const isMiddle = index === 1;
              return (
                <div key={stage.name} className={`${isMiddle ? "bg-[#251218]" : "bg-[#fdf5f7]"} px-8 py-12`}>
                  <div
                    className={`mb-3 text-[88px] leading-none ${
                      isMiddle ? "text-[#c9969e]/25" : "text-[#c9969e]/20"
                    }`}
                    style={{ ...headingStyle, fontWeight: 400 }}
                  >
                    {index + 1}
                  </div>

                  <div className="mb-5 h-px w-20 bg-[#c9969e]" />

                  <h3
                    className={`mb-3 text-[30px] ${isMiddle ? "text-[#fdf5f7]" : "text-[#251218]"}`}
                    style={{ ...headingStyle, fontWeight: 400 }}
                  >
                    {stage.name}
                  </h3>

                  <p
                    className={`mb-4 text-[14px] italic ${
                      isMiddle ? "text-[#fdf5f7]/68" : "text-[#251218]/58"
                    }`}
                    style={bodyStyle}
                  >
                    {stage.subtitle}
                  </p>

                  <p
                    className={`text-[14px] leading-[1.85] ${
                      isMiddle ? "text-[#fdf5f7]/72" : "text-[#251218]/68"
                    }`}
                    style={bodyStyle}
                  >
                    {stage.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="bg-[#c9969e] py-4">
          <MarqueeScroll disableOnMobile={false} duration={20}>
            <div className="flex items-center whitespace-nowrap">
              {resultsMarquee.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center">
                  <span
                    className="px-12 text-[22px] italic text-[#fdf5f7]"
                    style={{ ...headingStyle, fontWeight: 400 }}
                  >
                    {item}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#fdf5f7]/50" />
                </div>
              ))}
            </div>
          </MarqueeScroll>
        </div>

        <section className="bg-[#251218] px-6 py-24 md:px-10 lg:px-20">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
              style={{ ...labelStyle, fontWeight: 700 }}
            >
              Client Results
            </p>
            <h2
              className="text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] text-[#fdf5f7]"
              style={{ ...headingStyle, fontWeight: 400 }}
            >
              These results aren't luck. They're what happens when a brand is aligned.
            </h2>
          </div>

          <div className="mx-auto grid max-w-7xl gap-[2px] lg:grid-cols-3">
            {testimonials.map((review) => (
              <div key={review.name} className="border-t-2 border-[#c9969e] bg-white/5 px-7 py-9">
                <div
                  className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#c9969e] text-[13px] text-[#fdf5f7]"
                  style={{ ...labelStyle, fontWeight: 700 }}
                >
                  {review.initial}
                </div>

                <p className="mb-6 text-[13px] italic leading-[1.85] text-[#fdf5f7]/80" style={bodyStyle}>
                  "{review.text}"
                </p>

                <p
                  className="text-[11px] uppercase tracking-[0.14em] text-[#c9969e]"
                  style={{ ...labelStyle, fontWeight: 700 }}
                >
                  {review.name}
                </p>

                <p className="mt-1 text-[11px] text-[#fdf5f7]/40" style={labelStyle}>
                  {review.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="relative bg-[#251218] px-6 py-24 md:px-10 lg:px-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#fdf5f7] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fdf5f7] to-transparent" />

          <div className="mx-auto max-w-3xl pb-16 text-center">
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
              style={{ ...labelStyle, fontWeight: 700 }}
            >
              Add-On Services
            </p>
            <h2
              className="text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] text-[#fdf5f7]"
              style={{ ...headingStyle, fontWeight: 400 }}
            >
              Focused Brand Audits
            </h2>
          </div>

          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
            {auditAddOns.map((audit, index) => (
              <div key={audit.id} className="relative bg-[#fdf5f7] p-10 md:p-14">
                <div
                  className="pointer-events-none absolute left-6 top-2 text-[96px] leading-none text-[#c9969e]/10"
                  style={{ ...headingStyle, fontWeight: 400 }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="relative z-10">
                  <h3
                    className="mb-5 text-[32px] leading-[1.15] text-[#251218]"
                    style={{ ...headingStyle, fontWeight: 400 }}
                  >
                    {audit.name}
                  </h3>

                  <div className="mb-8 h-px w-16 bg-[#c9969e]" />

                  <p className="mb-8 text-[18px] italic text-[#251218]/68" style={bodyStyle}>
                    {audit.subtitle}
                  </p>

                  <div className="mb-10 flex items-baseline gap-4">
                    <span className="text-[26px] text-[#251218]/30 line-through" style={{ ...headingStyle, fontWeight: 300 }}>
                      {audit.price}
                    </span>
                    <span className="text-[48px] text-[#251218]" style={{ ...headingStyle, fontWeight: 400 }}>
                      {audit.salePrice}
                    </span>
                  </div>

                  <div className="mb-10 space-y-7">
                    <div>
                      <p
                        className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#c9969e]"
                        style={{ ...labelStyle, fontWeight: 700 }}
                      >
                        Coverage
                      </p>
                      <p className="text-[15px] leading-[1.8] text-[#251218]/75" style={bodyStyle}>
                        {audit.whatThisCovers}
                      </p>
                    </div>

                    <div>
                      <p
                        className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#c9969e]"
                        style={{ ...labelStyle, fontWeight: 700 }}
                      >
                        Identified
                      </p>
                      <p className="text-[15px] leading-[1.8] text-[#251218]/75" style={bodyStyle}>
                        {audit.whatIsIdentified}
                      </p>
                    </div>

                    <div>
                      <p
                        className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#c9969e]"
                        style={{ ...labelStyle, fontWeight: 700 }}
                      >
                        Outcome
                      </p>
                      <p className="text-[15px] leading-[1.8] text-[#251218]/75" style={bodyStyle}>
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
                    className={`${shimmerClass} w-full bg-[#251218] px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-[#fdf5f7] transition-colors duration-200 hover:bg-[#c9969e] hover:text-[#251218]`}
                    style={{ ...labelStyle, fontWeight: 700 }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="digitals" className="bg-[#fdf5f7] px-6 py-24 md:px-10 lg:px-20">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#c9969e]"
              style={{ ...labelStyle, fontWeight: 700 }}
            >
              Digital Products
            </p>

            <h2
              className="mb-4 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] text-[#251218]"
              style={{ ...headingStyle, fontWeight: 400 }}
            >
              Brand Ready Visuals
            </h2>

            <p className="text-[14px] leading-[1.85] text-[#251218]/65" style={bodyStyle}>
              Instant access. No revisions. Ready to use. AI-generated brand imagery created for marketing and promotional use.
            </p>
          </div>

          <div className="mx-auto grid max-w-7xl gap-[2px] lg:grid-cols-3">
            {digitalProducts.map((product) => (
              <div key={product.id} className="bg-[#fbf0f3] px-8 py-9">
                <p
                  className="mb-3 text-[9px] uppercase tracking-[0.22em] text-[#c9969e]"
                  style={{ ...labelStyle, fontWeight: 700 }}
                >
                  Digital Pack
                </p>

                <h3
                  className="mb-3 text-[22px] leading-[1.2] text-[#251218]"
                  style={{ ...headingStyle, fontWeight: 400 }}
                >
                  {product.name}
                </h3>

                <p className="mb-6 text-[12px] leading-[1.8] text-[#251218]/65" style={bodyStyle}>
                  {product.description}
                </p>

                <div className="mb-5 flex items-baseline gap-3">
                  <span className="text-[28px] text-[#251218]" style={{ ...headingStyle, fontWeight: 400 }}>
                    {product.price}
                  </span>
                  <span className="text-[14px] text-[#251218]/45 line-through" style={labelStyle}>
                    {product.originalPrice}
                  </span>
                </div>

                <div className="mb-7 space-y-4">
                  {product.scenes.map((scene) => (
                    <div key={scene.title} className="border-b border-[#251218]/10 pb-4">
                      <p className="mb-1 text-[11px] text-[#251218]" style={{ ...labelStyle, fontWeight: 600 }}>
                        {scene.title}
                      </p>
                      <p className="text-[12px] leading-[1.8] text-[#251218]/62" style={bodyStyle}>
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
                      description: product.description,
                    })
                  }
                  className={`${shimmerClass} w-full bg-[#251218] px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-[#fdf5f7] transition-colors duration-200 hover:bg-[#c9969e] hover:text-[#251218]`}
                  style={{ ...labelStyle, fontWeight: 700 }}
                >
                  Add To Cart
                </button>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[11px] leading-[1.7] text-[#251218]/55" style={labelStyle}>
            All digital products include commercial use rights · Files delivered instantly after purchase · No edits, swaps, or personalization included
          </p>
        </section>

        <section className="bg-[#fdf5f7] px-6 pb-8 pt-6 md:px-10 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="relative bg-[#251218] px-10 py-12 text-center shadow-[0_20px_60px_rgba(37,18,24,0.18)]">
              <div className="absolute left-0 top-0 h-12 w-12 border-l border-t border-[#c9969e]/50" />
              <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-[#c9969e]/50" />
              <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-[#c9969e]/50" />
              <div className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-[#c9969e]/50" />

              <div className="relative z-10">
                <p
                  className="mb-3 text-[9px] uppercase tracking-[0.5em] text-[#c9969e]"
                  style={{ ...labelStyle, fontWeight: 300 }}
                >
                  Exclusive Offer
                </p>
                <p className="text-[34px] italic text-[#fdf5f7]" style={{ ...headingStyle, fontWeight: 400 }}>
                  Limited Time Only
                </p>
              </div>
            </div>
          </div>
        </section>

        <CTAFooter />

        <footer className="bg-[#251218] px-6 pb-10 pt-16 md:px-10 lg:px-20">
          <div className="mb-14 grid gap-10 border-b border-[#fdf5f7]/10 pb-14 md:grid-cols-3">
            <div>
              <div
                className="mb-3 text-[28px] uppercase tracking-[0.18em] text-[#c9969e]"
                style={{ ...headingStyle, fontWeight: 400 }}
              >
                Averra
              </div>
              <p className="text-[11px] leading-[1.7] text-[#fdf5f7]/40" style={labelStyle}>
                Clarity Through Alignment.
                <br />
                The brand system for beauty professionals operating at the highest level.
              </p>
            </div>

            <div>
              <p
                className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[#fdf5f7]/35"
                style={{ ...labelStyle, fontWeight: 700 }}
              >
                Navigation
              </p>

              <div className="space-y-3">
                <Link to="/about" className="block text-[12px] text-[#fdf5f7]/60 transition-colors hover:text-[#c9969e]" style={labelStyle}>
                  The Process
                </Link>
                <a href="#services" className="block text-[12px] text-[#fdf5f7]/60 transition-colors hover:text-[#c9969e]" style={labelStyle}>
                  Services
                </a>
                <a href="#digitals" className="block text-[12px] text-[#fdf5f7]/60 transition-colors hover:text-[#c9969e]" style={labelStyle}>
                  Digital Products
                </a>
                <a href="#flagship" className="block text-[12px] text-[#fdf5f7]/60 transition-colors hover:text-[#c9969e]" style={labelStyle}>
                  Brand Alignment
                </a>
              </div>
            </div>

            <div>
              <p
                className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[#fdf5f7]/35"
                style={{ ...labelStyle, fontWeight: 700 }}
              >
                Policies
              </p>

              <div className="space-y-3">
                <p className="text-[12px] text-[#fdf5f7]/60" style={labelStyle}>Privacy Policy</p>
                <p className="text-[12px] text-[#fdf5f7]/60" style={labelStyle}>Refund Policy</p>
                <p className="text-[12px] text-[#fdf5f7]/60" style={labelStyle}>Terms of Service</p>
                <p className="text-[12px] text-[#fdf5f7]/60" style={labelStyle}>Contact</p>
              </div>
            </div>
          </div>

          <div
            className={`flex ${isMobile ? "flex-col gap-3 text-center" : "items-center justify-between"} text-[11px] text-[#fdf5f7]/25`}
            style={labelStyle}
          >
            <span>© 2026 AVERRA. All rights reserved.</span>
            <span>Clarity Through Alignment</span>
          </div>
        </footer>
      </div>
    </>
  );
}
