import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useEnrollment } from "@/app/context/EnrollmentContext";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/utils/supabase/client";
import { AlertCircle, X, Edit } from "lucide-react";

export function MembershipSummaryStep() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enrollmentData, updateEnrollmentData, setCurrentStep } = useEnrollment();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [acknowledgementAccepted, setAcknowledgementAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const membershipDetails = {
    blueprint: {
      name: "Blueprint",
      founderPrice: 30,
      regularPrice: 75,
    },
    "gold-standard": {
      name: "Gold Standard",
      founderPrice: 75,
      regularPrice: 130,
    },
  };

  const membership = membershipDetails[enrollmentData.membershipType];
  const monthlyDues = enrollmentData.isFounderPricing ? membership.founderPrice : membership.regularPrice;
  const processingFee = monthlyDues * 0.03;
  const subtotal = monthlyDues + processingFee;

  const handleComplete = async () => {
    const newErrors: Record<string, string> = {};

    if (!termsAccepted) newErrors.terms = "You must accept the membership terms";
    if (!acknowledgementAccepted) newErrors.acknowledgement = "You must acknowledge the membership agreement";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create user via server endpoint (auto-confirms email)
      const { projectId, publicAnonKey } = await import('/utils/supabase/info');
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/create-user`;

      console.log("Creating user via server endpoint:", serverUrl);

      const createUserResponse = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: enrollmentData.email,
          password: enrollmentData.password,
          fullName: `${enrollmentData.firstName} ${enrollmentData.lastName}`,
          membershipType: enrollmentData.membershipType,
          isFounderPricing: enrollmentData.isFounderPricing,
        }),
      });

      const createUserData = await createUserResponse.json();
      console.log("Server response:", createUserData);

      if (!createUserResponse.ok) {
        console.error("User creation failed:", createUserData);

        // Check if user already exists
        if (createUserData.error?.includes('already registered') ||
            createUserData.error?.includes('already exists')) {
          setErrors({ form: `This email is already registered. Please try logging in instead.` });
        } else {
          setErrors({ form: `Account creation failed: ${createUserData.error || 'Unknown error'}` });
        }
        setIsProcessing(false);
        return;
      }

      if (!createUserData.success) {
        setErrors({ form: "Failed to create account. Please try again." });
        setIsProcessing(false);
        return;
      }

      console.log("User and profile created successfully");

      // Step 2: Auto-login the user
      try {
        await login(enrollmentData.email, enrollmentData.password);
        console.log("Login successful");
      } catch (loginError: any) {
        console.error("Login after signup failed:", loginError);
        setErrors({ form: `Account created but login failed. Please try logging in manually.` });
        setIsProcessing(false);

        // Navigate to login page with message
        setTimeout(() => {
          navigate("/members/login", {
            state: {
              message: "Your account has been created. Please log in with your credentials."
            }
          });
        }, 2000);
        return;
      }

      // Step 3: Navigate to welcome page
      navigate("/members/welcome");
    } catch (error: any) {
      console.error("Enrollment error:", error);
      setErrors({ form: `Enrollment failed: ${error.message || 'Unknown error'}. Please contact support if this continues.` });
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
  };

  return (
    <>
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-[#c9969e]/20 p-10 shadow-2xl">
        <div className="mb-8">
          <h2
            className="text-3xl text-[#251218] mb-3"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Membership Summary
          </h2>
          <p
            className="text-base text-[#251218]/60"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Review your selection and complete your enrollment
          </p>
        </div>

        <div className="space-y-8">
          {/* Membership Selection */}
          <div className="p-6 bg-gradient-to-br from-[#fdf5f7] to-[#fbf0f3] rounded-2xl border border-[#c9969e]/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className="text-2xl text-[#251218]"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    {membership.name}
                  </h3>
                  {enrollmentData.isFounderPricing && (
                    <div className="px-3 py-1 bg-[#c9969e]/20 rounded-full">
                      <span
                        className="text-xs text-[#c9969e]"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                      >
                        FOUNDER
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  {enrollmentData.membershipType === "gold-standard"
                    ? "Complete access to all AVERRA resources and exclusive Gold Standard benefits"
                    : "Essential access to AVERRA's core business transformation resources"}
                </p>
              </div>
              <button
                onClick={() => navigate("/membership-options")}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#c9969e] hover:bg-white/60 rounded-lg transition-colors"
                style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-[#c9969e]/20 to-transparent mb-4"></div>

            {/* Pricing Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#251218]/70" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  Monthly Dues
                </span>
                <div className="text-right">
                  <span className="text-lg text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                    ${monthlyDues.toFixed(2)}
                  </span>
                  {enrollmentData.isFounderPricing && (
                    <div className="text-xs text-[#251218]/40 line-through" style={{ fontFamily: "Lora, serif" }}>
                      ${membership.regularPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#251218]/70" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  Processing Fee (3%)
                </span>
                <span className="text-sm text-[#251218]/70" style={{ fontFamily: "Lora, serif" }}>
                  ${processingFee.toFixed(2)}
                </span>
              </div>

              <div className="h-px bg-gradient-to-r from-[#c9969e]/20 to-transparent"></div>

              <div className="flex items-center justify-between">
                <span className="text-base text-[#251218]" style={{ fontFamily: "Lora, serif", fontWeight: 500 }}>
                  Total Due Today
                </span>
                <span className="text-2xl text-[#c9969e]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div>
            <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
              Promo Code (Optional)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                style={{ fontFamily: "Lora, serif", color: "#251218" }}
              />
              <button className="px-6 py-3 bg-[#251218]/5 hover:bg-[#c9969e]/10 rounded-xl transition-colors">
                <span className="text-sm uppercase tracking-[0.15em]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Apply
                </span>
              </button>
            </div>
          </div>

          {/* Form Error */}
          {errors.form && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600" style={{ fontFamily: "Lora, serif" }}>
                  {errors.form}
                </p>
              </div>
            </div>
          )}

          {/* Legal Terms */}
          <div className="pt-6 border-t border-[#251218]/5 space-y-6">
            <p className="text-base text-[#251218]" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
              Please accept the following terms, complete your purchase, and start building!
            </p>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[#251218]/20 text-[#c9969e] focus:ring-[#c9969e]/30"
                />
                <span className="text-sm text-[#251218]/80" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  I agree to the{" "}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="text-[#c9969e] hover:underline font-medium"
                  >
                    Membership Terms & Conditions
                  </button>
                  . *
                </span>
              </label>
              {errors.terms && (
                <div className="flex items-center gap-1 ml-8">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.terms}</span>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acknowledgementAccepted}
                  onChange={(e) => setAcknowledgementAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[#251218]/20 text-[#c9969e] focus:ring-[#c9969e]/30"
                />
                <div className="text-sm text-[#251218]/80 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  I understand and acknowledge the following:
                  <ul className="mt-2 space-y-2 pl-4">
                    <li>• Monthly dues of ${monthlyDues.toFixed(2)} (plus applicable processing fees and taxes, less applicable discounts) will be auto-debited each month from my selected payment method.</li>
                    <li>• If I choose to cancel in the initial 60 days of my membership, I am required to pay at the time of cancellation any dues that are scheduled to draft within that 60 day period.</li>
                    {enrollmentData.isFounderPricing && (
                      <li>• My founder pricing of ${monthlyDues.toFixed(2)}/month is locked in while my membership remains active. If I cancel and rejoin later, I will be charged the regular rate of ${membership.regularPrice.toFixed(2)}/month.</li>
                    )}
                  </ul>
                </div>
              </label>
              {errors.acknowledgement && (
                <div className="flex items-center gap-1 ml-8">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.acknowledgement}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-6 flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 px-8 py-4 bg-white/60 border border-[#251218]/20 text-[#251218] hover:bg-white/80 transition-all duration-300"
            >
              <span className="text-sm uppercase tracking-[0.2em]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                Back
              </span>
            </button>
            <button
              onClick={handleComplete}
              disabled={isProcessing}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm uppercase tracking-[0.2em]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                {isProcessing ? "Processing..." : "Complete Enrollment"}
              </span>
            </button>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/contact"
              className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Lora, serif" }}
            >
              Need Help?
            </Link>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#251218]/60 backdrop-blur-sm" onClick={() => setShowTermsModal(false)}>
          <div className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-8 border-b border-[#251218]/5 bg-white/95 backdrop-blur-xl">
              <h3 className="text-2xl text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                Membership Terms & Conditions
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#251218]/60" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(80vh-200px)]" style={{ fontFamily: "Lora, serif" }}>
              <div className="prose prose-sm max-w-none text-[#251218]/80 space-y-6">
                <h4 className="text-lg font-semibold text-[#251218]">1. Membership Agreement</h4>
                <p>By enrolling in AVERRA, you agree to maintain an active membership and pay monthly dues as selected during enrollment.</p>

                <h4 className="text-lg font-semibold text-[#251218]">2. Billing & Payment</h4>
                <p>Monthly dues will be automatically charged to your selected payment method on the same day each month. You authorize AVERRA to charge your payment method for all applicable fees.</p>

                <h4 className="text-lg font-semibold text-[#251218]">3. Founder Pricing</h4>
                <p>Founder pricing is a limited-time offer that locks in your monthly rate while your membership remains active. If you cancel and rejoin later, you will be charged at the regular membership rate.</p>

                <h4 className="text-lg font-semibold text-[#251218]">4. Cancellation Policy</h4>
                <p>You may cancel your membership at any time through your account settings. If you cancel within the first 60 days, you are required to pay any dues scheduled to draft within that 60-day period.</p>

                <h4 className="text-lg font-semibold text-[#251218]">5. Access & Content</h4>
                <p>Your membership grants you access to all content and resources designated for your membership tier. All content is proprietary and may not be shared, redistributed, or used commercially without express written permission.</p>

                <h4 className="text-lg font-semibold text-[#251218]">6. Community Conduct</h4>
                <p>All members must adhere to our Community Conduct Policy. Harassment, spam, or inappropriate behavior may result in membership termination without refund.</p>

                <h4 className="text-lg font-semibold text-[#251218]">7. Modifications</h4>
                <p>AVERRA reserves the right to modify these terms at any time. Members will be notified of material changes via email.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 p-6 border-t border-[#251218]/5 bg-white/95 backdrop-blur-xl">
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300"
              >
                <span className="text-sm uppercase tracking-[0.2em]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Accept & Continue
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
