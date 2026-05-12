import { useState } from "react";
import { Link, useNavigate } from "react-router";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to verification code page with email
      navigate("/members/reset-password/verify", { state: { email } });
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
              Reset Password
            </h2>
            <p
              className="text-[#251218]/70"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Enter the email connected to your membership account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p
                className="text-sm text-red-600"
                style={{ fontFamily: "Lora, serif" }}
              >
                {error}
              </p>
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
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors"
                style={{ fontFamily: "Lora, serif", color: "#251218" }}
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              {isLoading ? "Sending..." : "Continue"}
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
            We've got
            <br />
            <span className="italic text-[#c9969e]">your back</span>
          </h3>
          <p
            className="text-lg text-[#fdf5f7]/70 leading-relaxed"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Let's get you back into your account so you can continue building
            your business beyond the chair.
          </p>
        </div>
      </div>
    </div>
  );
}
