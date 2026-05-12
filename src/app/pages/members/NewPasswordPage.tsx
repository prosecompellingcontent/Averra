import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Check, X } from "lucide-react";

export function NewPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordRequirements = {
    minLength: password.length >= 6,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Password must include a special character";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to login with success message
      navigate("/members/login", { state: { message: "Your password has been updated successfully." } });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/members/login" className="inline-block mb-12">
            <h1
              className="text-4xl tracking-tight text-[#251218]"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              AVERRA
            </h1>
          </Link>

          <div className="mb-8">
            <h2
              className="text-3xl text-[#251218] mb-3"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              Create New Password
            </h2>
            <p
              className="text-[#251218]/70"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Your new password must be different from previously used passwords
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({});
                  }}
                  required
                  className={`w-full px-4 py-3 pr-12 bg-white/60 border rounded-lg focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#251218]/20 focus:border-[#c9969e]"
                  }`}
                  style={{ fontFamily: "Lora, serif", color: "#251218" }}
                  placeholder="Enter new password"
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
                <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "Lora, serif" }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({});
                  }}
                  required
                  className={`w-full px-4 py-3 pr-12 bg-white/60 border rounded-lg focus:outline-none transition-colors ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#251218]/20 focus:border-[#c9969e]"
                  }`}
                  style={{ fontFamily: "Lora, serif", color: "#251218" }}
                  placeholder="Confirm new password"
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
                <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "Lora, serif" }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-[#251218]/10">
              <p
                className="text-sm text-[#251218]/80 mb-3"
                style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
              >
                Password must contain:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {passwordRequirements.minLength ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-[#251218]/30" />
                  )}
                  <span
                    className={`text-sm ${
                      passwordRequirements.minLength ? "text-green-600" : "text-[#251218]/60"
                    }`}
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Minimum 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordRequirements.hasSpecialChar ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-[#251218]/30" />
                  )}
                  <span
                    className={`text-sm ${
                      passwordRequirements.hasSpecialChar ? "text-green-600" : "text-[#251218]/60"
                    }`}
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Must include a special character
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !allRequirementsMet}
              className="w-full py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p
              className="text-sm text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Remember your password?{" "}
              <Link
                to="/members/login"
                className="text-[#c9969e] hover:text-[#251218] transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
            <p
              className="text-sm text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              <Link
                to="/contact"
                className="text-[#c9969e] hover:text-[#251218] transition-colors font-medium"
              >
                Need Help?
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Design */}
      <div className="hidden lg:flex flex-1 bg-[#251218] items-center justify-center p-12">
        <div className="max-w-md">
          <h3
            className="text-4xl text-[#fdf5f7] mb-6 leading-[1.1]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Almost
            <br />
            <span className="italic text-[#c9969e]">done</span>
          </h3>
          <p
            className="text-lg text-[#fdf5f7]/70 leading-relaxed"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Choose a strong password to keep your account secure.
          </p>
        </div>
      </div>
    </div>
  );
}
