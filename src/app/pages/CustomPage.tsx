import { Navigation } from "@/app/components/Navigation";

export function CustomPage() {
  return (
    <div className="min-h-screen bg-[#d4c4b0] text-[#3d1e10] pb-32 md:pb-0">
      <Navigation />
      <div className="flex items-center justify-center min-h-screen px-8">
        <div className="text-center space-y-6 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#3d1e10]/60 font-light">
            TAILORED FOR YOU
          </p>
          <h1 className="text-7xl tracking-tight" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            Custom
          </h1>
          <p className="text-sm text-[#3d1e10]/70 leading-relaxed max-w-md mx-auto">
            Custom AI model creation. Visuals built specifically for the client.
          </p>
        </div>
      </div>
    </div>
  );
}