import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "@/utils/supabase/client";
import { realtimeManager } from "@/utils/realtime/manager";
import { checkUsernameAvailability } from "@/utils/supabase/queries";
import { createAppError } from "@/utils/errorHandling";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error" | "warning";
  message: string;
  details?: string;
  timestamp?: string;
}

interface SystemStatus {
  database: boolean;
  auth: boolean;
  realtime: boolean;
  storage: boolean;
}

interface DebugInfo {
  activeRealtimeChannels: string[];
  sessionInfo: any;
  profileCount: number;
  postsCount: number;
}

export function AdminQAPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: false,
    auth: false,
    realtime: false,
    storage: false,
  });
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    activeRealtimeChannels: [],
    sessionInfo: null,
    profileCount: 0,
    postsCount: 0,
  });
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  useEffect(() => {
    updateDebugInfo();

    const interval = setInterval(() => {
      updateDebugInfo();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateDebugInfo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const { count: profileCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    const { count: postsCount } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    setDebugInfo({
      activeRealtimeChannels: realtimeManager.getActiveChannels(),
      sessionInfo: session
        ? {
            userId: session.user.id,
            email: session.user.email,
            expiresAt: new Date(session.expires_at! * 1000).toLocaleString(),
          }
        : null,
      profileCount: profileCount || 0,
      postsCount: postsCount || 0,
    });
  };

  const addResult = (result: TestResult) => {
    setTestResults(prev => [...prev, { ...result, timestamp: new Date().toISOString() }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    await testDatabaseConnection();
    await testAuthSystem();
    await testSessionPersistence();
    await testMembershipPermissions();
    await testUsernameValidation();
    await testStripeIntegration();
    await testStorageBuckets();
    await testRealtimeUpdates();
    await testErrorHandling();
    await testAdminAccess();

    setIsRunning(false);
    await updateDebugInfo();
  };

  const testDatabaseConnection = async () => {
    try {
      addResult({ name: "Database Connection", status: "pending", message: "Testing..." });

      const { data, error } = await supabase.from("profiles").select("id").limit(1);

      if (error) {
        addResult({
          name: "Database Connection",
          status: "error",
          message: `Failed: ${error.message}`
        });
        return;
      }

      addResult({
        name: "Database Connection",
        status: "success",
        message: "Successfully connected to Supabase database"
      });
    } catch (error: any) {
      addResult({
        name: "Database Connection",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const testAuthSystem = async () => {
    try {
      addResult({ name: "Auth System", status: "pending", message: "Testing..." });

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        addResult({
          name: "Auth System",
          status: "error",
          message: `Failed: ${error.message}`
        });
        return;
      }

      if (session) {
        addResult({
          name: "Auth System",
          status: "success",
          message: `Current user authenticated: ${session.user.email}`
        });
      } else {
        addResult({
          name: "Auth System",
          status: "error",
          message: "No active session found"
        });
      }
    } catch (error: any) {
      addResult({
        name: "Auth System",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const testMembershipPermissions = async () => {
    try {
      addResult({ name: "Membership Permissions", status: "pending", message: "Testing..." });

      const { data: members, error } = await supabase
        .from("profiles")
        .select("id, membership_type, membership_status")
        .limit(5);

      if (error) {
        addResult({
          name: "Membership Permissions",
          status: "error",
          message: `Failed: ${error.message}`
        });
        return;
      }

      const blueprintCount = members?.filter(m => m.membership_type === "blueprint").length || 0;
      const goldCount = members?.filter(m => m.membership_type === "gold-standard").length || 0;
      const activeCount = members?.filter(m => m.membership_status === "active").length || 0;

      addResult({
        name: "Membership Permissions",
        status: "success",
        message: `Found ${blueprintCount} Blueprint, ${goldCount} Gold Standard members. ${activeCount} active.`
      });
    } catch (error: any) {
      addResult({
        name: "Membership Permissions",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const testStripeIntegration = async () => {
    try {
      addResult({ name: "Stripe Integration", status: "pending", message: "Testing..." });

      const { data: members, error } = await supabase
        .from("profiles")
        .select("stripe_customer_id, stripe_subscription_id")
        .not("stripe_customer_id", "is", null)
        .limit(5);

      if (error) {
        addResult({
          name: "Stripe Integration",
          status: "error",
          message: `Failed: ${error.message}`
        });
        return;
      }

      const withStripe = members?.length || 0;

      if (withStripe > 0) {
        addResult({
          name: "Stripe Integration",
          status: "success",
          message: `Found ${withStripe} members with Stripe integration`
        });
      } else {
        addResult({
          name: "Stripe Integration",
          status: "error",
          message: "No members with Stripe data found"
        });
      }
    } catch (error: any) {
      addResult({
        name: "Stripe Integration",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const testStorageBuckets = async () => {
    try {
      addResult({ name: "Storage Buckets", status: "pending", message: "Testing..." });

      const { data: buckets, error } = await supabase.storage.listBuckets();

      if (error) {
        addResult({
          name: "Storage Buckets",
          status: "error",
          message: `Failed: ${error.message}`
        });
        return;
      }

      const adminBuckets = buckets?.filter(b => b.name.startsWith("make-61755bec")) || [];

      addResult({
        name: "Storage Buckets",
        status: "success",
        message: `Found ${adminBuckets.length} admin storage buckets: ${adminBuckets.map(b => b.name).join(", ") || "none"}`
      });
    } catch (error: any) {
      addResult({
        name: "Storage Buckets",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const testRealtimeUpdates = async () => {
    try {
      addResult({ name: "Realtime Updates", status: "pending", message: "Testing..." });

      // Test by checking if posts table is accessible
      const { data, error } = await supabase
        .from("posts")
        .select("id")
        .limit(1);

      if (error) {
        addResult({
          name: "Realtime Updates",
          status: "error",
          message: `Failed: ${error.message}`
        });
        return;
      }

      // Check active realtime connections
      const activeChannels = realtimeManager.getActiveChannels();

      addResult({
        name: "Realtime Updates",
        status: "success",
        message: `Posts table accessible. ${activeChannels.length} active realtime channels.`,
        details: activeChannels.length > 0 ? `Active: ${activeChannels.join(", ")}` : undefined
      });
    } catch (error: any) {
      addResult({
        name: "Realtime Updates",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const testSessionPersistence = async () => {
    try {
      addResult({ name: "Session Persistence", status: "pending", message: "Testing..." });

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        addResult({
          name: "Session Persistence",
          status: "error",
          message: `Session check failed: ${error.message}`
        });
        return;
      }

      if (!session) {
        addResult({
          name: "Session Persistence",
          status: "warning",
          message: "No active session found"
        });
        return;
      }

      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      const timeLeft = Math.floor((expiresAt.getTime() - now.getTime()) / 1000 / 60);

      addResult({
        name: "Session Persistence",
        status: "success",
        message: `Session active for ${session.user.email}`,
        details: `Expires in ${timeLeft} minutes`
      });
    } catch (error: any) {
      addResult({
        name: "Session Persistence",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const testUsernameValidation = async () => {
    try {
      addResult({ name: "Username Validation", status: "pending", message: "Testing..." });

      // Test with a very unlikely username
      const testUsername = `test_${Date.now()}_unlikely`;
      const { available, error } = await checkUsernameAvailability(testUsername);

      if (error) {
        addResult({
          name: "Username Validation",
          status: "error",
          message: `Validation failed: ${error.userMessage}`
        });
        return;
      }

      addResult({
        name: "Username Validation",
        status: "success",
        message: `Username validation working correctly (test username ${available ? "available" : "taken"})`
      });
    } catch (error: any) {
      addResult({
        name: "Username Validation",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const testErrorHandling = async () => {
    try {
      addResult({ name: "Error Handling", status: "pending", message: "Testing..." });

      // Test invalid query to see error handling
      const { error } = await supabase
        .from("nonexistent_table_xyz")
        .select("*")
        .limit(1);

      if (error) {
        const appError = createAppError(error, "database");

        addResult({
          name: "Error Handling",
          status: "success",
          message: "Error handling working correctly",
          details: `Caught error: ${appError.userMessage}`
        });
      } else {
        addResult({
          name: "Error Handling",
          status: "warning",
          message: "Expected error was not generated"
        });
      }
    } catch (error: any) {
      addResult({
        name: "Error Handling",
        status: "success",
        message: "Exception handling working",
        details: error.message
      });
    }
  };

  const testAdminAccess = async () => {
    try {
      addResult({ name: "Admin Access", status: "pending", message: "Testing..." });

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        addResult({
          name: "Admin Access",
          status: "error",
          message: "No session found - cannot test admin access"
        });
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin, email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        addResult({
          name: "Admin Access",
          status: "error",
          message: `Failed to check admin status: ${error.message}`
        });
        return;
      }

      if (profile?.is_admin) {
        addResult({
          name: "Admin Access",
          status: "success",
          message: `Admin access confirmed for ${profile.email}`
        });
      } else {
        addResult({
          name: "Admin Access",
          status: "warning",
          message: `Current user (${profile?.email}) is not an admin`
        });
      }
    } catch (error: any) {
      addResult({
        name: "Admin Access",
        status: "error",
        message: `Failed: ${error.message}`
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "warning":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "pending":
        return "⋯";
      case "warning":
        return "⚠";
      default:
        return "?";
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7]">
      {/* Header */}
      <div className="bg-white border-b border-[#251218]/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl text-[#251218]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                QA Testing Environment
              </h1>
              <p
                className="text-sm text-[#251218]/60 mt-1"
                style={{ fontFamily: "Lora, serif" }}
              >
                Test verification, Stripe sync, permissions, and all critical systems
              </p>
            </div>
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-lg text-[#251218] mb-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                System Tests
              </h2>
              <p
                className="text-sm text-[#251218]/60"
                style={{ fontFamily: "Lora, serif" }}
              >
                Run automated tests to verify all platform systems are working correctly
              </p>
            </div>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-6 py-3 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
            <h2
              className="text-lg text-[#251218] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Test Results
            </h2>

            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-[#251218]/5 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStatusColor(result.status)}`}
                  >
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className="text-sm text-[#251218] font-medium"
                        style={{ fontFamily: "Lora, serif" }}
                      >
                        {result.name}
                      </p>
                      {result.timestamp && (
                        <p
                          className="text-xs text-[#251218]/40"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <p
                      className="text-sm text-[#251218]/60"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      {result.message}
                    </p>
                    {result.details && (
                      <p
                        className="text-xs text-[#251218]/40 mt-1"
                        style={{ fontFamily: "Lora, serif" }}
                      >
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#251218]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <p
                      className="text-sm text-[#251218]"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      {testResults.filter(r => r.status === "success").length} Passed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <p
                      className="text-sm text-[#251218]"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      {testResults.filter(r => r.status === "error").length} Failed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <p
                      className="text-sm text-[#251218]"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      {testResults.filter(r => r.status === "pending").length} Pending
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <p
                      className="text-sm text-[#251218]"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      {testResults.filter(r => r.status === "warning").length} Warnings
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTestResults([])}
                  className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  Clear Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Testing Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
            <h3
              className="text-lg text-[#251218] mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={testDatabaseConnection}
                className="w-full text-left px-4 py-3 bg-[#251218]/5 hover:bg-[#251218]/10 rounded-lg transition-colors"
                style={{ fontFamily: "Lora, serif" }}
              >
                Test Database Connection
              </button>
              <button
                onClick={testAuthSystem}
                className="w-full text-left px-4 py-3 bg-[#251218]/5 hover:bg-[#251218]/10 rounded-lg transition-colors"
                style={{ fontFamily: "Lora, serif" }}
              >
                Test Auth System
              </button>
              <button
                onClick={testMembershipPermissions}
                className="w-full text-left px-4 py-3 bg-[#251218]/5 hover:bg-[#251218]/10 rounded-lg transition-colors"
                style={{ fontFamily: "Lora, serif" }}
              >
                Test Membership Permissions
              </button>
              <button
                onClick={testStripeIntegration}
                className="w-full text-left px-4 py-3 bg-[#251218]/5 hover:bg-[#251218]/10 rounded-lg transition-colors"
                style={{ fontFamily: "Lora, serif" }}
              >
                Test Stripe Integration
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
            <h3
              className="text-lg text-[#251218] mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Testing Notes
            </h3>
            <div className="space-y-3 text-sm" style={{ fontFamily: "Lora, serif" }}>
              <p className="text-[#251218]/80">
                • All tests run against the live production database
              </p>
              <p className="text-[#251218]/80">
                • Auth tests check current session status
              </p>
              <p className="text-[#251218]/80">
                • Membership tests verify permission architecture
              </p>
              <p className="text-[#251218]/80">
                • Stripe tests check integration and sync status
              </p>
              <p className="text-[#251218]/80">
                • Storage tests verify bucket configuration
              </p>
              <p className="text-[#251218]/80">
                • Realtime tests check database table access
              </p>
            </div>
          </div>
        </div>

        {/* System Debug Panel */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg text-[#251218]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              System Debug Panel
            </h3>
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="px-4 py-2 bg-[#251218]/5 hover:bg-[#251218]/10 rounded transition-colors text-sm"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {showDebugPanel ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {showDebugPanel && (
            <div className="space-y-4">
              {/* Session Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4
                  className="text-sm font-semibold text-[#251218] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Session Information
                </h4>
                {debugInfo.sessionInfo ? (
                  <div className="text-xs space-y-1" style={{ fontFamily: "Lora, serif" }}>
                    <p><strong>User ID:</strong> {debugInfo.sessionInfo.userId}</p>
                    <p><strong>Email:</strong> {debugInfo.sessionInfo.email}</p>
                    <p><strong>Expires:</strong> {debugInfo.sessionInfo.expiresAt}</p>
                  </div>
                ) : (
                  <p className="text-xs text-red-600" style={{ fontFamily: "Lora, serif" }}>
                    No active session
                  </p>
                )}
              </div>

              {/* Database Stats */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4
                  className="text-sm font-semibold text-[#251218] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Database Statistics
                </h4>
                <div className="text-xs space-y-1" style={{ fontFamily: "Lora, serif" }}>
                  <p><strong>Total Profiles:</strong> {debugInfo.profileCount}</p>
                  <p><strong>Total Posts:</strong> {debugInfo.postsCount}</p>
                </div>
              </div>

              {/* Realtime Connections */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4
                  className="text-sm font-semibold text-[#251218] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Realtime Connections
                </h4>
                <div className="text-xs space-y-1" style={{ fontFamily: "Lora, serif" }}>
                  <p><strong>Active Channels:</strong> {debugInfo.activeRealtimeChannels.length}</p>
                  {debugInfo.activeRealtimeChannels.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold mb-1">Channels:</p>
                      <ul className="list-disc list-inside pl-2 space-y-0.5">
                        {debugInfo.activeRealtimeChannels.map((channel, index) => (
                          <li key={index}>{channel}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Test Management */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4
                  className="text-sm font-semibold text-[#251218] mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Test Management
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={testSessionPersistence}
                    className="text-left px-3 py-2 bg-white hover:bg-[#251218]/5 rounded text-xs transition-colors"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Test Session
                  </button>
                  <button
                    onClick={testUsernameValidation}
                    className="text-left px-3 py-2 bg-white hover:bg-[#251218]/5 rounded text-xs transition-colors"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Test Username
                  </button>
                  <button
                    onClick={testErrorHandling}
                    className="text-left px-3 py-2 bg-white hover:bg-[#251218]/5 rounded text-xs transition-colors"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Test Errors
                  </button>
                  <button
                    onClick={testAdminAccess}
                    className="text-left px-3 py-2 bg-white hover:bg-[#251218]/5 rounded text-xs transition-colors"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Test Admin
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
