import { Link, useSearchParams } from "react-router";
import { Navigation } from "@/app/components/Navigation";
import { CheckCircle, Sparkles, Mail, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();

    // Clear any pending brand intake data
    localStorage.removeItem('pendingBrandIntakeData');
    
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100);
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#fdf5f7] pb-32 md:pb-0">
      <Navigation />
      
      <div className={`max-w-5xl mx-auto px-6 pt-32 pb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Decorative Header */}
        <div className="text-center mb-16">
          {/* Icon with animated glow */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#c9969e]/20 blur-2xl animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#b76e79]/20 to-[#301710]/10 border-2 border-[#c9969e]/30 flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="w-16 h-16 text-[#c9969e]" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Elegant title with dividers */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#b76e79]/40 to-[#b76e79]/40"></div>
              <Sparkles className="w-5 h-5 text-[#c9969e]/60" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent via-[#b76e79]/40 to-[#b76e79]/40"></div>
            </div>
            
            <h1 className="text-6xl md:text-7xl text-[#251218] mb-3" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300, fontStyle: 'italic' }}>
              Welcome to AVERRA
            </h1>
            
            <p className="text-xl md:text-2xl text-[#c9969e] tracking-[0.2em] uppercase" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '11px' }}>
              Your Journey Begins Here
            </p>
          </div>

          <p className="text-lg text-[#c9969e]/80 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
            Payment confirmed. Your copy of The Gold Standard is ready. Check your email for instant access.
          </p>
        </div>

        {/* Main Content Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* What Happens Next */}
          <div className="bg-white/60 backdrop-blur-sm border border-[#c9969e]/20 p-8 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9969e]/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#251218]/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#251218]" />
                </div>
                <h2 className="text-2xl text-[#251218]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                  What Happens Next
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#c9969e] flex items-center justify-center text-xs text-[#c9969e]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    1
                  </div>
                  <div>
                    <p className="text-[#251218] font-semibold mb-1" style={{ fontFamily: 'Lora, serif' }}>
                      Check Your Email
                    </p>
                    <p className="text-[#c9969e]/70 text-sm">
                      Your order confirmation and ebook access link are waiting in your inbox.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#c9969e] flex items-center justify-center text-xs text-[#c9969e]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    2
                  </div>
                  <div>
                    <p className="text-[#251218] font-semibold mb-1" style={{ fontFamily: 'Lora, serif' }}>
                      Access Your eBook
                    </p>
                    <p className="text-[#c9969e]/70 text-sm">
                      Read The Gold Standard instantly in your Members Library. Lifetime access included.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#c9969e] flex items-center justify-center text-xs text-[#c9969e]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    3
                  </div>
                  <div>
                    <p className="text-[#251218] font-semibold mb-1" style={{ fontFamily: 'Lora, serif' }}>
                      Start Reading
                    </p>
                    <p className="text-[#c9969e]/70 text-sm">
                      Begin with the Introduction or jump to any chapter. Read at your own pace.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#c9969e] flex items-center justify-center text-xs text-[#c9969e]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    4
                  </div>
                  <div>
                    <p className="text-[#251218] font-semibold mb-1" style={{ fontFamily: 'Lora, serif' }}>
                      Take the Quiz
                    </p>
                    <p className="text-[#c9969e]/70 text-sm">
                      After reading, take the quiz to see where you are now and what to build next.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-white/60 backdrop-blur-sm border border-[#c9969e]/20 p-8 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#c9969e]/5 rounded-full -translate-y-16 -translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#251218]/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#251218]" />
                </div>
                <h2 className="text-2xl text-[#251218]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                  Important Details
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-[#251218]/5 p-4 border-l-3 border-[#c9969e]">
                  <p className="text-[#251218] text-sm font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px' }}>
                    ✓ Payment Confirmed
                  </p>
                  <p className="text-[#c9969e]/70 text-sm">
                    Your transaction has been securely processed.
                  </p>
                </div>

                <div className="bg-[#251218]/5 p-4 border-l-3 border-[#c9969e]">
                  <p className="text-[#251218] text-sm font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px' }}>
                    ✓ Email Sent
                  </p>
                  <p className="text-[#c9969e]/70 text-sm">
                    Order confirmation sent to your email address. Check your spam folder if you don't see it within 5 minutes.
                  </p>
                </div>

                <div className="bg-[#251218]/5 p-4 border-l-3 border-[#c9969e]">
                  <p className="text-[#251218] text-sm font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px' }}>
                    ✓ Customer Support
                  </p>
                  <p className="text-[#c9969e]/70 text-sm">
                    Questions? We're here. Reply to your confirmation email or contact us anytime.
                  </p>
                </div>

                {sessionId && (
                  <div className="pt-4 border-t border-[#301710]/10">
                    <p className="text-[#c9969e]/50 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Order Reference: <span className="font-mono">{sessionId.slice(-12)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="text-center mb-12 py-12 border-y border-[#301710]/10">
          <p className="text-3xl md:text-4xl text-[#251218] max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300, fontStyle: 'italic' }}>
            "Your business should eventually support your life. Not consume all of it."
          </p>
          <p className="text-[#c9969e]/60 text-sm mt-4 uppercase tracking-[0.3em]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
            — The Gold Standard
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
          <Link
            to="/ebook?access=granted"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#251218] text-[#DCDACC] uppercase tracking-[0.3em] hover:bg-[#251218]/90 transition-all shadow-lg hover:shadow-xl"
            style={{ fontFamily: 'Lora, serif', fontWeight: 600, fontSize: '11px' }}
          >
            Read Now
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/ebook?access=granted&autoplay=true"
            className="group inline-flex items-center gap-3 px-10 py-4 border-2 border-[#301710] text-[#251218] uppercase tracking-[0.3em] hover:bg-[#251218] hover:text-[#DCDACC] transition-all"
            style={{ fontFamily: 'Lora, serif', fontWeight: 600, fontSize: '11px' }}
          >
            Listen Aloud
            <span className="group-hover:translate-x-1 transition-transform">♪</span>
          </Link>

          <a
            href="https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/ebooks/the-gold-standard.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-10 py-4 border-2 border-[#c9969e] text-[#c9969e] uppercase tracking-[0.3em] hover:bg-[#c9969e] hover:text-[#DCDACC] transition-all"
            style={{ fontFamily: 'Lora, serif', fontWeight: 600, fontSize: '11px' }}
          >
            Download PDF
            <span className="group-hover:translate-y-1 transition-transform">↓</span>
          </a>
        </div>

        {/* Footer note */}
        <p className="text-center text-[#c9969e]/50 text-xs mt-16 italic" style={{ fontFamily: 'Lora, serif' }}>
          Welcome to building beyond the chair.
        </p>
      </div>
    </div>
  );
}