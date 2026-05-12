import { ReactNode } from 'react';

interface MarqueeScrollProps {
  children: ReactNode;
  duration?: number; // seconds for one complete loop
  disableOnMobile?: boolean;
}

export function MarqueeScroll({ children, duration = 180, disableOnMobile = false }: MarqueeScrollProps) {
  // REMOVED: All mobile detection, multipliers, dynamic recalculations
  // Pure CSS animation - initializes once, never changes
  // @keyframes moved to global CSS to prevent re-creation on every render

  if (disableOnMobile && typeof window !== 'undefined' && window.innerWidth <= 900) {
    return null;
  }

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex whitespace-nowrap w-max"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
      >
        <div className="flex shrink-0 gap-24 md:gap-40 px-12">{children}</div>
        <div className="flex shrink-0 gap-24 md:gap-40 px-12" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}