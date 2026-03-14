import { Navigation } from "@/app/components/Navigation";

export function AccessPage() {
  return (
    <div className="min-h-screen bg-[#2d1810] text-neutral-100 pb-32 md:pb-0">
      <Navigation />
      <div className="flex items-center justify-center min-h-screen px-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl tracking-tight" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            Access
          </h1>
          <p className="text-sm text-neutral-400 uppercase tracking-widest">
            Information coming soon
          </p>
        </div>
      </div>
    </div>
  );
}