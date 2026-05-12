import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import {
  Home,
  Users,
  FileText,
  BookOpen,
  Bookmark,
  StickyNote,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Video,
  ClipboardList,
  Star,
  Package,
  Sparkles,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: any;
}

const blueprintNavItems: NavItem[] = [
  { label: "Home", path: "/members/dashboard", icon: Home },
  { label: "Community", path: "/members/community", icon: Users },
  { label: "Frameworks", path: "/members/frameworks", icon: FileText },
  { label: "Resource Library", path: "/members/library", icon: BookOpen },
  { label: "Notes", path: "/members/notes", icon: StickyNote },
  { label: "Saved Content", path: "/members/saved", icon: Bookmark },
  { label: "Progress", path: "/members/progress", icon: TrendingUp },
];

const goldStandardNavItems: NavItem[] = [
  { label: "Home", path: "/members/dashboard", icon: Home },
  { label: "Strategy Calls", path: "/members/strategy-calls", icon: Video },
  { label: "Business Audit", path: "/members/audit", icon: ClipboardList },
  { label: "Priority Community", path: "/members/community", icon: Users },
  { label: "Brand Spotlight", path: "/members/spotlight", icon: Star },
  { label: "Resource Vault", path: "/members/vault", icon: Package },
  { label: "First Access", path: "/members/first-access", icon: Sparkles },
  { label: "Progress", path: "/members/progress", icon: TrendingUp },
];

export function MemberSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const navItems =
    user.membershipTier === "gold-standard"
      ? goldStandardNavItems
      : blueprintNavItems;

  const tierLabel =
    user.membershipTier === "gold-standard" ? "Gold Standard" : "Blueprint";

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-gradient-to-b from-[#fdf5f7] to-[#fbf0f3] border-r border-[#251218]/5 flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-[#251218]/5">
        <Link to="/" className="block mb-8 group">
          <h1
            className="text-3xl tracking-tight text-[#251218] group-hover:text-[#c9969e] transition-colors duration-300"
            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            AVERRA
          </h1>
        </Link>

        <div className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#c9969e]/20 rounded-full">
          <p
            className="text-[9px] uppercase tracking-[0.25em] text-[#c9969e]"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            {tierLabel}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-white/80 backdrop-blur-sm text-[#251218] shadow-sm"
                  : "text-[#251218]/50 hover:text-[#251218] hover:bg-white/40"
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#c9969e] to-[#251218] rounded-r"></div>
              )}

              <Icon
                className={`w-[18px] h-[18px] transition-colors ${
                  isActive ? "text-[#c9969e]" : "text-[#251218]/30 group-hover:text-[#c9969e]"
                }`}
                strokeWidth={1.5}
              />
              <span
                className="text-[13px] tracking-tight"
                style={{ fontFamily: "Lora, serif", fontWeight: isActive ? 500 : 300 }}
              >
                {item.label}
              </span>

              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-[#c9969e]/5 to-transparent opacity-0 ${!isActive ? 'group-hover:opacity-100' : ''} transition-opacity duration-300 -z-10`}></div>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#251218]/10 to-transparent my-6"></div>

        {/* Secondary Nav */}
        {[
          { label: "Account", path: "/members/account", icon: Settings },
          { label: "Support", path: "/members/support", icon: HelpCircle },
        ].map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-white/80 text-[#251218]"
                  : "text-[#251218]/40 hover:text-[#251218] hover:bg-white/40"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] ${
                  isActive ? "text-[#c9969e]" : "text-[#251218]/30 group-hover:text-[#c9969e]"
                }`}
                strokeWidth={1.5}
              />
              <span
                className="text-[13px]"
                style={{ fontFamily: "Lora, serif", fontWeight: isActive ? 500 : 300 }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#251218]/5">
        <div className="mb-3 px-4 py-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#251218]/5">
          <p
            className="text-[11px] text-[#251218] mb-0.5 font-medium"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {user.name}
          </p>
          <p
            className="text-[10px] text-[#251218]/40 truncate"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            {user.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 w-full px-4 py-3 text-[#251218]/40 hover:text-[#251218] hover:bg-white/40 rounded-lg transition-all duration-300"
        >
          <LogOut className="w-[18px] h-[18px] group-hover:text-[#c9969e] transition-colors" strokeWidth={1.5} />
          <span
            className="text-[13px]"
            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
