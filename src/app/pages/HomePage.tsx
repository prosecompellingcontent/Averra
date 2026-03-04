// src/app/components/QuickShowcase.tsx
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";

// UPDATED: use Vite-bundled URLs from src/public (no helper file)
const allImages = [
  new URL("../../../public/carousel-1.webp", import.meta.url).toString(),
  new URL("../../../public/carousel-2.webp", import.meta.url).toString(),
  new URL("../../../public/carousel-3.webp", import.meta.url).toString(),
  new URL("../../../public/carousel-4.webp", import.meta.url).toString(),
  new URL("../../../public/carousel-5.webp", import.meta.url).toString(),
  new URL("../../../public/carousel-6.webp", import.meta.url).toString(),
  new URL("../../../public/carousel-7.webp", import.meta.url).toString(),
  new URL("../../../public/carousel-8.webp", import.meta.url).toString(),
];

export function QuickShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isMobile = useIsMobile();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
        setCurrentIndex((prev) => {
          const next = (prev + 1) % allImages.length;
          console.log("Swiped to next:", next);
          return next;
        });
      } else {
        setCurrentIndex((prev) => {
          const next = (prev - 1 + allImages.length) % allImages.length;
          console.log("Swiped to previous:", next);
          return next;
        });
      }
    }
  };

  useEffect(() => {
    const preloadImage = (index: number) => {
      if (loadedImages.has(index) || imageErrors.has(index)) return;

      const img = new Image();
      img.onload = () => setLoadedImages((prev) => new Set([...prev, index]));
      img.onerror = () => {
        console.error(`Failed to load image ${index}`);
        setImageErrors((prev) => new Set([...prev, index]));
      };
      img.src = allImages[index];
    };

    preloadImage(currentIndex);
    preloadImage((currentIndex + 1) % allImages.length);
    preloadImage((currentIndex - 1 + allImages.length) % allImages.length);
  }, [currentIndex, loadedImages, imageErrors]);

  const handleImageLoad = () => setIsImageLoading(false);

  const handleImageError = () => {
    console.error(`Image ${currentIndex} failed to load`);
    setImageErrors((prev) => new Set([...prev, currentIndex]));
    setIsImageLoading(false);
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 z-0">
        {allImages.map((image, index) => {
          const isActive = currentIndex === index;
          const isAdjacent =
            isMobile &&
            (index === (currentIndex + 1) % allImages.length ||
              index === (currentIndex - 1 + allImages.length) % allImages.length);

          if (isMobile && !isActive && !isAdjacent) return null;

          const isSecondToLast = index === allImages.length - 2;
          const isLast = index === allImages.length - 1;

          return (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 1 : 0 }}
            >
              <img
                src={image}
                alt={`AI Model ${index + 1}`}
                className="w-full h-full object-cover"
                style={isSecondToLast || isLast ? { objectPosition: "center 35%" } : undefined}
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={isActive ? handleImageLoad : undefined}
                onError={isActive ? handleImageError : undefined}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 z-10" />
      </div>

      <div className="relative z-20 flex items-center justify-center min-h-screen py-32 px-8">
        <div className="text-center max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#BFBBA7] font-light mb-4">AI Model Gallery</p>
          <h2 className="text-[clamp(2.5rem,8vw,6rem)] text-[#DCDACC] mb-8" style={{ fontFamily: "Cormorant, serif", fontWeight: 300 }}>
            See The Transformation
          </h2>
          <p className="text-lg text-[#BFBBA7] max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "Cormorant, serif" }}>
            You deserve branding that matches your talent. AVERRA creates it.
          </p>

          <div className="flex gap-2 justify-center mt-12">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex ? "bg-[#DCDACC] w-12" : "bg-[#BFBBA7]/40 w-8"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 md:p-4 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % allImages.length)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 md:p-4 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white px-3 py-1 rounded text-sm">
        {currentIndex + 1} / {allImages.length}
      </div>
    </section>
  );
}
