import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function AdminSetupPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSetAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/admin/set-admin`;

      console.log("Attempting to set admin status for:", email);
      console.log("Server URL:", serverUrl);

      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Server returned invalid response. The edge function may not be deployed.");
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      setMessage(`Admin status set successfully for ${email}. Please log out and log back in.`);
      setEmail("");
    } catch (err: any) {
      console.error("Admin setup error:", err);

      // If it's a failed fetch, just guide to SQL method instead of showing error
      if (err.message === "Failed to fetch") {
        setMessage("Server method unavailable. Please use the SQL method below instead.");
        setEmail("");
        return;
      }

      let errorMessage = err.message || "Failed to set admin status";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7] flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-[#251218]/10 p-8">
        <h1
          className="text-2xl text-[#251218] mb-2"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Admin Setup
        </h1>
        <p
          className="text-sm text-[#251218]/60 mb-6"
          style={{ fontFamily: "Lora, serif" }}
        >
          Enter your email to grant admin access
        </p>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p
              className="text-sm text-green-600"
              style={{ fontFamily: "Lora, serif" }}
            >
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p
              className="text-sm text-red-600"
              style={{ fontFamily: "Lora, serif" }}
            >
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSetAdmin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-[#251218] mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none transition-colors text-[#251218]"
              style={{ fontFamily: "Lora, serif" }}
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
            {isLoading ? "Setting Admin..." : "Set Admin Status"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p
            className="text-xs text-yellow-800 mb-2"
            style={{ fontFamily: "Lora, serif" }}
          >
            <strong>Note:</strong> This page should only be used during initial setup.
            After setting your admin account, you should remove public access to this route.
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p
            className="text-xs text-blue-800 font-semibold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Alternative: Set Admin Via SQL
          </p>
          <p
            className="text-xs text-blue-700 mb-2"
            style={{ fontFamily: "Lora, serif" }}
          >
            If the server method fails, run this SQL in Supabase Studio:
          </p>
          <pre
            className="bg-blue-100 p-2 rounded text-xs overflow-x-auto"
            style={{ fontFamily: "monospace" }}
          >
{`-- First, add the column if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Then set admin status for your email
UPDATE profiles
SET is_admin = true
WHERE email = 'your@email.com';`}
          </pre>
        </div>
      </div>
    </div>
  );
}
