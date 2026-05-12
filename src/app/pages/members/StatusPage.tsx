import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { AlertCircle, CreditCard, X, Mail } from "lucide-react";

export function StatusPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { message?: string; type?: string };

  const isEmailConfirmation = state?.type === "email-confirmation";
  const isPastDue = user?.subscriptionStatus === "past_due";
  const isExpired = user?.subscriptionStatus === "expired";
  const isCanceled = user?.subscriptionStatus === "canceled";

  const handleUpdatePayment = () => {
    // TODO: Open Stripe Customer Portal
    console.log("Opening Stripe Customer Portal...");
    window.open("https://billing.stripe.com/p/login/test_xxx", "_blank");
  };

  const handleCancelMembership = () => {
    if (
      confirm(
        "Are you sure you want to cancel your membership? You'll lose access to all member benefits."
      )
    ) {
      // TODO: Call API to cancel subscription
      console.log("Canceling membership...");
      signOut();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-[#c9969e]/30 shadow-xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#c9969e]/10 flex items-center justify-center">
              {isEmailConfirmation ? (
                <Mail className="w-10 h-10 text-[#c9969e]" />
              ) : (
                <AlertCircle className="w-10 h-10 text-[#c9969e]" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-10">
            <h1
              className="text-3xl text-[#251218] mb-4"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              {isEmailConfirmation && "Check Your Email"}
              {isPastDue && "Payment Update Required"}
              {isExpired && "Membership Expired"}
              {isCanceled && "Membership Canceled"}
            </h1>

            <p
              className="text-lg text-[#251218]/70 leading-relaxed max-w-lg mx-auto"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              {isEmailConfirmation && (state?.message || "Please check your email to confirm your account.")}
              {isPastDue &&
                "Your payment method needs to be updated to continue accessing your membership benefits."}
              {isExpired &&
                "Your membership has expired. Update your payment method to regain access."}
              {isCanceled &&
                "Your membership has been canceled. You can rejoin anytime to continue building beyond the chair."}
            </p>
          </div>

          {/* Membership Details - Only show if not email confirmation */}
          {!isEmailConfirmation && user && (
            <>
              <div className="bg-[#fbf0f3] rounded-lg p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p
                      className="text-[#251218]/60 mb-1"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      Membership Tier
                    </p>
                    <p
                      className="text-[#251218]"
                      style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                    >
                      {user.membershipTier === "gold-standard"
                        ? "Gold Standard"
                        : "Blueprint"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[#251218]/60 mb-1"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      Status
                    </p>
                    <p
                      className="text-[#c9969e]"
                      style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                    >
                      {user.subscriptionStatus.replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[#251218]/60 mb-1"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      Member Since
                    </p>
                    <p
                      className="text-[#251218]"
                      style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                    >
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[#251218]/60 mb-1"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      Email
                    </p>
                    <p
                      className="text-[#251218] truncate"
                      style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {!isCanceled && (
                  <button
                    onClick={handleUpdatePayment}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    <CreditCard className="w-5 h-5" />
                    Update Payment Method
                  </button>
                )}

                {isCanceled ? (
                  <Link
                    to="/ebook"
                    className="block w-full text-center py-4 bg-[#c9969e] text-[#251218] hover:bg-[#251218] hover:text-white transition-all duration-300"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Rejoin AVERRA
                  </Link>
                ) : (
                  <button
                    onClick={handleCancelMembership}
                    className="w-full flex items-center justify-center gap-3 py-4 border border-[#251218]/20 text-[#251218]/70 hover:border-[#251218] hover:text-[#251218] transition-all duration-300"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    <X className="w-5 h-5" />
                    Cancel Membership
                  </button>
                )}
              </div>
            </>
          )}

          {/* Email Confirmation Actions */}
          {isEmailConfirmation && (
            <div className="space-y-3">
              <Link
                to="/members/login"
                className="block w-full text-center py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                }}
              >
                Return to Login
              </Link>
            </div>
          )}

          {/* Support Link */}
          <div className="mt-8 pt-6 border-t border-[#251218]/10 text-center">
            <p
              className="text-sm text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Need help?{" "}
              <Link
                to="/contact"
                className="text-[#c9969e] hover:text-[#251218] transition-colors font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-[#251218]/60 hover:text-[#251218] transition-colors"
            style={{ fontFamily: "Lora, serif" }}
          >
            ← Return to AVERRA Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
