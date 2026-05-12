import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { Link } from "react-router";
import { Search, Users, MessageCircle, Sparkles } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

interface Member {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  membership_tier?: string;
  location?: string;
  business_category?: string;
}

export function MemberDirectoryPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadMembers();
  }, [user]);

  useEffect(() => {
    filterMembers();
  }, [searchQuery, filterTier, members]);

  const loadMembers = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio, membership_tier, location, business_category')
        .order('full_name', { ascending: true });

      if (error) {
        console.error("Failed to load members:", error);
      } else {
        setMembers(data || []);
      }
    } catch (err) {
      console.error("Member directory load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.full_name?.toLowerCase().includes(query) ||
        m.username?.toLowerCase().includes(query) ||
        m.bio?.toLowerCase().includes(query) ||
        m.business_category?.toLowerCase().includes(query)
      );
    }

    // Tier filter
    if (filterTier !== "all") {
      filtered = filtered.filter(m => m.membership_tier === filterTier);
    }

    setFilteredMembers(filtered);
  };

  if (!user) return null;

  return (
    <MemberLayout>
      <div className="min-h-screen bg-[#fbf0f3]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
          <div className="px-12 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#c9969e]/20">
                  <Users className="w-8 h-8 text-[#c9969e]" />
                </div>
                <div>
                  <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}>
                    Member Directory
                  </h1>
                  <p className="text-lg text-[#251218]/60" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    Connect with {members.length} beauty professionals building beyond the chair
                  </p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#251218]/40" />
                  <input
                    type="text"
                    placeholder="Search by name, username, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e] focus:outline-none transition-colors text-[#251218]"
                    style={{ fontFamily: "Lora, serif" }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterTier("all")}
                    className={`px-6 py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all ${
                      filterTier === "all"
                        ? "bg-[#251218] text-white"
                        : "bg-white/60 text-[#251218] hover:bg-white border border-[#251218]/10"
                    }`}
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterTier("blueprint")}
                    className={`px-6 py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all ${
                      filterTier === "blueprint"
                        ? "bg-[#251218] text-white"
                        : "bg-white/60 text-[#251218] hover:bg-white border border-[#251218]/10"
                    }`}
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    Blueprint
                  </button>
                  <button
                    onClick={() => setFilterTier("gold-standard")}
                    className={`px-6 py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all ${
                      filterTier === "gold-standard"
                        ? "bg-[#251218] text-white"
                        : "bg-white/60 text-[#251218] hover:bg-white border border-[#251218]/10"
                    }`}
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                  >
                    Gold
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="px-12 py-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-2 border-[#c9969e] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                    Loading members...
                  </p>
                </div>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-20">
                <Sparkles className="w-16 h-16 text-[#c9969e] mx-auto mb-4" />
                <h3 className="text-2xl text-[#251218] mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                  No members found
                </h3>
                <p className="text-base text-[#251218]/60" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20 hover:border-[#c9969e]/40 hover:shadow-xl transition-all group">
                    {/* Member Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white text-xl flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                          {member.full_name?.[0] || "M"}
                        </div>
                      </div>
                      {member.membership_tier === "gold-standard" && (
                        <div className="px-3 py-1 bg-[#c9969e]/20 border border-[#c9969e]/30 rounded-full">
                          <span className="text-xs uppercase tracking-wider text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                            Gold
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="mb-4">
                      <Link to={`/members/profile/${member.username}`} className="block mb-1">
                        <h3 className="text-lg font-medium text-[#251218] group-hover:text-[#c9969e] transition-colors" style={{ fontFamily: "Lora, serif", fontWeight: 500 }}>
                          {member.full_name}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#251218]/50 mb-3" style={{ fontFamily: "Lora, serif" }}>
                        @{member.username}
                      </p>

                      {member.business_category && (
                        <div className="inline-block px-3 py-1 bg-[#fdf5f7] rounded-full mb-3">
                          <span className="text-xs text-[#251218]/70" style={{ fontFamily: "Lora, serif" }}>
                            {member.business_category}
                          </span>
                        </div>
                      )}

                      {member.bio && (
                        <p className="text-sm text-[#251218]/70 leading-relaxed line-clamp-2" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                          {member.bio}
                        </p>
                      )}

                      {member.location && (
                        <p className="text-xs text-[#251218]/50 mt-2" style={{ fontFamily: "Lora, serif" }}>
                          {member.location}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/members/profile/${member.username}`}
                        className="flex-1 px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all rounded-lg text-center text-sm uppercase tracking-wider"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/members/messages?user=${member.username}`}
                        className="p-2 bg-[#fdf5f7] hover:bg-white border border-[#251218]/10 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-5 h-5 text-[#251218]/60" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
