import { Navigation } from "@/app/components/Navigation";
import { Link, useNavigate } from "react-router";
import { Check } from "lucide-react";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { CTAFooter } from '@/app/components/CTAFooter';
import { MarqueeScroll } from '@/app/components/MarqueeScroll';
import { trackAction } from '@/utils/analytics';
import { getImageUrl } from '@/utils/imageHelpers';

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
      { name: "10 Custom AI Brand Models", detail: "High-quality, custom-built AI visuals that give your brand a face and elevated presence. Each model is created to align with your industry niche and strategy." },
      { name: "AVERRA Strategy Session", detail: "A focused session that defines your visual positioning, target audience alignment, and brand tone before production begins." },
      { name: "Brand Presence Guide", detail: "Every image sends a message. This guide breaks down who it attracts, what pricing it supports, and how it changes the way people see your brand. When you look the part, the right clients follow." },
      { name: "AVERRA Visual System Guide", detail: "A clear, easy-to-follow PDF that covers your color palette, overall tone, and styling standards so your brand is consistent." },
      { name: "Commercial License Use", detail: "Rights to use all visuals across social media, websites, booking platforms, and marketing materials." }
    ]
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
      { name: "20 Custom AI Brand Models", detail: "Twenty custom-built AI brand models styled with intention giving your brand range, consistency, and control across every touchpoint." },
      { name: "Advanced AVERRA Strategy Session", detail: "A one-on-one session focused on your pricing, your goals, and how your visuals support them. We'll make sure your content is working toward a stronger social presence and a clearer sense of authority." },
      { name: "Client Loyalty & Expectation Session", detail: "A simple breakdown of how the right visuals attract the right clients and keep them loyal. This session makes sure every visual is intentional and supports your steady growth." },
      { name: "Expanded AVERRA Visual System Guide", detail: "A complete brand guide covering your color palette, tone, and styling standards so your brand stays strong and recognizable." },
      { name: "Client Messaging Alignment Guide", detail: "A straightforward guide to help you communicate consistently across all platforms. The way you communicate to clients shapes who you attract and the standard you're known for. This guide makes sure your communication matches the level you're building toward so your presence and professionalism stay on track." },
      { name: "Commercial License", detail: "Rights to use all visuals across digital platforms, booking systems, websites, print, and promotional materials." }
    ]
  },
  {
    id: "muse",
    name: "AVERRA Muse",
    subtitle: "Luxury Brand Transformation",
    price: "$500",
    salePrice: "$400",
    priceNum: 400,
    originalPriceNum: 500,
    description: "For The CEO Ready to Own The Market.",
    features: [
      { name: "30 Custom AI Company Models", detail: "Thirty custom AI visuals built to cover everything your business needs, from service marketing and retail promos to seasonal campaigns and team features. A full visual library that grows with your business." },
      { name: "AVERRA Executive Strategy", detail: "A strategy session focused on where your business stands today and where it's going next. We'll get clear on your pricing, your direction, and the steps it takes to get there." },
      { name: "Advanced Brand Authority Session", detail: "This session is about how your business communicates professionalism and value at a bigger scale. We'll look at the small details that shape how clients see your pricing, your expertise, and your standards so that your business looks and feels consistent online, in person, and everywhere in between." },
      { name: "Complete AVERRA Company System (Executive Edition)", detail: "A full internal brand system covering your color palette, tone, visual structure, and consistency standards. This becomes the go-to reference for your hiring, marketing, retail growth, and scaling decisions." },
      { name: "Team Alignment Strategy Guide", detail: "For founders managing assistants, stylists, or full teams, this guide keeps everyone on the same page. It covers your visual standards, communication expectations, and presentation so that your whole team reflects the same level of professionalism. As your business grows, unity protects everything you've built." },
      { name: "Commercial License", detail: "Rights to use all visuals across digital platforms, booking systems, retail packaging, print materials, and marketing campaigns." }
    ]
  }
];

const digitalProducts = [
  {
    id: "lash-extension-look",
    name: "The Lash Collection",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description: "Three individual lash-focused visuals featuring clean isolation, full lash lines, soft volume, and a polished finish, this pack highlights the detail and precision behind expert lash work. Ideal for set promos, fill reminders, new announcements, retention or education posts. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      { title: "Scene 1 — The Service Moment", detail: "A relaxed in-service lash appointment capturing focused application, clean placement, and steady hands at work. A professional behind-the-bed moment that shows care and control." },
      { title: "Scene 2 — The Finished Set", detail: "A close beauty shot highlighting fullness, symmetry, and a flawless lash line. Soft, defined, and made to stand out on the feed." },
      { title: "Scene 3 — The Detail Finish", detail: "A refined close-up showcasing clean isolation, consistent mapping, and smooth density. Designed to spotlight the quality of the set & the professionalism that comes with it." }
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
    positioning: "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided."
  },
  {
    id: "brow-services-look",
    name: "The Map Pack",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description: "Three brow visuals perfected for precision. Including clean mapping, crisp shaping, defined arches, and structured finishes, this pack highlights the level of control and detail behind expert brow work. Ideal for brow promos, tint and shape specials, new service launches, or collaborations. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      { title: "Scene 1 — The Precision Moment", detail: "A focused in-service shot capturing mapping, shaping, and hands-on detail. Clean lines and steady technique that show real expertise." },
      { title: "Scene 2 — The Sculpted Result", detail: "A polished brow finish with defined structure, balanced symmetry, and a sharp, refined outline. The kind of result that instantly looks high-level." },
      { title: "Scene 3 — The Detail Close-Up", detail: "A refined beauty shot highlighting clean edges, smooth tint, and precise definition. Designed to spotlight the quality of the work without overstatement." }
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
    positioning: "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided."
  },
  {
    id: "makeup-artistry-look",
    name: "The Base Bundle",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description: "Three elevated visuals designed to make artistry feel visible, polished, and undeniable. Featuring seamless blend, flawless base, clean liner work, soft highlight, and camera-ready finish, this pack captures the level of detail clients expect from a serious MUA. Ideal for brand announcements, glam promos, launches, sales, or showcasing signature looks. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      { title: "Scene 1 — The Application Moment", detail: "A mid-service beauty shot capturing blending, brushwork, and focused technique in progress. A clean, professional image that shows real artistry at work." },
      { title: "Scene 2 — The Finished Glam Close-Up", detail: "A striking final look with smooth skin, defined features, and balanced highlight. Polished, confident, and ready for the camera." },
      { title: "Scene 3 — The Beauty Detail", detail: "A refined close-up highlighting texture, blend, and precision. Designed to spotlight the quality of the work without overstatement." }
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
    positioning: "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided."
  },
  {
    id: "hair-styling-look",
    name: "Fresh Out The Chair",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description: "Three hair-focused visuals created to showcase precision, shine, and that polished finish clients book for. Ideal for launches, specials, promos, seasonal hair campaigns, or transformations. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      { title: "Scene 1 — The Work Behind the Result", detail: "A hands-on, behind-the-chair moment capturing clean sectioning, controlled tension, and focused technique in action. The foundation of every seamless blend, sharp cut, and high-gloss finish clients book for." },
      { title: "Scene 2 — The Finished Transformation", detail: "A polished final look with visible shine, smooth movement, and a flawless finish. The kind of hair that photographs beautifully, feels healthy, and makes clients run to the mirror." },
      { title: "Scene 3 — The Detail Finish", detail: "A close-up highlighting technique, clarity, and precision. Designed to spotlight the quality of the work without needing a before-and-after." }
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
    positioning: "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided."
  },
  {
    id: "nail-services-look",
    name: "The Cuticle Collection",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description: "Three manicure visuals designed to highlight structure, precision, and that flawless finished set clients zoom in on. Featuring clean cuticle work, sharp shaping, smooth structure, and high-gloss shine, this pack makes detail visible at first glance. Ideal for new set promos, seasonal design launches, retention education posts, price increases, or showcasing signature shapes and finishes. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      { title: "Scene 1 — The Precision Process", detail: "A close manicure moment capturing clean cuticle work, shaping, and hands-on detail. The kind of angle that shows skill, not just polish." },
      { title: "Scene 2 — The Elevated Finish", detail: "A perfectly structured set shown up close with sharp shape, smooth application, and high-gloss shine. Bold enough to stop scrolling and strong enough to support pricing." },
      { title: "Scene 3 — The Detail Standard", detail: "A set shot highlighting symmetry, structure, and consistency. Designed to visually emphasize the level of care behind every appointment." }
    ],
    includes: ["3 high-resolution AI-generated scenes", "Commercial use license", "Instant download", "No edits or customization"],
    positioning: "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided."
  },
  {
    id: "esthetics-skincare-look",
    name: "You Glow Girl Bundle",
    price: "$30",
    priceNum: 30,
    originalPrice: "$50",
    originalPriceNum: 50,
    description: "Three esthetic visuals designed to make promotions look polished and professional from the first glance. Ideal for facial specials, new treatment launches, membership promotions, or skincare product features. Built to use immediately across socials, booking platforms, and promotional graphics.",
    scenes: [
      { title: "Scene 1 — The Treatment Moment", detail: "A calm facial appointment scene that captures the treatment table setup, clean linens, and hands-on care clients expect. Soft lighting and a relaxed client position create the kind of environment that feels professional and safe." },
      { title: "Scene 2 — The Healthy Glow", detail: "A close-up of fresh, glowing skin with natural texture and hydration visible. Perfect for promoting results-focused services like custom facials, acne treatments, brightening services, or skin barrier repair." },
      { title: "Scene 3 — The Skin Detail", detail: "A polished detail shot highlighting smooth texture, even tone, and post-treatment radiance. Ideal for showcasing expertise, precision, and high-standard skincare work." }
    ],
    includes: ["3 AI-generated brand scenes", "Commercial use license for marketing and promotional materials", "Instant download", "No edits or customization"],
    positioning: "All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided."
  }
];

export function ServicesPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = (item: { id: string; name: string; priceNum: number; originalPriceNum?: number; subtitle?: string; type: 'service' | 'digital'; description?: string }) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.priceNum,
      originalPrice: item.originalPriceNum,
      type: item.type,
      description: item.subtitle || item.description
    });
    trackAction('Add to Cart', { item: item.name, type: item.type });
  };

  return (
    <>
      <div className="min-h-screen bg-[#DCDACC] text-[#221412] pb-32 md:pb-0">
        <Navigation />
        
        {/* Hero Section - Using proper pattern */}
        <section className="relative w-full overflow-hidden min-h-svh">
          {/* Background image as a pinned rectangle */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${getImageUrl('/services-hero.png')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-[#DCDACC]/40" />
          
          <div className="relative z-10 min-h-svh flex items-center justify-center px-8 py-16">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#221412]/60 font-light mb-6">
                Branding Packages
              </p>
              <h1 className="text-[clamp(2.5rem,8vw,6rem)] text-[#221412] mb-8" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                Compare & Choose
              </h1>
              <p className="text-lg text-[#221412]/70 font-light max-w-2xl mx-auto">
                Three Tiers. All Custom. Find Yours.
              </p>
            </div>
          </div>
        </section>

        <div className="mb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#221412]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% via-[#221412]/50 via-85% to-[#DCDACC] to-100%"></div>
          
          <div className="relative py-16 text-center">
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#BFBBA7]/30"></div>
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#BFBBA7]/30"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-[#BFBBA7]/20"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#BFBBA7]/20"></div>
            
            {/* Moving Marquee Banner */}
            <div className="mb-8 border-y border-[#C9A961]/30 py-4">
              <MarqueeScroll disableOnMobile={false} duration={30}>
                <div className="flex items-center gap-8 text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light whitespace-nowrap">
                  <span>LAUNCH PRICING · March 3rd–May 31st</span>
                  <span>•</span>
                  <span>FOUNDING MEMBERS ONLY</span>
                  <span>•</span>
                  <span>UP TO 50% OFF</span>
                  <span>•</span>
                  <span>LAUNCH PRICING · March 3rd–May 31st</span>
                  <span>•</span>
                  <span>FOUNDING MEMBERS ONLY</span>
                  <span>•</span>
                  <span>UP TO 50% OFF</span>
                  <span>•</span>
                </div>
              </MarqueeScroll>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-8">
              <div className="inline-block px-28 py-3 border-2 mb-6 relative overflow-hidden animate-pulse-subtle"
                style={{
                  borderImage: 'linear-gradient(135deg, #C9A961 0%, #F4E4BE 25%, #E6D299 50%, #C9A961 75%, #B8974F 100%) 1',
                  background: 'transparent'
                }}>
                <span className="text-sm md:text-base uppercase tracking-[0.4em] font-light"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #C9A961 0%, #F4E4BE 50%, #C9A961 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Exclusive Offer</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl text-[#DCDACC] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300, letterSpacing: '0.02em' }}>
                Founding Members
              </h3>
              
              <div className="inline-block px-8 py-2 bg-[#DCDACC] mb-6">
                <span className="text-sm md:text-base text-[#221412] font-medium uppercase tracking-[0.2em]">Limited Time Only</span>
              </div>
              
              <p className="text-base md:text-lg text-[#DCDACC] font-light leading-relaxed max-w-2xl mx-auto">
                Early access never looked this good.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="space-y-12 mb-32">
            {tiers.map((tier, tierIndex) => (
              <div
                key={tier.name}
                className={`${
                  tier.featured ? 'bg-white border-2 border-[#221412]' : 'bg-white/60'
                } p-12`}
                style={{
                  boxShadow: tier.featured 
                    ? '12px 12px 0px 0px rgba(34, 20, 18, 0.85), 24px 24px 0px 0px rgba(34, 20, 18, 0.5)' 
                    : '-2px -2px 0px 0px rgba(34, 20, 18, 0.4), 8px 8px 0px 0px rgba(34, 20, 18, 0.8), 16px 16px 0px 0px rgba(34, 20, 18, 0.4)',
                  position: 'relative'
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1 space-y-8">
                    {tier.featured && (
                      <div className="inline-block px-4 py-1 bg-[#221412] text-[#DCDACC] text-[9px] uppercase tracking-[0.3em] font-light mb-4">
                        Most Popular
                      </div>
                    )}
                    <div>
                      <h2 className="text-3xl text-[#221412] mb-2" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                        {tier.name}
                      </h2>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#221412]/60 mb-4">
                        {tier.subtitle}
                      </p>
                      <p className="text-base text-[#221412]/70 font-light italic mb-6 whitespace-pre-line" style={{ fontFamily: 'Cormorant, serif' }}>
                        {tier.description}
                      </p>
                      <div className="mb-3">
                        <span className="text-2xl text-[#221412]/40 line-through mr-3" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                          {tier.price}
                        </span>
                        <span className="text-4xl text-[#221412]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                          {tier.salePrice}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        sessionStorage.setItem('selectedServiceTier', JSON.stringify({
                          id: tier.id,
                          name: tier.name,
                          priceNum: tier.priceNum,
                          originalPriceNum: tier.originalPriceNum,
                          subtitle: tier.subtitle,
                          type: 'service',
                          description: tier.description
                        }));
                        navigate('/brand-intake');
                      }}
                      className={`inline-block w-full py-4 bg-[#221412] text-white text-center text-sm uppercase tracking-[0.3em] font-light ${!isMobile ? 'hover:bg-[#3d2b26]' : ''} transition-all cursor-pointer`}
                    >
                      Get Started
                    </button>
                  </div>

                  <div className="lg:col-span-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#221412]/60 mb-8">
                      What's Included
                    </p>
                    <div className="grid grid-cols-1 gap-y-1">
                      {tier.features.map((feature, index) => (
                        <div 
                          key={index} 
                          className="flex gap-4 mb-3"
                        >
                          <Check className="w-5 h-5 text-[#221412] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div>
                            <p className="text-base text-[#221412] mb-0.5">
                              {feature.name}
                            </p>
                            <p className="text-sm text-[#221412]/70 font-light leading-tight">
                              {feature.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-32">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#221412]/60 font-light mb-6">
                AVERRA Digital Products
              </p>
              <h2 className="text-[clamp(2.5rem,8vw,4rem)] text-[#221412] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                Brand-Ready Visuals
              </h2>
              <p className="text-base text-[#221412]/70 font-light max-w-2xl mx-auto mb-2">
                Instant access. No revisions. Ready to use.
              </p>
              
              <div className={`mt-8 mb-8 max-w-3xl mx-auto px-8 py-5 relative ${isMobile ? 'bg-[#DCDACC]/60' : 'glass-effect-light'}`}>
                <div className="absolute left-0 top-0 bottom-0 w-px bg-[#221412]/30"></div>
                <div className="absolute right-0 top-0 bottom-0 w-px bg-[#221412]/30"></div>
                <p className="text-xs text-[#221412]/70 font-light leading-relaxed italic" style={{ fontFamily: 'Cormorant, serif' }}>
                  All visuals are AI-generated brand imagery created for marketing and promotional use. These images are intended to elevate brand presentation and should not be used to misrepresent real client results or services not legally provided.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalProducts.map((product) => (
                <div key={product.name} className="bg-white/60 p-8 hover:bg-white transition-all">
                  <h3 className="text-xl text-[#221412] mb-3" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-lg text-[#221412]/40 line-through" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                      {product.originalPrice}
                    </span>
                    <span className="text-3xl text-[#221412]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                      {product.price}
                    </span>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-[#221412]/70 font-light mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="mb-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#221412]/60 mb-3">Inside This Pack:</p>
                    {product.scenes?.map((scene, idx) => (
                      <div key={idx} className="mb-3">
                        <p className="text-xs text-[#221412] font-medium mb-1">{scene.title}</p>
                        <p className="text-xs text-[#221412]/70 font-light leading-relaxed">{scene.detail}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-4 space-y-1">
                    {product.includes?.map((item, idx) => (
                      <p key={idx} className="text-xs text-[#221412]/70 font-light">• {item}</p>
                    ))}
                  </div>
                  
                  <p className="text-xs text-[#221412]/70 italic mb-6 leading-relaxed" style={{ fontFamily: 'Cormorant, serif' }}>
                    {product.positioning}
                  </p>
                  
                  <button
                    onClick={() => handleAddToCart({ id: product.id, name: product.name, priceNum: product.priceNum, originalPriceNum: product.originalPriceNum, type: 'digital' })}
                    className="inline-block w-full py-3 bg-[#221412] text-[#DCDACC] text-center text-sm uppercase tracking-[0.3em] font-light hover:bg-[#3d2b26] transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-12 relative overflow-hidden -mx-8">
              <div className="absolute inset-0 bg-[#221412]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#DCDACC] from-0% via-[#221412]/30 via-10% to-transparent to-25%"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% via-[#221412]/50 via-85% to-[#DCDACC] to-100%"></div>
              
              <div className="relative py-16 text-center">
                <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#DCDACC]/30"></div>
                <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#DCDACC]/30"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-[#DCDACC]/20"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#DCDACC]/20"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-8">
                  <div className="inline-block px-28 py-3 border-2 mb-6 relative overflow-hidden animate-pulse-subtle"
                    style={{
                      borderImage: 'linear-gradient(135deg, #C9A961 0%, #F4E4BE 25%, #E6D299 50%, #C9A961 75%, #B8974F 100%) 1',
                      background: 'transparent'
                    }}>
                    <span className="text-sm md:text-base uppercase tracking-[0.4em] font-light"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #C9A961 0%, #F4E4BE 50%, #C9A961 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>Limited Time Bundle</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl text-[#DCDACC] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300, letterSpacing: '0.02em' }}>
                    Launch Bundle: All 6 Beauty Service Packs
                  </h3>
                  
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <span className="text-2xl md:text-4xl text-[#DCDACC]/40 line-through" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>$300</span>
                    <span className="text-4xl md:text-6xl text-[#DCDACC]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>$180</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart({ id: 'bundle-all-digital', name: 'Launch Bundle: All 6 Beauty Service Packs', priceNum: 180, originalPriceNum: 300, type: 'digital' })}
                    className="inline-block px-12 py-4 bg-[#DCDACC] text-[#221412] text-sm uppercase tracking-[0.3em] font-medium hover:bg-white transition-all"
                  >
                    Add Bundle to Cart
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <p className="text-xs text-[#221412]/70 font-light">
                All digital products include commercial use rights • Files delivered instantly after purchase • No edits, swaps, or personalization included
              </p>
              
              <div className="mt-8 mb-32">
                <h3 className="text-3xl text-[#221412]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                  Not sure which tier?
                </h3>
                <p className="text-base text-[#221412]/70 font-light mt-4">
                  Take our 2-minute Brand Quiz to get a personalized recommendation.
                </p>
                <Link
                  to="/quiz"
                  className="inline-block px-12 py-4 bg-[#221412] text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#3d2b26] transition-all mt-6"
                >
                  Start Brand Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
        <CTAFooter />
      </div>
    </>
  );
}