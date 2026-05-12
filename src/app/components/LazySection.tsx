import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * PERFORMANCE OPTIMIZATION: Progressive section loading
 * Only renders children when section enters viewport
 * Invisible optimization - no visual changes
 */
export function LazySection({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '200px' // Start loading before visible
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Once loaded, stop observing
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <div style={{ minHeight: '200px' }} />}
    </div>
  );
}
