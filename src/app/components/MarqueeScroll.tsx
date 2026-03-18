import { ReactNode } from 'react';

interface MarqueeScrollProps {
  children: ReactNode;
  duration?: number; // seconds for one complete loop
}

export function MarqueeScroll({ children, duration = 30 }: MarqueeScrollProps) {
  return (
    <div className="overflow-hidden hidden md:block">
      <div 
        className="flex whitespace-nowrap animate-marquee"
        style={{
          willChange: 'transform',
        }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}