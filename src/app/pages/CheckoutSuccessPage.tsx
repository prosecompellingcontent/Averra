import { Link, useSearchParams } from "react-router";
import { Navigation } from "@/app/components/Navigation";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();

    // Clear any pending brand intake data
    localStorage.removeItem('pendingBrandIntakeData');
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#301710] pb-32 md:pb-0">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[#DCDACC]/10 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-[#DCDACC]" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl text-[#DCDACC] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
          Payment Successful
        </h1>

        <p className="text-xl text-[#DCDACC]/80 mb-4" style={{ fontFamily: 'Cormorant, serif' }}>
          Thank you for your purchase!
        </p>

        <p className="text-[#BFBBA7] mb-12 max-w-xl mx-auto">
          Your order has been confirmed and we'll be in touch shortly to begin your branding journey. 
          Check your email for order details and next steps.
        </p>

        {sessionId && (
          <p className="text-[#BFBBA7]/60 text-sm mb-8">
            Session ID: {sessionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-[#DCDACC] text-[#301710] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#BFBBA7] transition-all"
          >
            Return Home
          </Link>
          <Link
            to="/services"
            className="inline-block px-8 py-4 border border-[#DCDACC]/40 text-[#DCDACC] text-sm uppercase tracking-[0.3em] font-light hover:bg-[#DCDACC]/10 transition-all"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}