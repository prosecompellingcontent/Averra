import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

export function TestVerificationPage() {
  const [testEmail, setTestEmail] = useState("");
  const [testCode, setTestCode] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string, type: "success" | "error" | "info" = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
    setResults(prev => [`[${timestamp}] ${prefix} ${message}`, ...prev]);
  };

  const testSendCode = async () => {
    if (!testEmail) {
      addResult("Please enter an email address", "error");
      return;
    }

    setIsLoading(true);
    addResult(`Sending verification code to ${testEmail}...`, "info");

    try {
      const response = await supabase.functions.invoke("send-verification-email", {
        body: { email: testEmail },
      });

      if (response.error) {
        addResult(`Failed to send code: ${response.error.message}`, "error");
      } else {
        addResult("Verification code sent successfully!", "success");
        addResult(`Expires at: ${response.data.expiresAt}`, "info");
      }
    } catch (err: any) {
      addResult(`Error: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const testVerifyCode = async () => {
    if (!testEmail || !testCode) {
      addResult("Please enter both email and code", "error");
      return;
    }

    setIsLoading(true);
    addResult(`Verifying code ${testCode} for ${testEmail}...`, "info");

    try {
      const response = await supabase.functions.invoke("verify-email-code", {
        body: { email: testEmail, code: testCode },
      });

      if (response.error) {
        addResult(`Verification failed: ${response.error.message}`, "error");
      } else if (response.data.success) {
        addResult("Email verified successfully!", "success");
      } else {
        addResult(`Verification failed: ${response.data.error}`, "error");
      }
    } catch (err: any) {
      addResult(`Error: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const testResend = async () => {
    if (!testEmail) {
      addResult("Please enter an email address", "error");
      return;
    }

    setIsLoading(true);
    addResult(`Resending verification code to ${testEmail}...`, "info");

    try {
      const response = await supabase.functions.invoke("send-verification-email", {
        body: { email: testEmail },
      });

      if (response.error) {
        addResult(`Failed to resend code: ${response.error.message}`, "error");
      } else {
        addResult("New verification code sent successfully!", "success");
        addResult("Previous code is now invalid", "info");
      }
    } catch (err: any) {
      addResult(`Error: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const testChangeEmail = async () => {
    if (!newEmail) {
      addResult("Please enter a new email address", "error");
      return;
    }

    setIsLoading(true);
    addResult(`Changing email from ${testEmail} to ${newEmail}...`, "info");

    setTestEmail(newEmail);
    setTestCode("");

    try {
      const response = await supabase.functions.invoke("send-verification-email", {
        body: { email: newEmail },
      });

      if (response.error) {
        addResult(`Failed to send to new email: ${response.error.message}`, "error");
      } else {
        addResult("Verification code sent to new email!", "success");
        addResult("Email changed successfully", "success");
      }
    } catch (err: any) {
      addResult(`Error: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const testFailedAttempt = async () => {
    if (!testEmail) {
      addResult("Please enter an email address", "error");
      return;
    }

    setIsLoading(true);
    addResult("Testing failed verification attempt with invalid code...", "info");

    try {
      const response = await supabase.functions.invoke("verify-email-code", {
        body: { email: testEmail, code: "999999" },
      });

      if (response.data.success) {
        addResult("Unexpected: Invalid code was accepted!", "error");
      } else {
        addResult("Failed verification handled correctly", "success");
        addResult(`Error message: ${response.data.error}`, "info");
      }
    } catch (err: any) {
      addResult(`Error: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/20 mb-8">
          <h1
            className="text-4xl text-[#251218] mb-3"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
          >
            Email Verification Testing
          </h1>
          <p
            className="text-base text-[#251218]/60"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Internal QA page for testing the email verification flow before launch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="space-y-6">
            {/* Email Input */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <h2
                className="text-xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Test Email
              </h2>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors text-[#251218] mb-4"
                style={{ fontFamily: "Lora, serif" }}
              />
              <button
                onClick={testSendCode}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all rounded-lg disabled:opacity-50 text-sm uppercase tracking-wider"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                Send Verification Code
              </button>
            </div>

            {/* Code Verification */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <h2
                className="text-xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Verify Code
              </h2>
              <input
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors text-[#251218] mb-4 text-center text-2xl tracking-widest"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              />
              <button
                onClick={testVerifyCode}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all rounded-lg disabled:opacity-50 text-sm uppercase tracking-wider"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                Verify Code
              </button>
            </div>

            {/* Additional Tests */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <h2
                className="text-xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Additional Tests
              </h2>
              <div className="space-y-3">
                <button
                  onClick={testResend}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-white/60 border border-[#251218]/20 text-[#251218] hover:bg-white hover:border-[#c9969e] transition-all rounded-lg disabled:opacity-50 text-sm"
                  style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                >
                  Test Resend Code
                </button>
                <button
                  onClick={testFailedAttempt}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-white/60 border border-[#251218]/20 text-[#251218] hover:bg-white hover:border-[#c9969e] transition-all rounded-lg disabled:opacity-50 text-sm"
                  style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                >
                  Test Failed Attempt
                </button>
              </div>
            </div>

            {/* Change Email Test */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <h2
                className="text-xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Change Email
              </h2>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="newemail@example.com"
                className="w-full px-4 py-3 bg-white/60 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors text-[#251218] mb-4"
                style={{ fontFamily: "Lora, serif" }}
              />
              <button
                onClick={testChangeEmail}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-white/60 border border-[#251218]/20 text-[#251218] hover:bg-white hover:border-[#c9969e] transition-all rounded-lg disabled:opacity-50 text-sm"
                style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
              >
                Change Email & Resend
              </button>
            </div>
          </div>

          {/* Results Log */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl text-[#251218]"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Test Results
              </h2>
              <button
                onClick={() => setResults([])}
                className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Clear
              </button>
            </div>
            <div className="bg-[#251218] rounded-xl p-4 h-[600px] overflow-y-auto">
              {results.length === 0 ? (
                <p
                  className="text-center text-[#fdf5f7]/40 text-sm mt-8"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  No test results yet. Run a test to see output.
                </p>
              ) : (
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="text-sm text-[#fdf5f7] font-mono leading-relaxed"
                    >
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
