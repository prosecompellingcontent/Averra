import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/utils/imageHelpers";

// Using actual images from /public folder
const allImages = [
  "/carousel-1.webp",
  "/carousel-2.webp",
  "/carousel-3.webp",
  "/carousel-4.webp",
  "/carousel-5.webp",
  "/carousel-6.webp",
  "/carousel-7.webp",
  "/carousel-8.webp",
];

export function QuickShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Start with first image
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isMobile = useIsMobile();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Handle touch gestures on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next image
        setCurrentIndex((prev) => {
          const next = (prev + 1) % allImages.length;
          console.log('Swiped to next:', next);
          return next;
        });
      } else {
        // Swiped right - previous image
        setCurrentIndex((prev) => {
          const next = (prev - 1 + allImages.length) % allImages.length;
          console.log('Swiped to previous:', next);
          return next;
        });
      }
    }
  };

  // Preload adjacent images for smooth transitions
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (loadedImages.has(index) || imageErrors.has(index)) return;
      
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, index]));
      };
      img.onerror = () => {
        console.error(`Failed to load image ${index}`);
        setImageErrors(prev => new Set([...prev, index]));
      };
      // Use GitHub URL for preloading
      img.src = getImageUrl(allImages[index]);
    };

    // Preload current, next, and previous images
    preloadImage(currentIndex);
    preloadImage((currentIndex + 1) % allImages.length);
    preloadImage((currentIndex - 1 + allImages.length) % allImages.length);
  }, [currentIndex, loadedImages, imageErrors]);

  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgSrc = e.currentTarget.src;
    console.error(`Image ${currentIndex} failed to load from: ${imgSrc}`);
    setImageErrors(prev => new Set([...prev, currentIndex]));
    setIsImageLoading(false);
  };

  // DESKTOP: Full carousel experience with 8 original Figma + 2 new images
  return (
    <section 
      className="relative min-h-screen overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 8 CAROUSEL IMAGES */}
      <div className="absolute inset-0 z-0">
        {allImages.map((image, index) => {
          const isActive = currentIndex === index;
          // On mobile, only render current image and adjacent ones for performance
          const isAdjacent = isMobile && (
            index === (currentIndex + 1) % allImages.length ||
            index === (currentIndex - 1 + allImages.length) % allImages.length
          );
          
          // Skip rendering if mobile and not current/adjacent
          if (isMobile && !isActive && !isAdjacent) {
            return null;
          }
          
          return (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 1 : 0,
              }}
            >
              <ImageWithFallback
                src={image}
                alt={`AI Model ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center', objectFit: 'cover' }}
                loading="eager"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          );
        })}
        {/* Dark overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 z-10" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex items-center justify-center min-h-screen py-32 px-8">
        <div className="text-center max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#BFBBA7] font-light mb-4">
            AI Model Gallery
          </p>
          <h2 className="text-[clamp(2.5rem,8vw,6rem)] text-[#DCDACC] mb-8" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            See The Transformation
          </h2>
          <p className="text-lg text-[#BFBBA7] max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Cormorant, serif' }}>
            You deserve branding that matches your talent. AVERRA creates it.
          </p>

          {/* Carousel Indicators */}
          <div className="flex gap-2 justify-center mt-12">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${index === currentIndex ? 'bg-[#DCDACC] w-12' : 'bg-[#BFBBA7]/40 w-8'}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => {
          setCurrentIndex((prev) => {
            const next = (prev - 1 + allImages.length) % allImages.length;
            console.log(`Previous clicked: ${prev} -> ${next} (total: ${allImages.length})`);
            return next;
          });
        }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 md:p-4 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={() => {
          setCurrentIndex((prev) => {
            const next = (prev + 1) % allImages.length;
            console.log(`Next clicked: ${prev} -> ${next} (total: ${allImages.length})`);
            return next;
          });
        }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 md:p-4 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Debug indicator - shows current index */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white px-3 py-1 rounded text-sm">
        {currentIndex + 1} / {allImages.length}
      </div>
    </section>
  );
}