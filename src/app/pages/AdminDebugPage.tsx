import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/utils/supabase/client";

export function AdminDebugPage() {
  const { user, isLoading } = useAuth();
  const [dbUser, setDbUser] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkDatabase = async () => {
    if (!user) return;

    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error("Database check error:", error);
      } else {
        setDbUser(data);
      }
    } catch (error) {
      console.error("Database check error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkDatabase();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#fdf5f7] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-8">
          <h1
            className="text-2xl text-[#251218] mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Admin Debug & Status Check
          </h1>

          {/* Auth Loading */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2
              className="text-lg text-[#251218] mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Auth Loading State
            </h2>
            <p className="text-sm" style={{ fontFamily: "Lora, serif" }}>
              {isLoading ? "⏳ Loading..." : "✅ Loaded"}
            </p>
          </div>

          {/* Logged In User */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2
              className="text-lg text-[#251218] mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Current User (Auth Context)
            </h2>
            {user ? (
              <div className="space-y-2 text-sm" style={{ fontFamily: "Lora, serif" }}>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Username:</strong> {user.username || "Not set"}</p>
                <p><strong>Membership Tier:</strong> {user.membershipTier || "None"}</p>
                <p><strong>Subscription Status:</strong> {user.subscriptionStatus}</p>
                <p><strong>Onboarding Complete:</strong> {user.hasCompletedOnboarding ? "Yes" : "No"}</p>
                <p className="text-lg font-bold">
                  <strong>IS ADMIN:</strong>{" "}
                  <span className={user.isAdmin ? "text-green-600" : "text-red-600"}>
                    {user.isAdmin ? "✅ TRUE" : "❌ FALSE"}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-600" style={{ fontFamily: "Lora, serif" }}>
                Not logged in
              </p>
            )}
          </div>

          {/* Database User */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h2
                className="text-lg text-[#251218]"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                Database User (Supabase)
              </h2>
              <button
                onClick={checkDatabase}
                disabled={isChecking || !user}
                className="px-3 py-1 bg-[#251218] text-white text-sm rounded hover:bg-[#c9969e] hover:text-[#251218] transition-colors disabled:opacity-50"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {isChecking ? "Checking..." : "Refresh"}
              </button>
            </div>
            {dbUser ? (
              <div className="space-y-2 text-sm" style={{ fontFamily: "Lora, serif" }}>
                <p><strong>ID:</strong> {dbUser.id}</p>
                <p><strong>Email:</strong> {dbUser.email}</p>
                <p><strong>Full Name:</strong> {dbUser.full_name || "Not set"}</p>
                <p><strong>Username:</strong> {dbUser.username || "Not set"}</p>
                <p><strong>Membership Type:</strong> {dbUser.membership_type || "None"}</p>
                <p><strong>Membership Status:</strong> {dbUser.membership_status || "None"}</p>
                <p className="text-lg font-bold">
                  <strong>IS_ADMIN (Database):</strong>{" "}
                  <span className={dbUser.is_admin ? "text-green-600" : "text-red-600"}>
                    {dbUser.is_admin ? "✅ TRUE" : "❌ FALSE"}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600" style={{ fontFamily: "Lora, serif" }}>
                {user ? "Click Refresh to check database" : "Log in to check database"}
              </p>
            )}
          </div>

          {/* Diagnosis */}
          {user && dbUser && (
            <div className={`p-4 rounded-lg ${
              user.isAdmin && dbUser.is_admin
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}>
              <h2
                className="text-lg text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                Diagnosis
              </h2>
              {user.isAdmin && dbUser.is_admin ? (
                <div className="text-sm space-y-2" style={{ fontFamily: "Lora, serif" }}>
                  <p className="text-green-700 font-bold">✅ Admin status is correctly set!</p>
                  <p className="text-green-700">You should be able to access all admin routes.</p>
                  <p className="text-green-700">Try navigating to <code>/admin/dashboard</code></p>
                </div>
              ) : !dbUser.is_admin ? (
                <div className="text-sm space-y-2" style={{ fontFamily: "Lora, serif" }}>
                  <p className="text-red-700 font-bold">❌ Admin status NOT set in database</p>
                  <p className="text-red-700">Run this SQL in Supabase Studio:</p>
                  <pre className="bg-red-100 p-2 rounded mt-2 overflow-x-auto text-xs">
{`UPDATE profiles
SET is_admin = true
WHERE email = '${user.email}';`}
                  </pre>
                  <p className="text-red-700 mt-2">Then log out and log back in.</p>
                </div>
              ) : (
                <div className="text-sm space-y-2" style={{ fontFamily: "Lora, serif" }}>
                  <p className="text-red-700 font-bold">❌ Admin status set in database but not loaded in auth context</p>
                  <p className="text-red-700">Try logging out and logging back in.</p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3
              className="text-sm text-[#251218] font-semibold mb-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Quick Setup Instructions
            </h3>
            <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside" style={{ fontFamily: "Lora, serif" }}>
              <li>Go to Supabase Studio → SQL Editor</li>
              <li>Run: <code>ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;</code></li>
              <li>Run: <code>UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';</code></li>
              <li>Log out from this app</li>
              <li>Log back in</li>
              <li>Return to this page to verify</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
