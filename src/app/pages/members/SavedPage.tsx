import { useState } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { Bookmark, Search, FileText, MessageCircle, Award, Calendar } from "lucide-react";

interface SavedItem {
  id: number;
  type: "discussion" | "framework" | "chapter";
  title: string;
  description?: string;
  author?: string;
  savedAt: string;
  originalDate?: string;
}

export function SavedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "discussion" | "framework" | "chapter">("all");

  const savedItems: SavedItem[] = [
    {
      id: 1,
      type: "discussion",
      title: "Raised my prices 40% and didn't lose a single client",
      description: "After implementing the pricing psychology framework from Chapter 6...",
      author: "Sarah M.",
      savedAt: "2026-05-08T14:00:00Z",
      originalDate: "2h ago",
    },
    {
      id: 2,
      type: "framework",
      title: "Premium Pricing Psychology",
      description: "Understanding how to price for value and attract clients who don't negotiate",
      savedAt: "2026-05-07T10:00:00Z",
      originalDate: "Apr 1, 2026",
    },
    {
      id: 3,
      type: "chapter",
      title: "Chapter 6: The Psychology of Premium Pricing",
      description: "How to confidently charge what you're worth without feeling guilty or losing clients",
      savedAt: "2026-05-06T16:30:00Z",
      originalDate: "The Gold Standard",
    },
    {
      id: 4,
      type: "discussion",
      title: "First passive income month: $2,400 while on vacation",
      description: "I just got back from a week off and checked my Stripe dashboard...",
      author: "Keisha L.",
      savedAt: "2026-05-05T12:00:00Z",
      originalDate: "5h ago",
    },
    {
      id: 5,
      type: "framework",
      title: "Scaling Systems",
      description: "Building repeatable processes that let your business grow without constant hands-on management",
      savedAt: "2026-05-01T09:00:00Z",
      originalDate: "May 1, 2026",
    },
  ];

  const filteredItems = savedItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `Saved ${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Saved yesterday";
    } else {
      return `Saved ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    }
  };

  const getTypeIcon = (type: SavedItem["type"]) => {
    switch (type) {
      case "discussion":
        return MessageCircle;
      case "framework":
        return FileText;
      case "chapter":
        return Award;
      default:
        return FileText;
    }
  };

  const getTypeLabel = (type: SavedItem["type"]) => {
    switch (type) {
      case "discussion":
        return "Community Discussion";
      case "framework":
        return "Monthly Framework";
      case "chapter":
        return "Book Chapter";
      default:
        return "";
    }
  };

  return (
    <MemberLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c9969e]/5 rounded-full blur-3xl"></div>

          <div className="relative px-12 py-12">
            <div className="mb-8">
              <h1
                className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05] mb-3"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                Saved Content
              </h1>
              <p
                className="text-lg text-[#251218]/60 max-w-2xl"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                Everything you've bookmarked for later reference
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#251218]/30" />
              <input
                type="text"
                placeholder="Search saved items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                style={{ fontFamily: "Lora, serif" }}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              {[
                { value: "all", label: "All" },
                { value: "chapter", label: "Chapters" },
                { value: "framework", label: "Frameworks" },
                { value: "discussion", label: "Discussions" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value as typeof filter)}
                  className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
                    filter === item.value
                      ? "bg-white/80 backdrop-blur-sm border-[#c9969e]/30 text-[#251218]"
                      : "bg-white/40 backdrop-blur-sm border-[#251218]/10 text-[#251218]/60 hover:border-[#c9969e]/20"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Items List */}
        <div className="px-12 py-12">
          <div className="max-w-5xl">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <Bookmark className="w-16 h-16 text-[#251218]/10 mx-auto mb-6" strokeWidth={1} />
                <p
                  className="text-lg text-[#251218]/40 mb-2"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  No saved items found
                </p>
                <p
                  className="text-sm text-[#251218]/30"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Bookmark content as you discover it to find it here later
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const Icon = getTypeIcon(item.type);
                  return (
                    <div
                      key={item.id}
                      className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-xl transition-all duration-500 cursor-pointer"
                    >
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#c9969e]" strokeWidth={1.5} />
                        </div>

                        <div className="flex-1">
                          {/* Type Badge */}
                          <div className="mb-3">
                            <span
                              className="text-[9px] uppercase tracking-[0.25em] text-[#c9969e]"
                              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                            >
                              {getTypeLabel(item.type)}
                            </span>
                          </div>

                          {/* Title */}
                          <h3
                            className="text-xl text-[#251218] group-hover:text-[#c9969e] transition-colors mb-3"
                            style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                          >
                            {item.title}
                          </h3>

                          {/* Description */}
                          {item.description && (
                            <p
                              className="text-base text-[#251218]/70 mb-4 leading-relaxed"
                              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                            >
                              {item.description}
                            </p>
                          )}

                          {/* Footer */}
                          <div className="flex items-center gap-4 text-sm text-[#251218]/50">
                            {item.author && (
                              <>
                                <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                                  {item.author}
                                </span>
                                <span>·</span>
                              </>
                            )}
                            {item.originalDate && (
                              <>
                                <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                                  {item.originalDate}
                                </span>
                                <span>·</span>
                              </>
                            )}
                            <div className="flex items-center gap-2">
                              <Bookmark className="w-3 h-3" fill="#c9969e" strokeWidth={1.5} />
                              <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                                {formatDate(item.savedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Unsave Button */}
                        <button className="p-3 hover:bg-[#251218]/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Bookmark
                            className="w-5 h-5 text-[#c9969e]"
                            fill="#c9969e"
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
