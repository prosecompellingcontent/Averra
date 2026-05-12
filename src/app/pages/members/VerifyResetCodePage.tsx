import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";

export function VerifyResetCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [newEmail, setNewEmail] = useState(email);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete verification code");
      return;
    }

    setIsLoading(true);

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to new password page
      navigate("/members/reset-password/new", { state: { email, code: fullCode } });
    }, 1000);
  };

  const handleResendCode = () => {
    setCode(["", "", "", "", "", ""]);
    setError("");
    // Simulate sending new code
    alert("A new verification code has been sent to your email.");
  };

  const handleChangeEmail = () => {
    if (showEmailEdit) {
      // Submit new email and resend code
      handleResendCode();
      setShowEmailEdit(false);
    } else {
      setShowEmailEdit(true);
    }
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
              Verification Code
            </h2>
            <p
              className="text-[#251218]/70"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              We sent a confirmation code to{" "}
              {!showEmailEdit && (
                <span className="font-medium text-[#251218]">{email}</span>
              )}
            </p>
          </div>

          {showEmailEdit && (
            <div className="mb-6">
              <label
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors"
                style={{ fontFamily: "Lora, serif", color: "#251218" }}
              />
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
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl bg-white/60 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors"
                  style={{ fontFamily: "Lora, serif", color: "#251218" }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p
              className="text-sm text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Didn't receive a code?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleResendCode}
                className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors font-medium"
                style={{ fontFamily: "Lora, serif" }}
              >
                Resend Code
              </button>
              <button
                onClick={handleChangeEmail}
                className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors font-medium"
                style={{ fontFamily: "Lora, serif" }}
              >
                {showEmailEdit ? "Save and Resend" : "Change Email"}
              </button>
            </div>
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
            <span className="italic text-[#c9969e]">there</span>
          </h3>
          <p
            className="text-lg text-[#fdf5f7]/70 leading-relaxed"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Check your inbox for the verification code we just sent you.
          </p>
        </div>
      </div>
    </div>
  );
}
