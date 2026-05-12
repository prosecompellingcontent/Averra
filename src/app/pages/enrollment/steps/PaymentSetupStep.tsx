import { useState } from "react";
import { useEnrollment } from "@/app/context/EnrollmentContext";
import { AlertCircle, CreditCard, Building2 } from "lucide-react";
import { Link } from "react-router";

export function PaymentSetupStep() {
  const { enrollmentData, updateEnrollmentData, setCurrentStep } = useEnrollment();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!enrollmentData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!enrollmentData.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";
    if (!enrollmentData.expiration.trim()) newErrors.expiration = "Expiration date is required";
    if (!enrollmentData.cvc.trim()) newErrors.cvc = "CVC is required";

    if (enrollmentData.recurringPaymentMethod === "bank") {
      if (!enrollmentData.bankAccountType) newErrors.bankAccountType = "Account type is required";
      if (!enrollmentData.bankRoutingNumber?.trim()) newErrors.bankRoutingNumber = "Routing number is required";
      if (!enrollmentData.bankAccountNumber?.trim()) newErrors.bankAccountNumber = "Account number is required";
      if (enrollmentData.bankAccountNumber !== enrollmentData.bankConfirmAccountNumber) {
        newErrors.bankConfirmAccountNumber = "Account numbers do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep()) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-[#c9969e]/20 p-10 shadow-2xl">
      <div className="mb-8">
        <h2
          className="text-3xl text-[#251218] mb-3"
          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
        >
          Payment Setup
        </h2>
        <p
          className="text-base text-[#251218]/60"
          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
        >
          Secure payment information
        </p>
      </div>

      <div className="space-y-8">
        {/* Credit Card Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-[#c9969e]" />
            <h3
              className="text-lg text-[#251218]"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              Credit Card
            </h3>
          </div>

          <div>
            <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
              Card Number *
            </label>
            <input
              type="text"
              value={enrollmentData.cardNumber}
              onChange={(e) => updateEnrollmentData({ cardNumber: e.target.value })}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.cardNumber ? "border-red-400 focus:border-red-500" : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            />
            {errors.cardNumber && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.cardNumber}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
              Name on Card *
            </label>
            <input
              type="text"
              value={enrollmentData.nameOnCard}
              onChange={(e) => updateEnrollmentData({ nameOnCard: e.target.value })}
              placeholder="Cardholder Name"
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.nameOnCard ? "border-red-400 focus:border-red-500" : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            />
            {errors.nameOnCard && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.nameOnCard}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                Expiration *
              </label>
              <input
                type="text"
                value={enrollmentData.expiration}
                onChange={(e) => updateEnrollmentData({ expiration: e.target.value })}
                placeholder="MM/YYYY"
                maxLength={7}
                className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                  errors.expiration ? "border-red-400 focus:border-red-500" : "border-[#251218]/10 focus:border-[#c9969e]/30"
                }`}
                style={{ fontFamily: "Lora, serif" }}
              />
              {errors.expiration && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.expiration}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                CVC *
              </label>
              <input
                type="text"
                value={enrollmentData.cvc}
                onChange={(e) => updateEnrollmentData({ cvc: e.target.value })}
                placeholder="123"
                maxLength={4}
                className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                  errors.cvc ? "border-red-400 focus:border-red-500" : "border-[#251218]/10 focus:border-[#c9969e]/30"
                }`}
                style={{ fontFamily: "Lora, serif" }}
              />
              {errors.cvc && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.cvc}</span>
                </div>
              )}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={enrollmentData.billingAddressSameAsHome}
              onChange={(e) => updateEnrollmentData({ billingAddressSameAsHome: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-[#251218]/20 text-[#c9969e] focus:ring-[#c9969e]/30"
            />
            <span className="text-sm text-[#251218]/70" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
              Billing Address Is The Same As Home Address
            </span>
          </label>
        </div>

        {/* Recurring Payment Method */}
        <div className="pt-6 border-t border-[#251218]/5">
          <h3
            className="text-lg text-[#251218] mb-4"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Recurring Monthly Dues: Select Payment Method
          </h3>

          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 cursor-pointer group p-4 bg-white/40 border border-[#251218]/10 rounded-xl hover:border-[#c9969e]/30 transition-all">
              <input
                type="radio"
                name="recurringPayment"
                checked={enrollmentData.recurringPaymentMethod === "bank"}
                onChange={() => updateEnrollmentData({ recurringPaymentMethod: "bank" })}
                className="mt-1 w-5 h-5 text-[#c9969e] focus:ring-[#c9969e]/30"
              />
              <span className="text-sm text-[#251218]/80" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                Charge This Card Today & Use My Bank Account For Recurring Payments
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group p-4 bg-white/40 border border-[#251218]/10 rounded-xl hover:border-[#c9969e]/30 transition-all">
              <input
                type="radio"
                name="recurringPayment"
                checked={enrollmentData.recurringPaymentMethod === "card"}
                onChange={() => updateEnrollmentData({ recurringPaymentMethod: "card" })}
                className="mt-1 w-5 h-5 text-[#c9969e] focus:ring-[#c9969e]/30"
              />
              <span className="text-sm text-[#251218]/80" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                Charge This Card Today & For All Recurring Payments
              </span>
            </label>
          </div>

          {/* Bank Account Fields */}
          {enrollmentData.recurringPaymentMethod === "bank" && (
            <div className="space-y-6 p-6 bg-gradient-to-br from-[#fdf5f7] to-[#fbf0f3] rounded-2xl border border-[#c9969e]/10">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-[#c9969e]" />
                <h4
                  className="text-base text-[#251218]"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Bank Account Information
                </h4>
              </div>

              <div>
                <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                  Account Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-white/60 border border-[#251218]/10 rounded-lg hover:border-[#c9969e]/30 transition-all">
                    <input
                      type="radio"
                      name="bankAccountType"
                      value="checking"
                      checked={enrollmentData.bankAccountType === "checking"}
                      onChange={(e) => updateEnrollmentData({ bankAccountType: "checking" })}
                      className="w-4 h-4 text-[#c9969e] focus:ring-[#c9969e]/30"
                    />
                    <span className="text-sm" style={{ fontFamily: "Lora, serif" }}>Checking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-white/60 border border-[#251218]/10 rounded-lg hover:border-[#c9969e]/30 transition-all">
                    <input
                      type="radio"
                      name="bankAccountType"
                      value="savings"
                      checked={enrollmentData.bankAccountType === "savings"}
                      onChange={(e) => updateEnrollmentData({ bankAccountType: "savings" })}
                      className="w-4 h-4 text-[#c9969e] focus:ring-[#c9969e]/30"
                    />
                    <span className="text-sm" style={{ fontFamily: "Lora, serif" }}>Savings</span>
                  </label>
                </div>
                {errors.bankAccountType && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.bankAccountType}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                  Bank Routing Number *
                </label>
                <input
                  type="text"
                  value={enrollmentData.bankRoutingNumber || ""}
                  onChange={(e) => updateEnrollmentData({ bankRoutingNumber: e.target.value })}
                  placeholder="123456789"
                  maxLength={9}
                  className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                    errors.bankRoutingNumber ? "border-red-400 focus:border-red-500" : "border-[#251218]/10 focus:border-[#c9969e]/30"
                  }`}
                  style={{ fontFamily: "Lora, serif" }}
                />
                {errors.bankRoutingNumber && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.bankRoutingNumber}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={enrollmentData.bankAccountNumber || ""}
                    onChange={(e) => updateEnrollmentData({ bankAccountNumber: e.target.value })}
                    className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                      errors.bankAccountNumber ? "border-red-400 focus:border-red-500" : "border-[#251218]/10 focus:border-[#c9969e]/30"
                    }`}
                    style={{ fontFamily: "Lora, serif" }}
                  />
                  {errors.bankAccountNumber && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.bankAccountNumber}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#251218]/70 mb-2" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                    Confirm Account Number *
                  </label>
                  <input
                    type="text"
                    value={enrollmentData.bankConfirmAccountNumber || ""}
                    onChange={(e) => updateEnrollmentData({ bankConfirmAccountNumber: e.target.value })}
                    className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                      errors.bankConfirmAccountNumber ? "border-red-400 focus:border-red-500" : "border-[#251218]/10 focus:border-[#c9969e]/30"
                    }`}
                    style={{ fontFamily: "Lora, serif" }}
                  />
                  {errors.bankConfirmAccountNumber && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>{errors.bankConfirmAccountNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
            onClick={handleContinue}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300"
          >
            <span className="text-sm uppercase tracking-[0.2em]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              Review & Complete
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
  );
}
