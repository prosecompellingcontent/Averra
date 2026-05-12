import { useState } from "react";
import { Link } from "react-router";
import { Eye } from "lucide-react";

export function AdminPreviewPage() {
  const [selectedMembership, setSelectedMembership] = useState<"blueprint" | "gold-standard">("blueprint");

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
                Preview Member Dashboards
              </h1>
              <p
                className="text-sm text-[#251218]/60 mt-1"
                style={{ fontFamily: "Lora, serif" }}
              >
                Test and preview both membership experiences
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
        {/* Membership Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6 mb-6">
          <h2
            className="text-lg text-[#251218] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Select Membership Type to Preview
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => setSelectedMembership("blueprint")}
              className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                selectedMembership === "blueprint"
                  ? "border-[#c9969e] bg-[#c9969e]/5"
                  : "border-[#251218]/10 hover:border-[#251218]/20"
              }`}
            >
              <h3
                className="text-xl text-[#251218] mb-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Blueprint Dashboard
              </h3>
              <p
                className="text-sm text-[#251218]/60 mb-4"
                style={{ fontFamily: "Lora, serif" }}
              >
                Preview the Blueprint member experience
              </p>
              <ul
                className="text-sm text-[#251218]/80 space-y-1 text-left"
                style={{ fontFamily: "Lora, serif" }}
              >
                <li>✓ Community access</li>
                <li>✓ Blueprint resources</li>
                <li>✗ No ebook access</li>
              </ul>
            </button>

            <button
              onClick={() => setSelectedMembership("gold-standard")}
              className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                selectedMembership === "gold-standard"
                  ? "border-[#c9969e] bg-[#c9969e]/5"
                  : "border-[#251218]/10 hover:border-[#251218]/20"
              }`}
            >
              <h3
                className="text-xl text-[#251218] mb-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Gold Standard Dashboard
              </h3>
              <p
                className="text-sm text-[#251218]/60 mb-4"
                style={{ fontFamily: "Lora, serif" }}
              >
                Preview the Gold Standard member experience
              </p>
              <ul
                className="text-sm text-[#251218]/80 space-y-1 text-left"
                style={{ fontFamily: "Lora, serif" }}
              >
                <li>✓ All Blueprint access</li>
                <li>✓ Ebook access</li>
                <li>✓ Audiobook access</li>
                <li>✓ Strategy calls</li>
                <li>✓ Premium resources</li>
              </ul>
            </button>
          </div>
        </div>

        {/* Preview Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-[#c9969e]" />
              <h3
                className="text-lg text-[#251218]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Dashboard
              </h3>
            </div>
            <p
              className="text-sm text-[#251218]/60 mb-4"
              style={{ fontFamily: "Lora, serif" }}
            >
              Preview main dashboard view
            </p>
            <a
              href={`/members/dashboard?preview=${selectedMembership}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Preview Dashboard →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-[#c9969e]" />
              <h3
                className="text-lg text-[#251218]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Library
              </h3>
            </div>
            <p
              className="text-sm text-[#251218]/60 mb-4"
              style={{ fontFamily: "Lora, serif" }}
            >
              {selectedMembership === "blueprint"
                ? "Blueprint resources only"
                : "All resources + ebooks"}
            </p>
            <a
              href={`/members/library?preview=${selectedMembership}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Preview Library →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-[#c9969e]" />
              <h3
                className="text-lg text-[#251218]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Community
              </h3>
            </div>
            <p
              className="text-sm text-[#251218]/60 mb-4"
              style={{ fontFamily: "Lora, serif" }}
            >
              Test community features
            </p>
            <a
              href={`/members/community?preview=${selectedMembership}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Preview Community →
            </a>
          </div>

          {selectedMembership === "gold-standard" && (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-[#c9969e]" />
                  <h3
                    className="text-lg text-[#251218]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Ebook Reader
                  </h3>
                </div>
                <p
                  className="text-sm text-[#251218]/60 mb-4"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  Gold Standard exclusive
                </p>
                <a
                  href={`/members/ebook-reader?preview=gold-standard`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  Preview Ebook →
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-[#c9969e]" />
                  <h3
                    className="text-lg text-[#251218]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Strategy Calls
                  </h3>
                </div>
                <p
                  className="text-sm text-[#251218]/60 mb-4"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  Gold Standard exclusive
                </p>
                <a
                  href={`/members/strategy-calls?preview=gold-standard`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  Preview Calls →
                </a>
              </div>
            </>
          )}
        </div>

        {/* Testing Notes */}
        <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6 mt-6">
          <h3
            className="text-lg text-[#251218] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Testing Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4
                className="text-sm text-[#251218] font-medium mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Blueprint Members Should See:
              </h4>
              <ul
                className="text-sm text-[#251218]/70 space-y-1"
                style={{ fontFamily: "Lora, serif" }}
              >
                <li>• Dashboard with community feed</li>
                <li>• Community access</li>
                <li>• Blueprint resources only</li>
                <li>• Upgrade prompts for locked content</li>
                <li>• No ebook reader access</li>
              </ul>
            </div>
            <div>
              <h4
                className="text-sm text-[#251218] font-medium mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Gold Standard Members Should See:
              </h4>
              <ul
                className="text-sm text-[#251218]/70 space-y-1"
                style={{ fontFamily: "Lora, serif" }}
              >
                <li>• Full dashboard access</li>
                <li>• All community features</li>
                <li>• All Blueprint + Gold resources</li>
                <li>• Ebook reader with full access</li>
                <li>• Strategy call scheduling</li>
                <li>• Premium content library</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
