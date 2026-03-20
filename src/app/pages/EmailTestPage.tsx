import { useState } from "react";
import { Navigation } from "@/app/components/Navigation";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Mail, CheckCircle, XCircle, Loader2, Settings } from "lucide-react";

export function EmailTestPage() {
  const [email, setEmail] = useState("");
  const [testType, setTestType] = useState<"basic" | "service" | "digital">("basic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [configInfo, setConfigInfo] = useState<any>(null);
  const [showConfig, setShowConfig] = useState(false);

  const checkConfig = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/check-config`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setConfigInfo(data);
      setShowConfig(true);
    } catch (error) {
      console.error("Failed to check config:", error);
    }
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let endpoint = "";
      let body: any = { to: email };

      switch (testType) {
        case "basic":
          endpoint = "/test-email";
          break;
        case "service":
          endpoint = "/send-purchase-email";
          body = {
            to: email,
            customerName: "Test Customer",
            items: [{
              name: "AVERRA Essentials",
              type: "service",
              price: 100
            }],
            total: 100,
            calendlyLink: "https://calendly.com/averra-test/strategy-session"
          };
          break;
        case "digital":
          endpoint = "/send-purchase-email";
          body = {
            to: email,
            customerName: "Test Customer",
            items: [{
              name: "Editorial Photo Set: Rose Gold Hour",
              type: "digital",
              price: 29
            }],
            total: 29
          };
          break;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Email sent successfully!",
          details: data
        });
      } else {
        setResult({
          success: false,
          message: data.error || data.message || "Failed to send email",
          details: {
            ...data,
            fullError: JSON.stringify(data, null, 2),
            statusCode: response.status,
            statusText: response.statusText
          }
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Network error",
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EF]">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-[#b76e79]" />
            <h1 className="text-5xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
              Email Testing
            </h1>
          </div>
          <p className="text-[#654331] text-lg" style={{ fontFamily: 'Lora, serif' }}>
            Test your Resend integration and preview all email templates
          </p>
        </div>

        {/* Test Form */}
        <div className="bg-white/60 backdrop-blur-sm border border-[#b76e79]/20 shadow-lg p-8 mb-8">
          <form onSubmit={handleTestEmail} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-[#301710] text-sm uppercase tracking-wider mb-2">
                Test Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-4 py-3 bg-white border-2 border-[#b76e79]/30 text-[#301710] placeholder:text-[#301710]/40 focus:border-[#b76e79] focus:outline-none transition-all shadow-sm"
              />
              <p className="text-[#654331]/60 text-xs mt-2 italic">
                Enter the email address where you want to receive the test
              </p>
            </div>

            {/* Test Type Selection */}
            <div>
              <label className="block text-[#301710] text-sm uppercase tracking-wider mb-3">
                Email Type to Test *
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white/40 border-2 border-[#b76e79]/20 hover:border-[#b76e79]/40 transition-all">
                  <input
                    type="radio"
                    name="testType"
                    value="basic"
                    checked={testType === "basic"}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="mt-1 w-5 h-5 border-2 border-[#301710]/40 bg-white/40 checked:bg-[#301710] checked:border-[#301710] focus:outline-none focus:ring-2 focus:ring-[#301710]/50 transition-all cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-[#301710] font-semibold block mb-1">Basic Test Email</span>
                    <span className="text-[#654331]/70 text-sm">
                      Simple test to verify Resend API is working
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white/40 border-2 border-[#b76e79]/20 hover:border-[#b76e79]/40 transition-all">
                  <input
                    type="radio"
                    name="testType"
                    value="service"
                    checked={testType === "service"}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="mt-1 w-5 h-5 border-2 border-[#301710]/40 bg-white/40 checked:bg-[#301710] checked:border-[#301710] focus:outline-none focus:ring-2 focus:ring-[#301710]/50 transition-all cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-[#301710] font-semibold block mb-1">Service Tier Purchase Email</span>
                    <span className="text-[#654331]/70 text-sm">
                      Includes Calendly booking link for strategy session
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white/40 border-2 border-[#b76e79]/20 hover:border-[#b76e79]/40 transition-all">
                  <input
                    type="radio"
                    name="testType"
                    value="digital"
                    checked={testType === "digital"}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="mt-1 w-5 h-5 border-2 border-[#301710]/40 bg-white/40 checked:bg-[#301710] checked:border-[#301710] focus:outline-none focus:ring-2 focus:ring-[#301710]/50 transition-all cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-[#301710] font-semibold block mb-1">Digital Product Purchase Email</span>
                    <span className="text-[#654331]/70 text-sm">
                      Includes download links and commercial license
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-12 py-4 bg-[#301710] text-white uppercase tracking-[0.3em] hover:bg-[#301710]/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{ fontFamily: 'Lora, serif', fontWeight: 600 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Test Email
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`p-6 border-2 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} shadow-lg`}>
            <div className="flex items-start gap-3 mb-3">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.success ? 'Success!' : 'Error'}
                </h3>
                <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </p>
                
                {/* Show helpful troubleshooting if error */}
                {!result.success && result.details && (
                  <div className="mt-4 p-4 bg-white/60 border border-red-300">
                    <p className="font-semibold text-red-900 mb-2 text-sm">🔍 Troubleshooting:</p>
                    {result.details.statusCode === 403 && (
                      <p className="text-red-800 text-sm">
                        ❌ <strong>403 Forbidden:</strong> Your Resend API key is invalid or expired. 
                        <br/>→ Check your API key in the Resend dashboard at <a href="https://resend.com/api-keys" target="_blank" className="underline">resend.com/api-keys</a>
                      </p>
                    )}
                    {result.details.statusCode === 422 && (
                      <p className="text-red-800 text-sm">
                        ❌ <strong>422 Validation Error:</strong> The email format or domain is invalid.
                        <br/>→ Make sure you're using a valid email address format.
                      </p>
                    )}
                    {result.details.statusCode === 401 && (
                      <p className="text-red-800 text-sm">
                        ❌ <strong>401 Unauthorized:</strong> API key is missing or malformed.
                        <br/>→ Verify RESEND_API_KEY is set correctly in Supabase secrets.
                      </p>
                    )}
                    {result.details.details?.message && (
                      <p className="text-red-800 text-sm mt-2">
                        📋 <strong>Resend says:</strong> {result.details.details.message}
                      </p>
                    )}
                  </div>
                )}
                
                {result.details && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm opacity-70 hover:opacity-100">
                      View Full Technical Details
                    </summary>
                    <pre className="mt-2 p-3 bg-black/5 text-xs overflow-auto max-h-60">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-white/40 backdrop-blur-sm border border-[#b76e79]/20 p-6">
          <h2 className="text-xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
            Testing Instructions
          </h2>
          <div className="space-y-3 text-[#654331] text-sm" style={{ fontFamily: 'Lora, serif' }}>
            <p>
              <strong className="text-[#301710]">1. Basic Test:</strong> Sends a simple confirmation email to verify your Resend API key is working.
            </p>
            <p>
              <strong className="text-[#301710]">2. Service Tier Test:</strong> Simulates a service package purchase with a Calendly booking link.
            </p>
            <p>
              <strong className="text-[#301710]">3. Digital Product Test:</strong> Simulates a digital product purchase with download instructions.
            </p>
            <p className="pt-3 border-t border-[#b76e79]/20 text-xs text-[#654331]/70">
              <strong>Note:</strong> The RESEND_API_KEY must be configured in your Supabase project secrets for emails to work.
            </p>
          </div>
        </div>

        {/* Configuration Check */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm border border-[#b76e79]/20 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-[#301710]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 500 }}>
              System Diagnostics
            </h2>
            <button
              type="button"
              onClick={checkConfig}
              className="px-6 py-2 bg-[#301710]/10 text-[#301710] text-sm uppercase tracking-wider hover:bg-[#301710]/20 transition-all flex items-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              <Settings className="w-4 h-4" />
              Check Config
            </button>
          </div>
          
          {configInfo && (
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-white/60 border border-[#301710]/10">
                <h3 className="font-semibold text-[#301710] mb-2 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px' }}>
                  Resend Configuration
                </h3>
                <div className="space-y-1 text-[#654331]/80">
                  <p>• Status: <span className={configInfo.resend?.configured ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{configInfo.resend?.configured ? '✓ Configured' : '✗ Not Configured'}</span></p>
                  {configInfo.resend?.configured && (
                    <>
                      <p>• Key Length: {configInfo.resend?.keyLength} characters</p>
                      <p className="font-mono text-xs">• Preview: {configInfo.resend?.keyPreview}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white/60 border border-[#301710]/10">
                <h3 className="font-semibold text-[#301710] mb-2 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px' }}>
                  Stripe Configuration
                </h3>
                <div className="space-y-1 text-[#654331]/80">
                  <p>• Secret Key: <span className={configInfo.stripe?.secretKey ? 'text-green-600' : 'text-red-600'}>{configInfo.stripe?.secretKey ? '✓' : '✗'}</span></p>
                  <p>• Publishable Key: <span className={configInfo.stripe?.publishableKey ? 'text-green-600' : 'text-red-600'}>{configInfo.stripe?.publishableKey ? '✓' : '✗'}</span></p>
                  <p>• Webhook Secret: <span className={configInfo.stripe?.webhookSecret ? 'text-green-600' : 'text-red-600'}>{configInfo.stripe?.webhookSecret ? '✓' : '✗'}</span></p>
                </div>
              </div>

              <div className="p-4 bg-white/60 border border-[#301710]/10">
                <h3 className="font-semibold text-[#301710] mb-2 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px' }}>
                  Environment
                </h3>
                <p className="text-[#654331]/80">
                  Running in: <strong>{configInfo.environment}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}