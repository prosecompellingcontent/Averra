import { useState } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { useAuth } from "@/app/context/AuthContext";
import {
  CreditCard,
  Building2,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Shield,
  TrendingUp,
} from "lucide-react";

export function BillingPage() {
  const { user } = useAuth();
  const [showCancellationFlow, setShowCancellationFlow] = useState(false);
  const [cancellationStep, setCancellationStep] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!user) return null;

  const isBlueprint = user.membershipTier === "blueprint";
  const tierLabel = isBlueprint ? "Blueprint" : "Gold Standard";
  const monthlyRate = isBlueprint ? 30 : 75; // Founder pricing
  const regularRate = isBlueprint ? 75 : 130;

  const billingHistory = [
    { date: "May 1, 2026", amount: monthlyRate, status: "Paid", invoice: "INV-2026-05" },
    { date: "Apr 1, 2026", amount: monthlyRate, status: "Paid", invoice: "INV-2026-04" },
    { date: "Mar 1, 2026", amount: monthlyRate, status: "Paid", invoice: "INV-2026-03" },
  ];

  const handleCancelMembership = () => {
    // Simulate cancellation
    console.log("Membership cancelled");
    setShowCancellationFlow(false);
    setCancellationStep(1);
  };

  return (
    <MemberLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c9969e]/5 rounded-full blur-3xl"></div>

          <div className="relative px-12 py-12">
            <h1
              className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05] mb-3"
              style={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              Billing & Membership
            </h1>
            <p
              className="text-lg text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Manage your subscription and payment details
            </p>
          </div>
        </div>

        <div className="px-12 py-12">
          <div className="max-w-5xl space-y-8">
            {/* Current Membership */}
            <div className="bg-gradient-to-br from-[#c9969e] to-[#251218] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

              <div className="relative p-10 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2
                        className="text-3xl"
                        style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                      >
                        {tierLabel} Membership
                      </h2>
                      <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                        <span
                          className="text-xs uppercase tracking-[0.15em]"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                        >
                          Founder
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-green-300" />
                      <span
                        className="text-sm text-white/90"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        Active Subscription
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-5xl mb-1"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      ${monthlyRate}
                    </p>
                    <p
                      className="text-sm text-white/70 mb-2"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      per month
                    </p>
                    <p
                      className="text-xs text-white/60 line-through"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      Regular: ${regularRate}/month
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-white/80" />
                      <p
                        className="text-xs uppercase tracking-[0.15em] text-white/70"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        Founder Rate
                      </p>
                    </div>
                    <p
                      className="text-sm text-white/90"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      Locked in while active
                    </p>
                  </div>

                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-white/80" />
                      <p
                        className="text-xs uppercase tracking-[0.15em] text-white/70"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        Next Billing
                      </p>
                    </div>
                    <p
                      className="text-sm text-white/90"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      June 1, 2026
                    </p>
                  </div>

                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-white/80" />
                      <p
                        className="text-xs uppercase tracking-[0.15em] text-white/70"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        Member Since
                      </p>
                    </div>
                    <p
                      className="text-sm text-white/90"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      April 2026
                    </p>
                  </div>
                </div>

                {isBlueprint && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full px-6 py-4 bg-white text-[#251218] hover:bg-white/90 transition-all duration-300 shadow-lg"
                  >
                    <span
                      className="text-sm uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Upgrade to Gold Standard
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10">
              <h2
                className="text-2xl text-[#251218] mb-6"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Payment Methods
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-white/60 border border-[#251218]/10 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-[#c9969e]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p
                        className="text-base text-[#251218] mb-1"
                        style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                      >
                        •••• •••• •••• 4242
                      </p>
                      <p
                        className="text-sm text-[#251218]/60"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        Expires 12/2028 • Primary
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 text-sm text-[#c9969e] hover:bg-[#c9969e]/10 rounded-lg transition-colors"
                    style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                  >
                    Edit
                  </button>
                </div>

                <button className="w-full px-6 py-4 bg-[#251218]/5 hover:bg-[#c9969e]/10 rounded-xl transition-colors border border-[#251218]/10">
                  <span
                    className="text-sm uppercase tracking-[0.2em] text-[#251218]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    Add Payment Method
                  </span>
                </button>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10">
              <h2
                className="text-2xl text-[#251218] mb-6"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Billing History
              </h2>

              <div className="space-y-3">
                {billingHistory.map((invoice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/60 border border-[#251218]/5 rounded-xl hover:border-[#c9969e]/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-[#c9969e]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p
                          className="text-sm text-[#251218] mb-1"
                          style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                        >
                          {invoice.date}
                        </p>
                        <p
                          className="text-xs text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          {invoice.invoice}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className="text-base text-[#251218] mb-1"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                        >
                          ${invoice.amount}.00
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span
                            className="text-xs text-[#251218]/60"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-[#251218]/60" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-red-200">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h2
                    className="text-2xl text-[#251218] mb-2"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    Cancel Membership
                  </h2>
                  <p
                    className="text-base text-[#251218]/70 leading-relaxed"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    Canceling your membership will result in loss of your founder pricing and access to all AVERRA resources.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCancellationFlow(true)}
                className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
              >
                <span
                  className="text-sm uppercase tracking-[0.2em]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  Cancel Membership
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Flow Modal */}
      {showCancellationFlow && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#251218]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            {cancellationStep === 1 && (
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3
                    className="text-2xl text-[#251218]"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    Are you sure?
                  </h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p
                      className="text-sm text-red-800 font-medium mb-2"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      You will lose your founder pricing permanently
                    </p>
                    <p
                      className="text-sm text-red-700"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      Your current rate: ${monthlyRate}/month • Regular rate: ${regularRate}/month
                      <br />
                      If you rejoin later, you'll pay ${regularRate}/month, an increase of ${regularRate - monthlyRate}/month.
                    </p>
                  </div>

                  <div className="p-4 bg-[#fdf5f7] border border-[#c9969e]/20 rounded-xl">
                    <p
                      className="text-sm text-[#251218] font-medium mb-2"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      You will immediately lose access to:
                    </p>
                    <ul
                      className="text-sm text-[#251218]/70 space-y-1 ml-4"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      <li>• The Gold Standard eBook and all chapters</li>
                      <li>• Monthly business strategy frameworks</li>
                      <li>• Private community and discussion rooms</li>
                      <li>• Your saved content and notes</li>
                      <li>• Progress tracking and milestones</li>
                      {!isBlueprint && (
                        <>
                          <li>• Monthly strategy calls with Jayla</li>
                          <li>• Business audit portal</li>
                          <li>• Brand spotlight features</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <p
                      className="text-sm text-orange-800 font-medium mb-1"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      60-Day Billing Agreement
                    </p>
                    <p
                      className="text-sm text-orange-700"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      You joined on April 5, 2026. If you cancel now, you are required to pay any dues scheduled within 60 days of your join date (through June 5, 2026).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCancellationFlow(false)}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300"
                  >
                    <span
                      className="text-sm uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Keep My Membership
                    </span>
                  </button>
                  <button
                    onClick={() => setCancellationStep(2)}
                    className="flex-1 px-6 py-4 bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <span
                      className="text-sm uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Continue Cancellation
                    </span>
                  </button>
                </div>
              </div>
            )}

            {cancellationStep === 2 && (
              <div className="p-10">
                <h3
                  className="text-2xl text-[#251218] mb-6"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Final Confirmation
                </h3>

                <div className="mb-8 space-y-4">
                  <p
                    className="text-base text-[#251218]/80 leading-relaxed"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    By confirming cancellation, you acknowledge that:
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#fdf5f7] rounded-xl border border-[#c9969e]/10">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-[#251218]/20 text-red-600 focus:ring-red-500"
                      />
                      <span
                        className="text-sm text-[#251218]/80"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        I understand my founder pricing of ${monthlyRate}/month will be permanently lost
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#fdf5f7] rounded-xl border border-[#c9969e]/10">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-[#251218]/20 text-red-600 focus:ring-red-500"
                      />
                      <span
                        className="text-sm text-[#251218]/80"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        I understand I will immediately lose access to all AVERRA resources
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#fdf5f7] rounded-xl border border-[#c9969e]/10">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-[#251218]/20 text-red-600 focus:ring-red-500"
                      />
                      <span
                        className="text-sm text-[#251218]/80"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        I understand the 60-day billing agreement and my payment obligations
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCancellationStep(1)}
                    className="flex-1 px-6 py-4 bg-white border border-[#251218]/20 text-[#251218] hover:bg-white/80 transition-all duration-300"
                  >
                    <span
                      className="text-sm uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Go Back
                    </span>
                  </button>
                  <button
                    onClick={handleCancelMembership}
                    className="flex-1 px-6 py-4 bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                  >
                    <span
                      className="text-sm uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Confirm Cancellation
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#251218]/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)}>
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#c9969e] to-[#251218] rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

            <div className="relative p-10 text-white">
              <h3
                className="text-3xl mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Upgrade to Gold Standard
              </h3>
              <p
                className="text-lg text-white/90 mb-8"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                Unlock the complete AVERRA experience with exclusive Gold Standard benefits
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Monthly live strategy calls with Jayla",
                  "Personalized business audit portal",
                  "Brand spotlight features",
                  "Exclusive resource vault",
                  "First access to new content & tools",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                    <span
                      className="text-base text-white/90"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className="text-4xl"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    $75
                  </span>
                  <span
                    className="text-lg text-white/80"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    / month
                  </span>
                </div>
                <p
                  className="text-sm text-white/70"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Founder pricing • Regular $130/month
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-6 py-4 bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <span
                    className="text-sm uppercase tracking-[0.2em]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    Not Now
                  </span>
                </button>
                <button
                  className="flex-1 px-6 py-4 bg-white text-[#251218] hover:bg-white/90 transition-all duration-300 shadow-lg"
                >
                  <span
                    className="text-sm uppercase tracking-[0.2em]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    Upgrade Now
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
}
