export function HomePage() {
  const isMobile = useIsMobile();
  const heroImage = "public/about-hero.png";
  const [heroImageError, setHeroImageError] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

// Lazy load heavy components - they load AFTER initial render
const QuickShowcase = lazy(() => import("@/app/components/QuickShowcase").then(m => ({ default: m.QuickShowcase })));
const AboutAVERRA = lazy(() => import("@/app/components/AboutAVERRA").then(m => ({ default: m.AboutAVERRA })));
const CTAFooter = lazy(() => import("@/app/components/CTAFooter").then(m => ({ default: m.CTAFooter })));
const ServiceTeaser = lazy(() => import("@/app/components/ServiceTeaser").then(m => ({ default: m.ServiceTeaser })));
const TestimonialStrip = lazy(() => import("@/app/components/TestimonialStrip").then(m => ({ default: m.TestimonialStrip })));
const BenefitsStrip = lazy(() => import("@/app/components/BenefitsStrip").then(m => ({ default: m.BenefitsStrip })));
const HowItWorks = lazy(() => import("@/app/components/HowItWorks").then(m => ({ default: m.HowItWorks })));
const MobileDebug = lazy(() => import("@/app/components/MobileDebug").then(m => ({ default: m.MobileDebug })));

export function HomePage() {
  const isMobile = useIsMobile();
  const [heroImageError, setHeroImageError] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  
  // Memoize handlers to prevent re-creating functions
  const handleImageLoad = useCallback(() => {
    setHeroImageLoaded(true);
  }, []);
  
  const handleImageError = useCallback(() => {
    console.error('Hero image failed to load');
    setHeroImageError(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#221412] text-neutral-100">
      <Navigation />
      
      {/* Hero Section with Image Bleed */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Full Bleed Background Image */}
        <div className="absolute inset-0 bg-[#2d1810]">
          {!heroImageError ? (
            <>
              {!heroImageLoaded && (
                <div className="absolute inset-0 bg-[#2d1810] flex items-center justify-center">
                  <div className="text-white/40 text-sm">Loading...</div>
                </div>
              )}
              <img 
                src={heroImage} 
                alt="Hero background" 
                className="w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={isMobile ? {
                  imageRendering: 'auto',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  willChange: 'auto'
                } : undefined}
              />
              {/* Soft gradient overlay from top to bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/40" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[#2d1810] flex items-center justify-center">
              <div className="text-white/40 text-sm">Image failed to load</div>
            </div>
          )}
        </div>

        {/* AVERRA Background Text - Behind Models - NOW ON MOBILE TOO */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
          <h2 
            className={`whitespace-nowrap text-white/10 select-none ${isMobile ? 'text-[clamp(6rem,14vw,16rem)]' : 'text-[10rem] xl:text-[12rem] 2xl:text-[14rem]'}`}
            style={{ 
              fontFamily: 'Cormorant Garamond, Cormorant, serif', 
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            AVERRA
          </h2>
        </div>

        {/* Hero Text Content - Layered directly on top of AVERRA */}
        <div className={`relative max-w-3xl mx-auto z-10 px-8 ${isMobile ? 'mt-[11rem]' : 'mt-31'}`}>
          <div className={`space-y-2 ${isMobile ? '' : 'mb-6'}`}>
            <p className={`leading-relaxed text-white/95 text-center ${isMobile ? 'text-[clamp(1.75rem,6vw,6rem)]' : 'text-4xl xl:text-5xl 2xl:text-6xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              Beauty's New Blueprint
            </p>
            <p className={`text-white/80 tracking-wide text-center ${isMobile ? 'text-[clamp(1.125rem,2.5vw,2rem)]' : 'text-xl xl:text-2xl'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              Hesitation Is Expensive.
            </p>
          </div>

          <div className={`space-y-4 text-center ${isMobile ? 'mt-8' : ''}`}>
            <Link 
              to="/quiz" 
              className={`inline-block px-12 py-4 bg-[#DCDACC] text-[#301710] uppercase tracking-[0.3em] ${!isMobile ? 'hover:bg-[#BFBBA7] transition-all duration-300' : ''} shadow-2xl`}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.15em' }}
            >
              Start Your Brand Quiz
            </Link>
            
            <p className={`text-white/80 tracking-wide ${isMobile ? 'text-[clamp(1.125rem,2.5vw,2rem)]' : 'text-xl xl:text-2xl'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              No Shoots. No Designers. No Stress.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Showcase Section */}
      <Suspense fallback={<div>Loading...</div>}>
        <QuickShowcase />
      </Suspense>

      {/* Service Teaser */}
      <Suspense fallback={<div>Loading...</div>}>
        <ServiceTeaser />
      </Suspense>

      {/* How It Works - Desktop Only */}
      {!isMobile && <Suspense fallback={<div>Loading...</div>}>
        <HowItWorks />
      </Suspense>}

      {/* Benefits Strip */}
      <Suspense fallback={<div>Loading...</div>}>
        <BenefitsStrip />
      </Suspense>

      {/* About AVERRA */}
      <Suspense fallback={<div>Loading...</div>}>
        <AboutAVERRA />
      </Suspense>

      {/* CTA Footer */}
      <Suspense fallback={<div>Loading...</div>}>
        <CTAFooter />
      </Suspense>

      {/* Mobile Debug */}
      {isMobile && <Suspense fallback={<div>Loading...</div>}>
        <MobileDebug />
      </Suspense>}
    </div>
  );
}
