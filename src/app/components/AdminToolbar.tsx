import { useState } from "react";
import { useAdminPreview, PreviewRole } from "@/app/context/AdminPreviewContext";
import {
  Monitor,
  Smartphone,
  User,
  Users,
  UserPlus,
  UserX,
  Shield,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";

export function AdminToolbar() {
  const {
    isAdminPreview,
    previewRole,
    setPreviewRole,
    isMobilePreview,
    setIsMobilePreview,
    isToolbarVisible,
    toggleToolbar,
  } = useAdminPreview();

  const [isExpanded, setIsExpanded] = useState(true);

  if (!isAdminPreview) return null;

  const roles: { value: PreviewRole; label: string; icon: any }[] = [
    { value: "admin", label: "Admin", icon: Shield },
    { value: "blueprint-member", label: "Blueprint Member", icon: User },
    { value: "gold-standard-member", label: "Gold Standard Member", icon: Users },
    { value: "new-member", label: "New Member", icon: UserPlus },
    { value: "expired-member", label: "Expired Member", icon: UserX },
  ];

  const currentRole = roles.find((r) => r.value === previewRole);
  const CurrentIcon = currentRole?.icon || Shield;

  if (!isToolbarVisible) {
    return (
      <button
        onClick={toggleToolbar}
        className="fixed bottom-4 right-4 z-[9999] w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <Menu className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] bg-gradient-to-br from-[#251218] to-[#1a0d11] text-white rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
      style={{ fontFamily: "Montserrat, sans-serif", minWidth: isExpanded ? "320px" : "auto" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs uppercase tracking-[0.15em] font-semibold">Admin Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
          <button
            onClick={toggleToolbar}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Current Role */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-white/60 mb-2 font-semibold">
              Viewing As
            </label>
            <div className="relative">
              <select
                value={previewRole}
                onChange={(e) => setPreviewRole(e.target.value as PreviewRole)}
                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm appearance-none cursor-pointer hover:bg-white/15 transition-colors focus:outline-none focus:border-white/40"
                style={{ fontFamily: "Lora, serif" }}
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value} className="bg-[#251218] text-white">
                    {role.label}
                  </option>
                ))}
              </select>
              <CurrentIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-white/60" />
            </div>
          </div>

          {/* Device Toggle */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-white/60 mb-2 font-semibold">
              Device Preview
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMobilePreview(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  !isMobilePreview
                    ? "bg-white/20 border border-white/30"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setIsMobilePreview(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isMobilePreview
                    ? "bg-white/20 border border-white/30"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="/members/dashboard?admin-preview=true"
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center border border-white/10"
              >
                Dashboard
              </a>
              <a
                href="/members/community?admin-preview=true"
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center border border-white/10"
              >
                Community
              </a>
              <a
                href="/members/library?admin-preview=true"
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center border border-white/10"
              >
                Library
              </a>
              <a
                href="/admin/dashboard?admin-preview=true"
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center border border-white/10"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
