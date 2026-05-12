import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { BlueprintDashboard } from "./BlueprintDashboard";
import { GoldStandardDashboard } from "./GoldStandardDashboard";

export function DashboardRouter() {
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const previewMode = searchParams.get("preview");

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!user) {
      navigate("/members/login");
      return;
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf5f7]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#c9969e] border-t-transparent mx-auto"></div>
          <p className="text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Admin preview mode
  if (user.isAdmin && previewMode) {
    if (previewMode === "gold-standard") {
      return <GoldStandardDashboard />;
    }
    if (previewMode === "blueprint") {
      return <BlueprintDashboard />;
    }
  }

  // Regular member routing based on tier
  if (user.membershipTier === "gold-standard") {
    return <GoldStandardDashboard />;
  }

  // Default to Blueprint dashboard
  return <BlueprintDashboard />;
}
