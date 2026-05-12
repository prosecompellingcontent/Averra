import { useState } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { useAuth } from "@/app/context/AuthContext";
import { User, Mail, CreditCard, Bell, Shield, Download } from "lucide-react";

export function AccountPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"profile" | "billing" | "notifications" | "security">("profile");

  if (!user) return null;

  const tierLabel = user.membershipTier === "gold-standard" ? "Gold Standard" : "Blueprint";

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
              Account Settings
            </h1>
            <p
              className="text-lg text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Manage your profile and preferences
            </p>
          </div>
        </div>

        <div className="px-12 py-12">
          <div className="max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-[#c9969e]/10 sticky top-8">
                  <nav className="space-y-2">
                    {[
                      { id: "profile", label: "Profile", icon: User },
                      { id: "billing", label: "Billing", icon: CreditCard },
                      { id: "notifications", label: "Notifications", icon: Bell },
                      { id: "security", label: "Security", icon: Shield },
                    ].map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id as typeof activeSection)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                            isActive
                              ? "bg-white/80 text-[#251218] shadow-sm"
                              : "text-[#251218]/60 hover:text-[#251218] hover:bg-white/40"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${isActive ? "text-[#c9969e]" : "text-[#251218]/30"}`}
                            strokeWidth={1.5}
                          />
                          <span
                            className="text-sm"
                            style={{ fontFamily: "Lora, serif", fontWeight: isActive ? 500 : 300 }}
                          >
                            {section.label}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                {activeSection === "profile" && (
                  <div className="space-y-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10">
                      <h2
                        className="text-2xl text-[#251218] mb-6"
                        style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                      >
                        Profile Information
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label
                            className="block text-sm text-[#251218]/60 mb-2"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user.name}
                            className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                            style={{ fontFamily: "Lora, serif", color: "#251218" }}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-sm text-[#251218]/60 mb-2"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={user.email}
                            className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                            style={{ fontFamily: "Lora, serif", color: "#251218" }}
                          />
                        </div>

                        <button className="px-8 py-3 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300">
                          <span
                            className="text-xs uppercase tracking-[0.2em]"
                            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                          >
                            Save Changes
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "billing" && (
                  <div className="space-y-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10">
                      <h2
                        className="text-2xl text-[#251218] mb-6"
                        style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                      >
                        Membership & Billing
                      </h2>

                      <div className="space-y-6">
                        {/* Current Plan */}
                        <div className="bg-gradient-to-br from-[#fdf5f7] to-[#fbf0f3] rounded-xl p-6 border border-[#c9969e]/10">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p
                                className="text-xs uppercase tracking-[0.15em] text-[#c9969e] mb-2"
                                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                              >
                                Current Plan
                              </p>
                              <h3
                                className="text-2xl text-[#251218]"
                                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                              >
                                {tierLabel}
                              </h3>
                            </div>
                            <div className="text-right">
                              <p
                                className="text-xs text-[#251218]/60 mb-1"
                                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                              >
                                Status
                              </p>
                              <span
                                className="inline-block px-4 py-1.5 bg-white/60 rounded-full text-xs text-[#251218]"
                                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                              >
                                {user.subscriptionStatus}
                              </span>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-[#c9969e]/20 to-transparent mb-4"></div>

                          <p
                            className="text-sm text-[#251218]/60"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            Next billing date: June 1, 2026
                          </p>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <h3
                            className="text-lg text-[#251218] mb-4"
                            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                          >
                            Payment Method
                          </h3>

                          <div className="bg-white/60 border border-[#251218]/10 rounded-xl p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <CreditCard className="w-8 h-8 text-[#c9969e]" strokeWidth={1.5} />
                              <div>
                                <p
                                  className="text-sm text-[#251218]"
                                  style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                                >
                                  •••• •••• •••• 4242
                                </p>
                                <p
                                  className="text-xs text-[#251218]/60"
                                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                                >
                                  Expires 12/2028
                                </p>
                              </div>
                            </div>
                            <button
                              className="text-sm text-[#c9969e] hover:underline"
                              style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                            >
                              Update
                            </button>
                          </div>
                        </div>

                        {/* Billing History */}
                        <div>
                          <h3
                            className="text-lg text-[#251218] mb-4"
                            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                          >
                            Billing History
                          </h3>

                          <div className="space-y-3">
                            {[
                              { date: "May 1, 2026", amount: "$497", status: "Paid" },
                              { date: "Apr 1, 2026", amount: "$497", status: "Paid" },
                            ].map((invoice, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-white/60 border border-[#251218]/5 rounded-xl"
                              >
                                <div>
                                  <p
                                    className="text-sm text-[#251218]"
                                    style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                                  >
                                    {invoice.date}
                                  </p>
                                  <p
                                    className="text-xs text-[#251218]/60"
                                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                                  >
                                    {invoice.status}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <p
                                    className="text-sm text-[#251218]"
                                    style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                                  >
                                    {invoice.amount}
                                  </p>
                                  <button className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors">
                                    <Download className="w-4 h-4 text-[#251218]/60" strokeWidth={1.5} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "notifications" && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10">
                    <h2
                      className="text-2xl text-[#251218] mb-6"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      Notification Preferences
                    </h2>

                    <div className="space-y-6">
                      {[
                        { label: "New Content Releases", description: "Get notified when new frameworks or chapters are available" },
                        { label: "Community Activity", description: "Updates on discussions you're following" },
                        { label: "Monthly Newsletter", description: "Business insights and member highlights" },
                        { label: "Strategy Call Reminders", description: "Reminders before upcoming calls (Gold Standard only)" },
                      ].map((setting, index) => (
                        <div key={index} className="flex items-start justify-between py-4 border-b border-[#251218]/5 last:border-0">
                          <div className="flex-1">
                            <p
                              className="text-base text-[#251218] mb-1"
                              style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                            >
                              {setting.label}
                            </p>
                            <p
                              className="text-sm text-[#251218]/60"
                              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                            >
                              {setting.description}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-[#251218]/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#c9969e] peer-checked:to-[#251218]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "security" && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10">
                    <h2
                      className="text-2xl text-[#251218] mb-6"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      Security Settings
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label
                          className="block text-sm text-[#251218]/60 mb-2"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                          style={{ fontFamily: "Lora, serif" }}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm text-[#251218]/60 mb-2"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                          style={{ fontFamily: "Lora, serif" }}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm text-[#251218]/60 mb-2"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                          style={{ fontFamily: "Lora, serif" }}
                        />
                      </div>

                      <button className="px-8 py-3 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300">
                        <span
                          className="text-xs uppercase tracking-[0.2em]"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          Update Password
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
