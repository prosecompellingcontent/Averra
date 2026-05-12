import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth, MembershipTier } from "@/app/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredTier?: MembershipTier;
  requireOnboarding?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requiredTier,
  requireOnboarding = true,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, isLoading, checkSubscriptionStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for loading to complete
      if (isLoading) return;

      // Not authenticated
      if (!user) {
        navigate("/members/login");
        return;
      }

      // Admins bypass all checks except authentication
      if (user.isAdmin) {
        return; // Allow access
      }

      // Non-admin checks
      // Check subscription status
      const isSubscriptionActive = await checkSubscriptionStatus();
      if (!isSubscriptionActive) {
        navigate("/members/status");
        return;
      }

      // Check admin requirement (non-admins can't access admin routes)
      if (requireAdmin) {
        navigate("/members/dashboard");
        return;
      }

      // Check onboarding requirement
      if (requireOnboarding && !user.hasCompletedOnboarding) {
        navigate("/members/welcome");
        return;
      }

      // Check tier requirement
      if (requiredTier && user.membershipTier !== requiredTier) {
        // Redirect to their appropriate dashboard
        navigate("/members/dashboard");
        return;
      }
    };

    checkAccess();
  }, [user, isLoading, requiredTier, requireOnboarding, requireAdmin, navigate, checkSubscriptionStatus]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf5f7]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#c9969e] border-t-transparent mx-auto"></div>
          <p className="text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
