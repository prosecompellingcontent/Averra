import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useCart } from '@/app/context/CartContext';
import { Navigation } from '@/app/components/Navigation';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
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
      const brandIntakeData = sessionStorage.getItem('brandIntakeData');
      if (brandIntakeData) {
        try {
          localStorage.setItem('pendingBrandIntakeData', brandIntakeData);
          sessionStorage.removeItem('brandIntakeData');
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
    <div className="min-h-screen bg-[#301710]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-5xl md:text-6xl text-[#DCDACC] mb-8" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
          Checkout
        </h1>

        <form onSubmit={handleCheckout} className="max-w-2xl mx-auto">
          <div className="bg-[#3D2117] border border-[#DCDACC]/20 p-8 mb-8">
            <h2 className="text-3xl text-[#DCDACC] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              Customer Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#DCDACC] text-sm uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#301710] border border-[#DCDACC]/20 text-[#DCDACC] focus:border-[#DCDACC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#DCDACC] text-sm uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#301710] border border-[#DCDACC]/20 text-[#DCDACC] focus:border-[#DCDACC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#DCDACC] text-sm uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#301710] border border-[#DCDACC]/20 text-[#DCDACC] focus:border-[#DCDACC] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-[#E57373]/10 border border-[#E57373]/30 text-[#E57373] text-sm">
              {error}
            </div>
          )}

          <div className="bg-[#3D2117] border border-[#DCDACC]/20 p-8 mb-8">
            <h2 className="text-3xl text-[#DCDACC] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-[#DCDACC]">
                  <span className="font-light">{item.name}</span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#DCDACC]/20 pt-4 flex justify-between items-center">
              <span className="text-2xl text-[#DCDACC]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                Total
              </span>
              <span className="text-3xl text-[#DCDACC]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
                ${totalPrice}
              </span>
            </div>
          </div>

          <div className="bg-[#3D2117] border border-[#DCDACC]/20 p-8 mb-8">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 border-2 border-[#DCDACC]/40 bg-[#301710] checked:bg-[#DCDACC] checked:border-[#DCDACC] focus:outline-none focus:ring-2 focus:ring-[#DCDACC]/50 transition-all cursor-pointer appearance-none checked:after:content-['✓'] checked:after:block checked:after:text-[#301710] checked:after:text-center checked:after:text-sm checked:after:leading-5"
              />
              <span className="text-[#DCDACC] text-sm leading-relaxed flex-1">
                I have read and agree to the{' '}
                <Link 
                  to="/terms-of-service" 
                  target="_blank"
                  className="text-[#DCDACC] underline hover:text-[#BFBBA7] transition-colors font-normal"
                >
                  Terms of Service
                </Link>
                , including the Global Privacy Policy, AI Disclosure Statement, and Refund Policy. I acknowledge that all digital products are AI-generated and non-refundable upon purchase.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full px-8 py-4 bg-[#DCDACC] text-[#301710] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#BFBBA7] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecting to Stripe...' : `Continue to Payment`}
          </button>

          <p className="text-center text-[#BFBBA7] text-xs mt-4">
            Secure payment powered by Stripe
          </p>
        </form>
      </div>
    </div>
  );
}