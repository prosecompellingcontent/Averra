import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useCart } from "@/app/context/CartContext";
import { Navigation } from "@/app/components/Navigation";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useIsMobile } from "@/app/hooks/useIsMobile";

// Product descriptions for checkout
const productDescriptions: Record<string, string> = {
  "The Lash Collection": "Digital brand visuals designed for lash artists ready to present their work with an established brand presence.",
  "AVERRA Essentials": "The foundation package for entrepreneurs who deserve elevated branding with 10 custom AI brand models and strategic guidance.",
  "AVERRA Signature": "For brands ready to raise pricing and presence with 15 custom AI brand models and advanced strategy.",
  "AVERRA Muse": "The executive transformation package with 20 custom AI company models and comprehensive brand strategy.",
  "The Spa Collection": "Refined visuals created for spa owners and estheticians looking to position their brand at a higher level.",
  "The Beauty Studio Collection": "Strategic brand imagery for beauty professionals ready to elevate their visual presence and client perception.",
  "The Hair Studio Collection": "Premium visuals designed for hairstylists building a brand that commands attention and premium pricing.",
  "The Brow & Beauty Collection": "Polished imagery for brow artists and beauty specialists ready to establish credibility and attract ideal clients.",
  "The Nail Studio Collection": "Elegant visuals crafted for nail technicians positioning their work as luxury service, not just polish.",
};

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Prevent memory leaks by checking if component is still mounted
    let isMounted = true;

    if (items.length === 0 && isMounted) {
      navigate('/cart');
    }

    return () => {
      isMounted = false;
    };
  }, [items.length, navigate]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms of Service to continue');
      return;
    }

    setLoading(true);
    setError(null);

    // Use AbortController for fetch timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      // Get the current URL origin for success/cancel URLs
      const origin = window.location.origin;
      
      // Get brand intake data if it exists
      const brandIntakeDataString = sessionStorage.getItem('brandIntakeData');
      const brandIntakeId = sessionStorage.getItem('brandIntakeId');
      
      let brandIntakeData = brandIntakeDataString ? JSON.parse(brandIntakeDataString) : null;
      
      // Add intake ID to brand intake data for database tracking
      if (brandIntakeData && brandIntakeId) {
        brandIntakeData = { ...brandIntakeData, intakeId: brandIntakeId };
      }
      
      // Create Stripe Checkout Session
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            items: items,
            customerInfo: formData,
            successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${origin}/checkout`,
            brandIntakeData: brandIntakeData, // Include brand intake data with intakeId
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('No checkout URL received from server');
      }

      // Store brand intake data if it exists (will be retrieved after payment)
      if (brandIntakeDataString) {
        try {
          localStorage.setItem('pendingBrandIntakeData', brandIntakeDataString);
          sessionStorage.removeItem('brandIntakeData');
          sessionStorage.removeItem('brandIntakeId');
        } catch (storageError) {
          console.error('Failed to store brand intake data:', storageError);
          // Continue anyway - not critical
        }
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Checkout error:', err);
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Please check your connection and try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to start checkout. Please try again.');
      }
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4e4e6] pb-32 md:pb-0 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#b76e79]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#301710]/5 rounded-full blur-3xl"></div>
      
      <Navigation />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className={`uppercase tracking-[0.4em] text-[#b76e79] mb-4 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
            Secure Checkout
          </p>
          <h1 className={`text-[#301710] mb-4 leading-tight ${isMobile ? 'text-4xl' : 'text-6xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            Complete Your Order
          </h1>
          <p className={`text-[#654331] max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-lg'}`} style={{ fontFamily: 'Lora, serif' }}>
            You're one step closer to elevating your brand presence
          </p>
        </div>

        <form onSubmit={handleCheckout} className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Customer Information */}
          <div className="space-y-8">
            <div className="glass-effect border border-white/40 p-8 md:p-10">
              <h2 className={`text-[#301710] mb-8 ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-[#654331] mb-3 uppercase tracking-[0.2em] ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-5 py-4 bg-white/60 border border-[#b76e79]/20 text-[#301710] placeholder-[#654331]/40 focus:border-[#b76e79] focus:bg-white/80 focus:outline-none transition-all ${isMobile ? 'text-sm' : 'text-base'}`}
                    placeholder="Enter your full name"
                    style={{ fontFamily: 'Lora, serif' }}
                  />
                </div>

                <div>
                  <label className={`block text-[#654331] mb-3 uppercase tracking-[0.2em] ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-5 py-4 bg-white/60 border border-[#b76e79]/20 text-[#301710] placeholder-[#654331]/40 focus:border-[#b76e79] focus:bg-white/80 focus:outline-none transition-all ${isMobile ? 'text-sm' : 'text-base'}`}
                    placeholder="your@email.com"
                    style={{ fontFamily: 'Lora, serif' }}
                  />
                </div>

                <div>
                  <label className={`block text-[#654331] mb-3 uppercase tracking-[0.2em] ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-5 py-4 bg-white/60 border border-[#b76e79]/20 text-[#301710] placeholder-[#654331]/40 focus:border-[#b76e79] focus:bg-white/80 focus:outline-none transition-all ${isMobile ? 'text-sm' : 'text-base'}`}
                    placeholder="(555) 555-5555"
                    style={{ fontFamily: 'Lora, serif' }}
                  />
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="glass-effect border border-white/40 p-8 md:p-10">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 flex-shrink-0 border-2 border-[#b76e79]/40 bg-white/60 checked:bg-[#b76e79] checked:border-[#b76e79] focus:outline-none focus:ring-2 focus:ring-[#b76e79]/30 transition-all cursor-pointer appearance-none checked:after:content-['✓'] checked:after:block checked:after:text-white checked:after:text-center checked:after:text-sm checked:after:leading-5"
                />
                <span className={`text-[#301710]/80 leading-relaxed flex-1 ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                  I have read and agree to the{' '}
                  <Link 
                    to="/terms-of-service" 
                    target="_blank"
                    className="text-[#b76e79] underline hover:text-[#301710] transition-colors font-medium"
                  >
                    Terms of Service
                  </Link>
                  , including the Global Privacy Policy, AI Disclosure Statement, and Refund Policy. I acknowledge that all digital products are AI-generated and non-refundable upon purchase.
                </span>
              </label>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            <div className="glass-effect border border-white/40 p-8 md:p-10 sticky top-32">
              <h2 className={`text-[#301710] mb-8 ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
                Order Summary
              </h2>
              
              {/* Items List */}
              <div className="space-y-4 mb-8 pb-8 border-b border-[#b76e79]/20">
                {items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className={`text-[#301710] font-medium mb-1 ${isMobile ? 'text-sm' : 'text-base'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                          {item.name}
                        </p>
                        <p className="text-[#654331]/60 text-xs uppercase tracking-wider mb-2">
                          Digital Product • Instant Download
                        </p>
                      </div>
                      <p className={`text-[#301710] font-medium flex-shrink-0 ${isMobile ? 'text-base' : 'text-lg'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                        ${item.price}
                      </p>
                    </div>
                    <p className={`text-[#654331]/70 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
                      {productDescriptions[item.name] || "Strategic brand visuals designed for beauty professionals ready to elevate their presence."}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mb-8 pb-8 border-b border-[#b76e79]/20">
                <div className="flex justify-between items-baseline mb-2">
                  <span className={`text-[#654331] uppercase tracking-wider ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Subtotal
                  </span>
                  <span className={`text-[#301710] ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                    ${totalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-[#b76e79]/20">
                  <span className={`text-[#301710] font-medium ${isMobile ? 'text-xl' : 'text-2xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
                    Total
                  </span>
                  <span className={`text-[#301710] font-semibold ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontFamily: 'Cormorant, serif', fontWeight: 600 }}>
                    ${totalPrice}
                  </span>
                </div>
              </div>

              {/* Usage Rights */}
              <div className="mb-6 pb-6 border-b border-[#b76e79]/20">
                <h3 className={`text-[#301710] font-medium mb-3 ${isMobile ? 'text-base' : 'text-lg'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                  Usage Rights
                </h3>
                <p className={`text-[#654331]/80 leading-relaxed mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                  Includes a commercial use license for marketing and promotional materials.
                </p>
                <p className={`text-[#654331]/70 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                  Resale, redistribution, or claiming the visuals as original photography is not permitted.
                </p>
              </div>

              {/* What Happens Next */}
              <div className="mb-6 pb-6 border-b border-[#b76e79]/20">
                <h3 className={`text-[#301710] font-medium mb-3 ${isMobile ? 'text-base' : 'text-lg'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                  What Happens Next
                </h3>
                <p className={`text-[#654331]/80 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                  After purchase you will receive an email with an instant download link to access your files.
                </p>
              </div>

              {/* Secure Checkout Info */}
              <div className="mb-8">
                <h3 className={`text-[#301710] font-medium mb-3 ${isMobile ? 'text-base' : 'text-lg'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                  Secure Checkout
                </h3>
                <p className={`text-[#654331]/80 leading-relaxed mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                  Payments are securely processed through Stripe.
                </p>
                <p className={`text-[#654331]/70 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                  Your information is encrypted and never stored on AVERRA servers.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-[#E57373]/10 border border-[#E57373]/30 text-[#E57373] text-sm leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !termsAccepted}
                className={`w-full bg-[#301710] text-[#f4e4e6] uppercase tracking-[0.3em] font-semibold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isMobile 
                    ? 'px-8 py-4 text-xs' 
                    : 'px-12 py-5 text-sm hover:bg-[#b76e79] hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecting to Stripe...
                  </span>
                ) : (
                  'Continue to Payment'
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <p className={`text-[#654331]/60 italic mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                  Secure payment powered by Stripe
                </p>
                <div className="flex items-center justify-center gap-2 text-[#654331]/40 mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs uppercase tracking-wider">Encrypted & Secure</span>
                </div>
                
                {/* Support Line */}
                <div className="pt-4 border-t border-[#b76e79]/20">
                  <p className={`text-[#654331]/70 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ fontFamily: 'Lora, serif' }}>
                    Need help?
                  </p>
                  <a 
                    href="mailto:info@averraaistudio.com" 
                    className={`text-[#b76e79] hover:text-[#301710] transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}
                    style={{ fontFamily: 'Lora, serif' }}
                  >
                    info@averraaistudio.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}