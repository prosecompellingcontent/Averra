import { useState } from "react";
import { useEnrollment } from "@/app/context/EnrollmentContext";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export function AddressInformationStep() {
  const { enrollmentData, updateEnrollmentData, setCurrentStep } = useEnrollment();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!enrollmentData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!enrollmentData.city.trim()) newErrors.city = "City is required";
    if (!enrollmentData.country.trim()) newErrors.country = "Country is required";
    if (!enrollmentData.stateProvince.trim()) newErrors.stateProvince = "State/Province is required";
    if (!enrollmentData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-[#c9969e]/20 p-10 shadow-2xl">
      <div className="mb-8">
        <h2
          className="text-3xl text-[#251218] mb-3"
          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
        >
          Address Information
        </h2>
        <p
          className="text-base text-[#251218]/60"
          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
        >
          Where can we reach you?
        </p>
      </div>

      <div className="space-y-6">
        {/* Address Line 1 */}
        <div>
          <label
            className="block text-sm text-[#251218]/70 mb-2"
            style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
          >
            Address Line 1 *
          </label>
          <input
            type="text"
            value={enrollmentData.addressLine1}
            onChange={(e) => updateEnrollmentData({ addressLine1: e.target.value })}
            placeholder="123 Street Name"
            className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
              errors.addressLine1
                ? "border-red-400 focus:border-red-500"
                : "border-[#251218]/10 focus:border-[#c9969e]/30"
            }`}
            style={{ fontFamily: "Lora, serif", color: "#251218" }}
          />
          {errors.addressLine1 && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                {errors.addressLine1}
              </span>
            </div>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label
            className="block text-sm text-[#251218]/70 mb-2"
            style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
          >
            Address Line 2 <span className="text-[#251218]/40">(Optional)</span>
          </label>
          <input
            type="text"
            value={enrollmentData.addressLine2}
            onChange={(e) => updateEnrollmentData({ addressLine2: e.target.value })}
            placeholder="Apt/Suite/Unit"
            className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
            style={{ fontFamily: "Lora, serif", color: "#251218" }}
          />
        </div>

        {/* City */}
        <div>
          <label
            className="block text-sm text-[#251218]/70 mb-2"
            style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
          >
            City *
          </label>
          <input
            type="text"
            value={enrollmentData.city}
            onChange={(e) => updateEnrollmentData({ city: e.target.value })}
            placeholder="City Name"
            className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
              errors.city
                ? "border-red-400 focus:border-red-500"
                : "border-[#251218]/10 focus:border-[#c9969e]/30"
            }`}
            style={{ fontFamily: "Lora, serif", color: "#251218" }}
          />
          {errors.city && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                {errors.city}
              </span>
            </div>
          )}
        </div>

        {/* Country & State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Country *
            </label>
            <select
              value={enrollmentData.country}
              onChange={(e) => updateEnrollmentData({ country: e.target.value })}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.country
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
            {errors.country && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.country}
                </span>
              </div>
            )}
          </div>

          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              State/Province *
            </label>
            <select
              value={enrollmentData.stateProvince}
              onChange={(e) => updateEnrollmentData({ stateProvince: e.target.value })}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.stateProvince
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            >
              <option value="">Select State/Province</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.stateProvince && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.stateProvince}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Postal Code */}
        <div>
          <label
            className="block text-sm text-[#251218]/70 mb-2"
            style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
          >
            Postal Code *
          </label>
          <input
            type="text"
            value={enrollmentData.postalCode}
            onChange={(e) => updateEnrollmentData({ postalCode: e.target.value })}
            placeholder="12345"
            className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
              errors.postalCode
                ? "border-red-400 focus:border-red-500"
                : "border-[#251218]/10 focus:border-[#c9969e]/30"
            }`}
            style={{ fontFamily: "Lora, serif", color: "#251218" }}
          />
          {errors.postalCode && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                {errors.postalCode}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 flex gap-4">
          <button
            onClick={handleBack}
            className="flex-1 px-8 py-4 bg-white/60 border border-[#251218]/20 text-[#251218] hover:bg-white/80 transition-all duration-300"
          >
            <span
              className="text-sm uppercase tracking-[0.2em]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Back
            </span>
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300"
          >
            <span
              className="text-sm uppercase tracking-[0.2em]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Continue to Payment
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
