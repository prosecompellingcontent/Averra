import { Link } from "react-router";

const navigationItems = [
  {
    id: "ready-made",
    label: "Ready Made",
    path: "/ready-made",
    symbol: (
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="w-full h-full">
        {/* Abstract monogram - interconnected circles suggesting "ready" completeness */}
        <circle cx="90" cy="90" r="45" stroke="#301710" strokeWidth="1.5" fill="none" opacity="0.85" />
        <circle cx="90" cy="90" r="30" stroke="#301710" strokeWidth="1" fill="none" opacity="0.7" />
        <circle cx="90" cy="90" r="15" fill="#301710" opacity="0.9" />
        <line x1="90" y1="45" x2="90" y2="135" stroke="#301710" strokeWidth="0.5" opacity="0.4" />
        <line x1="45" y1="90" x2="135" y2="90" stroke="#301710" strokeWidth="0.5" opacity="0.4" />
      </svg>
    )
  },
  {
    id: "custom",
    label: "Custom",
    path: "/custom",
    symbol: (
      <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="w-full h-full">
        {/* Abstract monogram - asymmetric form suggesting customization */}
        <path 
          d="M90 40 L110 70 L140 75 L115 100 L120 130 L90 115 L60 130 L65 100 L40 75 L70 70 Z" 
          stroke="#301710" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.85"
        />
        <path 
          d="M90 60 L100 80 L120 83 L105 98 L108 118 L90 108 L72 118 L75 98 L60 83 L80 80 Z" 
          fill="#654331" 
          opacity="0.6"
        />
        <circle cx="90" cy="90" r="8" fill="#301710" opacity="0.9" />
      </svg>
    )
  }
];

export function VisualNavigationStack() {
  return (
    <section className="relative bg-[#DCDACC] py-40">
      {/* Subtle paper grain texture */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      {/* Soft vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(48, 23, 16, 0.05) 100%)'
        }}
      />

      {/* Navigation Items */}
      <div className="relative max-w-5xl mx-auto px-8">
        <div className="space-y-56">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="group block"
            >
              <div className="flex flex-col items-center justify-center gap-8 transition-all duration-500">
                {/* Symbol */}
                <div className="w-[180px] h-[180px] flex items-center justify-center transition-all duration-500 group-hover:opacity-70">
                  {item.symbol}
                </div>
                
                {/* Label */}
                <div className="flex-shrink-0">
                  <p 
                    className="text-[9px] uppercase tracking-[0.5em] text-[#BFBBA7] font-light transition-all duration-500 group-hover:text-[#654331]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Subtle central axis line */}
      <div 
        className="absolute top-32 bottom-32 left-1/2 w-[1px] bg-[#BFBBA7] opacity-10 pointer-events-none"
        style={{ transform: 'translateX(-0.5px)' }}
      />
    </section>
  );
}