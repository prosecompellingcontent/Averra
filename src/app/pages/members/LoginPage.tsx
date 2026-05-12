import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/app/context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { message?: string })?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { user, error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError.userMessage);
      setIsLoading(false);
      return;
    }

    if (user) {
      // Navigate based on onboarding status
      if (!user.hasCompletedOnboarding) {
        navigate("/members/welcome");
      } else {
        navigate("/members/dashboard");
      }
    } else {
      setError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-12">
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
              Welcome Back
            </h2>
            <p
              className="text-[#251218]/70"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Sign in to access your membership
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p
                className="text-sm text-green-600"
                style={{ fontFamily: "Lora, serif" }}
              >
                {successMessage}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p
                className="text-sm text-red-600"
                style={{ fontFamily: "Lora, serif" }}
              >
                {error}
              </p>
              {(error.includes('confirm') || error.includes('Invalid login')) && (
                <p className="text-xs text-red-500 mt-2" style={{ fontFamily: "Lora, serif" }}>
                  <Link
                    to="/contact"
                    className="underline hover:text-red-700"
                  >
                    Contact support
                  </Link> if you need help accessing your account.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors text-[#251218]"
                style={{ fontFamily: "Lora, serif" }}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors text-[#251218]"
                style={{ fontFamily: "Lora, serif" }}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#c9969e] border-[#251218]/20 rounded focus:ring-[#c9969e]"
                />
                <span
                  className="text-[#251218]/70"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Remember me
                </span>
              </label>
              <Link
                to="/members/forgot-password"
                className="text-[#c9969e] hover:text-[#251218] transition-colors"
                style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p
              className="text-sm text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Don't have an account?{" "}
              <Link
                to="/membership-options"
                className="text-[#c9969e] hover:text-[#251218] transition-colors font-medium"
              >
                Join AVERRA
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

      {/* Right Side - Image/Design */}
      <div className="hidden lg:flex flex-1 bg-[#251218] items-center justify-center p-12">
        <div className="max-w-md">
          <h3
            className="text-4xl text-[#fdf5f7] mb-6 leading-[1.1]"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Building beyond
            <br />
            <span className="italic text-[#c9969e]">the chair</span>
          </h3>
          <p
            className="text-lg text-[#fdf5f7]/70 leading-relaxed"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Join beauty professionals who are creating businesses that work for
            them, not the other way around.
          </p>
        </div>
      </div>
    </div>
  );
}
