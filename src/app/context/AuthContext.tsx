import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { createAppError, logError, type AppError } from "@/utils/errorHandling";

export type MembershipTier = "blueprint" | "gold-standard" | null;

interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  membershipTier: MembershipTier;
  subscriptionStatus: "active" | "canceled" | "past_due" | "expired";
  stripeCustomerId?: string;
  hasCompletedOnboarding: boolean;
  joinedAt: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: AppError | null;
  login: (email: string, password: string) => Promise<{ user: User | null; error: AppError | null }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<{ error: AppError | null }>;
  checkSubscriptionStatus: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AppError | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user from Supabase session
  const loadUserFromSession = useCallback(async () => {
    try {
      setAuthError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        const appError = createAppError(sessionError, "auth", "Unable to verify session. Please log in again.");
        logError("loadUserFromSession - getSession", appError);
        setAuthError(appError);
        setUser(null);
        return { error: appError };
      }

      if (!session?.user) {
        setUser(null);
        return { error: null };
      }

      // Load profile from database with timeout
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Profile load timeout")), 10000)
      );

      const { data: profile, error } = await Promise.race([
        profilePromise,
        timeoutPromise,
      ]).catch(err => {
        return { data: null, error: err };
      }) as any;

      if (error) {
        const appError = createAppError(
          error,
          "database",
          "Unable to load your profile. Please try refreshing the page."
        );
        logError("loadUserFromSession - profile load", appError);
        setAuthError(appError);
        setUser(null);
        return { error: appError };
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || "Member",
          username: profile.username,
          membershipTier: profile.membership_type as MembershipTier,
          subscriptionStatus: profile.membership_status || "active",
          stripeCustomerId: profile.stripe_customer_id,
          hasCompletedOnboarding: !!profile.username,
          joinedAt: profile.created_at,
          isAdmin: profile.is_admin || false,
        };
        setUser(userData);
        return { error: null };
      }

      return { error: null };
    } catch (error) {
      const appError = createAppError(error, "auth", "Unable to verify your session.");
      logError("loadUserFromSession - unexpected error", appError);
      setAuthError(appError);
      setUser(null);
      return { error: appError };
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    loadUserFromSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUserFromSession();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ user: User | null; error: AppError | null }> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const appError = createAppError(error, "auth");
        logError("login - signInWithPassword", appError);
        setAuthError(appError);
        setIsLoading(false);
        return { user: null, error: appError };
      }

      if (!data.user) {
        const appError = createAppError(
          new Error("No user returned"),
          "auth",
          "Login failed. Please try again."
        );
        logError("login - no user returned", appError);
        setAuthError(appError);
        setIsLoading(false);
        return { user: null, error: appError };
      }

      // Load profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        const appError = createAppError(
          profileError,
          "database",
          "Unable to load your profile. Please try again."
        );
        logError("login - profile load", appError);
        setAuthError(appError);
        setIsLoading(false);
        return { user: null, error: appError };
      }

      const userData: User = {
        id: profile.id,
        email: profile.email,
        name: profile.full_name || "Member",
        username: profile.username,
        membershipTier: profile.membership_type as MembershipTier,
        subscriptionStatus: profile.membership_status || "active",
        stripeCustomerId: profile.stripe_customer_id,
        hasCompletedOnboarding: !!profile.username,
        joinedAt: profile.created_at,
        isAdmin: profile.is_admin || false,
      };

      setUser(userData);
      setIsLoading(false);
      return { user: userData, error: null };
    } catch (error) {
      const appError = createAppError(error, "auth", "Login failed. Please try again.");
      logError("login - unexpected error", appError);
      setAuthError(appError);
      setIsLoading(false);
      return { user: null, error: appError };
    }
  };

  const signOut = async () => {
    try {
      setAuthError(null);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      const appError = createAppError(error, "auth", "Sign out failed. Please try again.");
      logError("signOut", appError);
      setAuthError(appError);
      // Still clear user even if sign out fails
      setUser(null);
    }
  };

  const refreshUser = async (): Promise<{ error: AppError | null }> => {
    setIsLoading(true);
    const result = await loadUserFromSession();
    return result;
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const checkSubscriptionStatus = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Admins bypass subscription checks
      if (user.isAdmin) return true;

      // Check if subscription is active
      return user.subscriptionStatus === "active";
    } catch (error) {
      const appError = createAppError(error, "subscription", "Unable to verify subscription status.");
      logError("checkSubscriptionStatus", appError);
      setAuthError(appError);
      return false;
    }
  };

  const clearError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        authError,
        login,
        signOut,
        updateUser,
        refreshUser,
        checkSubscriptionStatus,
        clearError,
      }}
    >
      {!isInitialized ? (
        <div className="flex min-h-screen items-center justify-center bg-[#fdf5f7]">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#c9969e] border-t-transparent mx-auto"></div>
            <p className="text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
              Loading...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
