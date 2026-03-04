// src/app/pages/ServicesPage.tsx
import { Navigation } from "@/app/components/Navigation";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { CTAFooter } from "@/app/components/CTAFooter";
import { MarqueeScroll } from "@/app/components/MarqueeScroll";
import { trackAction } from "@/utils/analytics";

const tiers = [
  {
    id: "essentials",
    name: "AVERRA Essentials",
    subtitle: "Starter Brand Kit",
    price: "$200",
    salePrice: "$100",
    priceNum: 100,
    originalPriceNum: 200,
    description: "For The Entrepreneur That Deserves Elevated Branding.",
    features: [
      {
        name: "10 Custom AI Brand Models",
        detail:
          "High-quality, custom-built AI visuals that give the brand a face and elevated presence. Each model is created to align with industry niche and strategy.",
      },
      {
        name: "AVERRA Strategy Session",
        detail:
          "A focused session that defines visual positioning, target audience alignment, and brand tone before production begins. No random aesthetics. No scattered direction. Clarity then creation.",
      },
      {
        name: "Brand Presence Guide",
        detail:
          "Every visual communicates something. This guide breaks down the type of client the imagery attracts, the pricing it supports, and the shift it creates. When perception changes, opportunity changes.",
      },
      {
        name: "AVERRA Visual System Guide",
        detail:
          "A defined visual framework delivered in a clear, easy-to-follow PDF outlining custom color palettes, tone direction, and styling standards to keep the brand consistent across platforms. Consistency builds recognition. Recognition builds credibility.",
      },
      {
        name: "Commercial License Use",
        detail:
          "Rights to use all visuals across social media, websites, booking platforms, and marketing materials.",
      },
    ],
  },
  {
    id: "signature",
    name: "AVERRA Signature",
    subtitle: "Brand Authority Package",
    price: "$350",
    salePrice: "$250",
    priceNum: 250,
    originalPriceNum: 350,
    description: "For Brands Ready to Raise Pricing & Presence.",
    featured: true,
    features: [
      {
        name: "20 Custom AI Brand Models",
        detail:
          "Twenty custom-built AI brand models styled with intention giving the brand range, consistency, and control across every touchpoint. An expanded visual presence designed for depth.",
      },
      {
        name: "Advanced AVERRA Strategy Session",
        detail:
          "A personalized strategy session focused on expectation, pricing elevation, and market perception. Ensuring the visuals support pricing goals, stronger social presence, and clearer authority.",
      },
      {
        name: "Client Loyalty & Expectation Session",
        detail:
          "A strategic breakdown of how visuals bring value, attract aligned clientele, and support loyalty. When content reflects a higher level, expectations shift and when expectations shift, loyalty strengthens. This collaborative framework ensures every visual communicates intention and supports sustainable growth.",
      },
      {
        name: "Expanded AVERRA Visual System Guide",
        detail:
          "A complete visual brand framework outlining refined color palettes, brand tone, and styling standards to maintain a strong, recognizable presence. This guide serves as the blueprint for every brand decision moving forward to the future.",
      },
      {
        name: "Client Messaging Alignment Guide",
        detail:
          "A structured guide to strategize messaging standards, tone alignment, and professional presentation across platforms. How a brand communicates with clients shapes the clientele it attracts and the standards it maintains. This guide ensures messaging reflects the level the brand is stepping into so presence, professionalism, and expectation stay aligned.",
      },
      {
        name: "Commercial License",
        detail:
          "Rights to use all visuals across digital platforms, booking systems, websites, print, and promotional materials.",
      },
    ],
  },
  {
    id: "muse",
    name: "AVERRA Muse",
    subtitle: "Luxury Brand Transformation",
    price: "$500",
    salePrice: "$400",
    priceNum: 400,
    originalPriceNum: 500,
    description: "For The CEO Ready to\nOwn The Market.",
    features: [
      {
        name: "30 Custom AI Company Models",
        detail:
          "Thirty high-level, custom-built AI company models designed to support the full scope of a growing business. These visuals are created to carry service marketing, retail promotions, seasonal campaigns, team features, and expansion moments without feeling repetitive or improvised. This becomes a complete visual library not just content for the month, but assets that support the business as it grows.",
      },
      {
        name: "AVERRA Executive Strategy",
        detail:
          "This is a deeper, more comprehensive strategy session focused on aligning the company with its current level and the level it is stepping into next. It centers on pricing confidence, business maturity, market perception, and sustainable growth. As revenue increases and responsibility expands, the company must reflect that evolution. This intensive ensures the visual presence keeps pace with leadership.",
      },
      {
        name: "Advanced Brand Authority Session",
        detail:
          "This session focuses on how the company communicates professionalism, value, and leadership at scale. It addresses the subtle signals that influence how clients perceive pricing, expertise, and standards. This ensures consistency in how the company is seen online, in-person, and across every interaction.",
      },
      {
        name: "Complete AVERRA Company System (Executive Edition)",
        detail:
          "A comprehensive internal company system outlining refined color architecture, company tone, visual hierarchy, and consistency standards. This document becomes the reference point for future hires, marketing decisions, retail growth, and operational scaling. Growth feels smoother when structure is already in place.",
      },
      {
        name: "Team Alignment Strategy Guide",
        detail:
          "For founders managing assistants, stylists, or full teams, this guide ensures alignment across the entire business. It outlines visual standards, communication expectations, and presentation consistency so that everyone reflects the same level of professionalism. As a business grows beyond one person, unity becomes critical. This guide protects integrity while supporting expansion.",
      },
      {
        name: "Commercial License",
        detail:
          "Rights to use all visuals across digital platforms, booking systems, retail packaging, print materials, and marketing campaigns.",
      },
    ],
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
        title: "Scene 1 — The Service Moment",
        detail:
          "A relaxed in-service lash appointment capturing focused application, clean placement, and steady hands at work. A professional behind-the-bed moment that shows care and control.",
      },
      {
        title: "Scene 2 — The Finished Set",
        detail:
          "A close beauty shot highlighting fullness, symmetry, and a flawless lash line. Soft, defined, and made to stand out on the feed.",
      },
      {
        title: "Scene 3 — The Detail Finish",
        detail:
          "A refined close-up showcasing clean isolation, consistent mapping, and smooth density. Designed to spotlight the quality of the set & the professionalism that comes with it.",
      },
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
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
        title: "Scene 1 — The Precision Moment",
        detail:
          "A focused in-service shot capturing mapping, shaping, and hands-on detail. Clean lines and steady technique that show real expertise.",
      },
      {
        title: "Scene 2 — The Sculpted Result",
        detail:
          "A polished brow finish with defined structure, balanced symmetry, and a sharp, refined outline. The kind of result that instantly looks high-level.",
      },
      {
        title: "Scene 3 — The Detail Close-Up",
        detail:
          "A refined beauty shot highlighting clean edges, smooth tint, and precise definition. Designed to spotlight the quality of the work without overstatement.",
      },
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
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
        title: "Scene 1 — The Application Moment",
        detail:
          "A mid-service beauty shot capturing blending, brushwork, and focused technique in progress. A clean, professional image that shows real artistry at work.",
      },
      {
        title: "Scene 2 — The Finished Glam Close-Up",
        detail:
          "A striking final look with smooth skin, defined features, and balanced highlight. Polished, confident, and ready for the camera.",
      },
      {
        title: "Scene 3 — The Beauty Detail",
        detail:
          "A refined close-up highlighting texture, blend, and precision. Designed to spotlight the quality of the work without overstatement.",
      },
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
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
        title: "Scene 1 — The Work Behind the Result",
        detail:
          "A hands-on, behind-the-chair moment capturing clean sectioning, controlled tension, and focused technique in action. The foundation of every seamless blend, sharp cut, and high-gloss finish clients book for.",
      },
      {
        title: "Scene 2 — The Finished Transformation",
        detail:
          "A polished final look with visible shine, smooth movement, and a flawless finish. The kind of hair that photographs beautifully, feels healthy, and makes clients run to the mirror.",
      },
      {
        title: "Scene 3 — The Detail Finish",
        detail:
          "A close-up highlighting technique, clarity, and precision. Designed to spotlight the quality of the work without needing a before-and-after.",
      },
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
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
        title: "Scene 1 — The Precision Process",
        detail:
          "A close manicure moment capturing clean cuticle work, shaping, and hands-on detail. The kind of angle that shows skill, not just polish.",
      },
      {
        title: "Scene 2 — The Elevated Finish",
        detail:
          "A perfectly structured set shown up close with sharp shape, smooth application, and high-gloss shine. Bold enough to stop scrolling and strong enough to support pricing.",
      },
      {
        title: "Scene 3 — The Detail Standard",
        detail:
          "A set shot highlighting symmetry, structure, and consistency. Designed to visually emphasize the level of care behind every appointment.",
      },
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
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
        title: "Scene 1 — The Treatment Moment",
        detail:
          "A calm facial appointment scene that captures the treatment table setup, clean linens, and hands-on care clients expect. Soft lighting and a relaxed client position create the kind of environment that feels professional, safe,",
      },
      {
        title: "Scene 2 — The Healthy Glow",
        detail:
          "A close-up of fresh, glowing skin with natural texture and hydration visible. Perfect for promoting results-focused services like custom facials, acne treatments, brightening services, or skin barrier repair.",
      },
      {
        title: "Scene 3 — The Skin Detail",
        detail:
          "A polished detail shot highlighting smooth texture, even tone, and post-treatment radiance. Ideal for showcasing expertise, precision, and high-standard skincare work.",
      },
    ],
    includes: ["3 AI-generated brand scenes", "Commercial use license for marketing and promotional materials", "Instant download", "No edits or customization"],
    positioning:
      "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.",
  },
];

const membershipTiers = [
  {
    id: "base-membership",
    name: "Base Tier",
    price: "$79/month",
    priceNum: 79,
    features: ["1 Custom AI Model", "3 IG Templates", "1 Client Cam Retouch", "1 Color/Mood Refresh", "Access to private content vault"],
  },
  {
    id: "addon-membership",
    name: "Add-On Tier",
    price: "$149/month",
    priceNum: 149,
    featured: true,
    features: ["Everything in Base Tier", "5 extra visuals/month", "Promo design support", "Custom Canva template drop"],
  },
];

export function ServicesPage() {
  const isMobile = useIsMobile();

  // ✅ UPDATED: your file is in /public as services-hero.png, so use the root URL path
  const heroImage = "/services-hero.png";

  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = (item: {
    id: string;
    name: string;
    priceNum: number;
    originalPriceNum?: number;
    subtitle?: string;
    type: "service" | "digital" | "membership";
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
    <div className="min-h-screen bg-[#DCDACC] text-[#301710]">
      <Navigation />

      <div className="relative -mx-8 mb-0">
        <div
          className="absolute inset-0 bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 30%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#DCDACC]/60 via-[#DCDACC]/70 to-[#DCDACC]" />

        <div className="relative max-w-7xl mx-auto px-8 py-32 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#654331] font-light mb-6">Branding Packages</p>
          <h1 className="text-[clamp(3rem,10vw,6rem)] text-[#301710] mb-8" style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}>
            Compare & Choose
          </h1>
          <p className="text-lg text-[#654331] font-light max-w-2xl mx-auto">Three Tiers. All Custom. Find Yours.</p>
        </div>
      </div>

      <div className="mt-8 mb-32">
        <h3 className="text-3xl text-[#301710]" style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}>
          Not sure which tier?
        </h3>
        <p className="text-base text-[#654331] font-light mt-4">
          Take our 2-minute Brand Quiz to get a personalized recommendation.
        </p>
        <a
          href="/quiz"
          className="inline-block px-12 py-4 bg-[#301710] text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#2d1810] transition-all mt-6"
        >
          Start Brand Quiz
        </a>
      </div>

      <CTAFooter />
    </div>
  );
}
