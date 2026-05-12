import { useState } from "react";
import { Link } from "react-router";
import { useEnrollment } from "@/app/context/EnrollmentContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export function PersonalInformationStep() {
  const { enrollmentData, updateEnrollmentData, setCurrentStep } = useEnrollment();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkEmailExists = async (email: string): Promise<boolean> => {
    // TODO: Replace with actual Supabase query
    // Example:
    // const { data } = await supabase
    //   .from('users')
    //   .select('email')
    //   .eq('email', email)
    //   .single();
    // return !!data;

    // Simulated check - replace with real implementation
    const existingEmails = ["test@example.com", "demo@averra.com"];
    return existingEmails.includes(email.toLowerCase());
  };

  const validateStep = async () => {
    const newErrors: Record<string, string> = {};

    if (!enrollmentData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!enrollmentData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!enrollmentData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(enrollmentData.email)) {
      newErrors.email = "Email is invalid";
    } else {
      // Check for duplicate email
      const emailExists = await checkEmailExists(enrollmentData.email);
      if (emailExists) {
        newErrors.email = "duplicate";
      }
    }
    if (!enrollmentData.phone.trim()) newErrors.phone = "Phone number is required";

    if (!enrollmentData.password) newErrors.password = "Password is required";
    else if (enrollmentData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(enrollmentData.password))
      newErrors.password = "Password must include a special character";

    if (enrollmentData.password !== enrollmentData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!enrollmentData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!enrollmentData.gender) newErrors.gender = "Please select a gender";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-[#c9969e]/20 p-10 shadow-2xl">
      <div className="mb-8">
        <h2
          className="text-3xl text-[#251218] mb-3"
          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
        >
          Personal Information
        </h2>
        <p
          className="text-base text-[#251218]/60"
          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
        >
          Let's start with the basics
        </p>
      </div>

      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              First Name *
            </label>
            <input
              type="text"
              value={enrollmentData.firstName}
              onChange={(e) => updateEnrollmentData({ firstName: e.target.value })}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.firstName
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            />
            {errors.firstName && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.firstName}
                </span>
              </div>
            )}
          </div>

          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Last Name *
            </label>
            <input
              type="text"
              value={enrollmentData.lastName}
              onChange={(e) => updateEnrollmentData({ lastName: e.target.value })}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.lastName
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            />
            {errors.lastName && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.lastName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Email Address *
            </label>
            <input
              type="email"
              value={enrollmentData.email}
              onChange={(e) => updateEnrollmentData({ email: e.target.value })}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            />
            {errors.email && (
              <div className="mt-2">
                {errors.email === "duplicate" ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                      <p className="text-sm text-red-600" style={{ fontFamily: "Lora, serif" }}>
                        This email is already enrolled.
                        <br />
                        Please login using your existing account.
                      </p>
                    </div>
                    <Link
                      to="/members/forgot-password"
                      className="text-sm text-[#c9969e] hover:text-[#251218] underline transition-colors"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                      {errors.email}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Phone Number *
            </label>
            <input
              type="tel"
              value={enrollmentData.phone}
              onChange={(e) => updateEnrollmentData({ phone: e.target.value })}
              placeholder="(555) 555-5555"
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.phone
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            />
            {errors.phone && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.phone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Create Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={enrollmentData.password}
                onChange={(e) => updateEnrollmentData({ password: e.target.value })}
                className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all pr-12 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#251218]/10 focus:border-[#c9969e]/30"
                }`}
                style={{ fontFamily: "Lora, serif" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[#251218]/5 rounded-lg transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#251218]/40" />
                ) : (
                  <Eye className="w-4 h-4 text-[#251218]/40" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.password}
                </span>
              </div>
            )}
            <p className="text-xs text-[#251218]/50 mt-1" style={{ fontFamily: "Lora, serif" }}>
              Min 6 characters, must include a special character
            </p>
          </div>

          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={enrollmentData.confirmPassword}
                onChange={(e) => updateEnrollmentData({ confirmPassword: e.target.value })}
                className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all pr-12 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#251218]/10 focus:border-[#c9969e]/30"
                }`}
                style={{ fontFamily: "Lora, serif" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[#251218]/5 rounded-lg transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-[#251218]/40" />
                ) : (
                  <Eye className="w-4 h-4 text-[#251218]/40" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.confirmPassword}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Date of Birth & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Date of Birth *
            </label>
            <input
              type="date"
              value={enrollmentData.dateOfBirth}
              onChange={(e) => updateEnrollmentData({ dateOfBirth: e.target.value })}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.dateOfBirth
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            />
            {errors.dateOfBirth && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.dateOfBirth}
                </span>
              </div>
            )}
          </div>

          <div>
            <label
              className="block text-sm text-[#251218]/70 mb-2"
              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
            >
              Gender *
            </label>
            <select
              value={enrollmentData.gender}
              onChange={(e) => updateEnrollmentData({ gender: e.target.value })}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none transition-all ${
                errors.gender
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#251218]/10 focus:border-[#c9969e]/30"
              }`}
              style={{ fontFamily: "Lora, serif", color: "#251218" }}
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer Not To Say">Prefer Not To Say</option>
            </select>
            {errors.gender && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500" style={{ fontFamily: "Lora, serif" }}>
                  {errors.gender}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="pt-4 border-t border-[#251218]/5">
          <h3
            className="text-lg text-[#251218] mb-4"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm text-[#251218]/70 mb-2"
                style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
              >
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={enrollmentData.emergencyContactName}
                onChange={(e) => updateEnrollmentData({ emergencyContactName: e.target.value })}
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                style={{ fontFamily: "Lora, serif" }}
              />
            </div>
            <div>
              <label
                className="block text-sm text-[#251218]/70 mb-2"
                style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
              >
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={enrollmentData.emergencyContactPhone}
                onChange={(e) => updateEnrollmentData({ emergencyContactPhone: e.target.value })}
                placeholder="(555) 555-5555"
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                style={{ fontFamily: "Lora, serif" }}
              />
            </div>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="pt-4 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={enrollmentData.consentMarketing}
              onChange={(e) => updateEnrollmentData({ consentMarketing: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-[#251218]/20 text-[#c9969e] focus:ring-[#c9969e]/30"
            />
            <span
              className="text-sm text-[#251218]/70 group-hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              I consent to receiving marketing messages (special offers, new content releases, member highlights)
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={enrollmentData.consentNonMarketing}
              onChange={(e) => updateEnrollmentData({ consentNonMarketing: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-[#251218]/20 text-[#c9969e] focus:ring-[#c9969e]/30"
            />
            <span
              className="text-sm text-[#251218]/70 group-hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              I consent to receiving important account notifications (billing updates, membership status, policy changes)
            </span>
          </label>
        </div>

        {/* Continue Button */}
        <div className="pt-6">
          <button
            onClick={handleContinue}
            className="w-full px-8 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300"
          >
            <span
              className="text-sm uppercase tracking-[0.2em]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Continue to Address
            </span>
          </button>

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
    </div>
  );
}
