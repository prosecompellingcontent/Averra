import { useEffect, useRef, ReactNode } from 'react';
import { useIsMobile } from '@/app/hooks/useIsMobile';

interface MarqueeScrollProps {
  children: ReactNode;
  duration?: number; // seconds for one complete loop
  disableOnMobile?: boolean; // optional prop to disable on mobile
}

export function MarqueeScroll({ children, duration = 25, disableOnMobile = true }: MarqueeScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Disable animation on mobile for performance (if enabled via prop)
    if (isMobile && disableOnMobile) {
      return;
    }

    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    let position = 0;
    let animationFrameId: number;
    let lastTimestamp = 0;

    // Calculate speed based on content width and desired duration
    const contentWidth = content.offsetWidth;
    // On mobile, use 2x slower speed to reduce CPU load
    const effectiveDuration = isMobile ? duration * 2 : duration;
    const speed = contentWidth / effectiveDuration; // pixels per second

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000; // convert to seconds
      lastTimestamp = timestamp;

      // Move position based on speed and time elapsed
      position -= speed * deltaTime;

      // When we've scrolled past one full set, reset position
      if (Math.abs(position) >= contentWidth) {
        position = 0;
      }

      // Apply the transform
      container.style.transform = `translateX(${position}px)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Pause animation when page is hidden (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      } else {
        // Resume animation when page becomes visible
        lastTimestamp = 0; // Reset timestamp to avoid jumps
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [duration, isMobile, disableOnMobile]);

  return (
    <div ref={containerRef} className="flex whitespace-nowrap">
      <div ref={contentRef}>{children}</div>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}