import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X, Home, Info, Briefcase, Users, LayoutDashboard, BookOpen, MessageCircle, CreditCard, User, LogOut, HelpCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/members/login");
    setIsOpen(false);
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Info, label: "About", path: "/about" },
    { icon: Briefcase, label: "Services", path: "/services" },
    { icon: Users, label: "Memberships", path: "/membership-options" },
    ...(user ? [
      { icon: LayoutDashboard, label: "Dashboard", path: "/members/dashboard" },
      { icon: BookOpen, label: "Library", path: "/members/library" },
      { icon: MessageCircle, label: "Community", path: "/members/community" },
      { icon: CreditCard, label: "Billing", path: "/members/billing" },
      { icon: User, label: "Profile", path: "/members/account" },
    ] : []),
    { icon: HelpCircle, label: "Need Help", path: "/contact" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-[200] p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-[#c9969e]/20 hover:bg-white transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#251218]" />
        ) : (
          <Menu className="w-6 h-6 text-[#251218]" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-br from-[#fdf5f7] to-[#fbf0f3] z-[180] shadow-2xl overflow-y-auto">
            <div className="p-8 pt-24">
              {/* Brand */}
              <div className="mb-8">
                <h2
                  className="text-3xl text-[#251218]"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  AVERRA
                </h2>
                {user && (
                  <p
                    className="text-sm text-[#251218]/60 mt-2"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Welcome back
                  </p>
                )}
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#251218]/80 hover:bg-white/60 hover:text-[#251218] transition-all group"
                    >
                      <Icon className="w-5 h-5 text-[#c9969e] group-hover:text-[#251218] transition-colors" />
                      <span
                        className="text-base"
                        style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}

                {/* Logout */}
                {user && (
                  <>
                    <div className="h-px bg-[#251218]/10 my-4" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#251218]/80 hover:bg-white/60 hover:text-red-600 transition-all w-full group"
                    >
                      <LogOut className="w-5 h-5 text-[#c9969e] group-hover:text-red-600 transition-colors" />
                      <span
                        className="text-base"
                        style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                      >
                        Logout
                      </span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
