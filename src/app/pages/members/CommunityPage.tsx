import { useState } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { useAuth } from "@/app/context/AuthContext";
import {
  Search,
  Plus,
  MessageCircle,
  Heart,
  Bookmark,
  Pin,
  Award,
  TrendingUp,
  Users as UsersIcon,
  Lightbulb,
  Target,
  Sparkles,
} from "lucide-react";

const discussionRooms = [
  { id: "breakthroughs", name: "Business Breakthroughs", icon: TrendingUp, color: "from-[#c9969e] to-[#251218]" },
  { id: "strategy", name: "Strategy Discussions", icon: Lightbulb, color: "from-[#c9969e]/80 to-[#251218]/80" },
  { id: "accountability", name: "Accountability", icon: Target, color: "from-[#c9969e]/60 to-[#251218]/60" },
  { id: "wins", name: "Wins & Milestones", icon: Award, color: "from-[#c9969e] to-[#c9969e]/60" },
];

export function CommunityPage() {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isGoldStandard = user?.membershipTier === "gold-standard";

  const discussions = [
    {
      id: 1,
      title: "Raised my prices 40% and didn't lose a single client",
      author: "Sarah M.",
      memberBadge: "Blueprint",
      room: "wins",
      replies: 23,
      likes: 45,
      isPinned: true,
      timeAgo: "2h",
      preview:
        "After implementing the pricing psychology framework from Chapter 6, I finally had the confidence to make the shift I'd been avoiding for months...",
    },
    {
      id: 2,
      title: "First passive income month: $2,400 while on vacation",
      author: "Keisha L.",
      memberBadge: "Gold Standard",
      room: "breakthroughs",
      replies: 41,
      likes: 89,
      isPinned: false,
      timeAgo: "5h",
      preview:
        "I just got back from a week off and checked my Stripe dashboard. Made $2,400 while I was completely disconnected. This is what we've been working toward...",
    },
    {
      id: 3,
      title: "Monthly Challenge: Building Your First Digital Product",
      author: "AVERRA Team",
      memberBadge: "Team",
      room: "accountability",
      replies: 67,
      likes: 102,
      isPinned: true,
      timeAgo: "1d",
      preview:
        "This month's challenge is all about creating your first scalable income stream. We're walking through every step together. Who's joining?",
    },
    {
      id: 4,
      title: "How do you handle clients asking for discounts?",
      author: "Maya T.",
      memberBadge: "Blueprint",
      room: "strategy",
      replies: 18,
      likes: 31,
      isPinned: false,
      timeAgo: "3h",
      preview:
        "I've been getting discount requests more frequently and want to handle them without compromising my positioning. How do you all navigate this?",
    },
  ];

  const filteredDiscussions =
    selectedRoom === "all"
      ? discussions
      : discussions.filter((d) => d.room === selectedRoom);

  return (
    <MemberLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c9969e]/5 rounded-full blur-3xl"></div>

          <div className="relative px-12 py-12">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1
                  className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05] mb-3"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Community
                </h1>
                <p
                  className="text-lg text-[#251218]/60 max-w-2xl"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  {isGoldStandard
                    ? "Connect with Gold Standard members building beyond the chair"
                    : "Connect with Blueprint members on the same journey"}
                </p>
              </div>

              <button
                className="flex items-center gap-2 px-8 py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 shadow-lg"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs uppercase tracking-[0.2em]">New Post</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#251218]/30" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                style={{ fontFamily: "Lora, serif" }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-12 py-12">
          <div className="max-w-7xl">
            {/* Discussion Rooms */}
            <div className="mb-12">
              <h2
                className="text-xl text-[#251218] mb-6"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Discussion Rooms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <button
                  onClick={() => setSelectedRoom("all")}
                  className={`p-6 rounded-xl border transition-all duration-300 text-left ${
                    selectedRoom === "all"
                      ? "bg-white/80 backdrop-blur-sm border-[#c9969e]/30 shadow-lg"
                      : "bg-white/40 backdrop-blur-sm border-[#251218]/10 hover:border-[#c9969e]/20"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 flex items-center justify-center`}>
                      <UsersIcon className="w-5 h-5 text-[#c9969e]" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3
                    className="text-base text-[#251218] mb-1"
                    style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                  >
                    All Discussions
                  </h3>
                  <p
                    className="text-xs text-[#251218]/50"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    View everything
                  </p>
                </button>

                {discussionRooms.map((room) => {
                  const Icon = room.icon;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`p-6 rounded-xl border transition-all duration-300 text-left ${
                        selectedRoom === room.id
                          ? "bg-white/80 backdrop-blur-sm border-[#c9969e]/30 shadow-lg"
                          : "bg-white/40 backdrop-blur-sm border-[#251218]/10 hover:border-[#c9969e]/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${room.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                      <h3
                        className="text-base text-[#251218] mb-1"
                        style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                      >
                        {room.name}
                      </h3>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discussion List */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-xl transition-all duration-500 cursor-pointer"
                >
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white shadow-lg">
                      <span
                        className="text-lg"
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontWeight: 400,
                        }}
                      >
                        {discussion.author[0]}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {discussion.isPinned && (
                              <Pin className="w-4 h-4 text-[#c9969e]" />
                            )}
                            <h3
                              className="text-xl text-[#251218] group-hover:text-[#c9969e] transition-colors"
                              style={{
                                fontFamily: "Lora, serif",
                                fontWeight: 500,
                              }}
                            >
                              {discussion.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#251218]/50">
                            <span style={{ fontFamily: "Lora, serif" }}>
                              {discussion.author}
                            </span>
                            <span>·</span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
                                discussion.memberBadge === "Gold Standard"
                                  ? "bg-gradient-to-r from-[#c9969e]/20 to-[#251218]/10 text-[#c9969e]"
                                  : discussion.memberBadge === "Team"
                                  ? "bg-[#251218]/10 text-[#251218]"
                                  : "bg-[#251218]/5 text-[#251218]/60"
                              }`}
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                              }}
                            >
                              {discussion.memberBadge}
                            </span>
                            <span>·</span>
                            <span style={{ fontFamily: "Lora, serif" }}>
                              {discussion.timeAgo}
                            </span>
                          </div>
                        </div>

                        <button className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors">
                          <Bookmark className="w-5 h-5 text-[#251218]/30 hover:text-[#c9969e]" />
                        </button>
                      </div>

                      <p
                        className="text-base text-[#251218]/70 mb-6 line-clamp-2 leading-relaxed"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        {discussion.preview}
                      </p>

                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-[#251218]/50 hover:text-[#c9969e] transition-colors cursor-pointer">
                          <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                          <span
                            className="text-sm"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            {discussion.replies}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#251218]/50 hover:text-[#c9969e] transition-colors cursor-pointer">
                          <Heart className="w-5 h-5" strokeWidth={1.5} />
                          <span
                            className="text-sm"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            {discussion.likes}
                          </span>
                        </div>
                        {discussion.room === "wins" && (
                          <div className="flex items-center gap-2 text-[#c9969e]">
                            <Award className="w-5 h-5" strokeWidth={1.5} />
                            <span
                              className="text-sm"
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                              }}
                            >
                              Community Win
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
