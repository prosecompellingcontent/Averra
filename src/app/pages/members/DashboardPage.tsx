import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { Link } from "react-router";
import {
  Home,
  MessageSquare,
  Users,
  BookOpen,
  Calendar,
  FolderOpen,
  Bookmark,
  User,
  CreditCard,
  Settings,
  Search,
  Bell,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Smile,
  Send,
  Sparkles
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";

interface Post {
  id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  author_id: string;
  likes_count: number;
  comments_count: number;
  author: {
    username: string;
    full_name: string;
    avatar_url?: string;
    membership_tier?: string;
  };
}

interface FeaturedMember {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  membership_tier?: string;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredMembers, setFeaturedMembers] = useState<FeaturedMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);

    try {
      // Load community posts with author info
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey(username, full_name, avatar_url, membership_tier)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) {
        console.error("Failed to load posts:", postsError);
      } else {
        setPosts(postsData || []);
      }

      // Load featured members (Gold Standard members or most active)
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio, membership_tier')
        .eq('membership_tier', 'gold-standard')
        .limit(5);

      if (membersError) {
        console.error("Failed to load featured members:", membersError);
      } else {
        setFeaturedMembers(membersData || []);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPostContent.trim()) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content: newPostContent,
          likes_count: 0,
          comments_count: 0
        })
        .select(`
          *,
          author:profiles!posts_author_id_fkey(username, full_name, avatar_url, membership_tier)
        `)
        .single();

      if (error) {
        console.error("Failed to create post:", error);
        return;
      }

      setPosts([data, ...posts]);
      setNewPostContent("");
    } catch (err) {
      console.error("Post creation error:", err);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      // Toggle like
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        // Unlike
        await supabase.from('likes').delete().eq('id', existingLike.id);

        // Decrement count
        await supabase
          .from('posts')
          .update({ likes_count: Math.max(0, posts.find(p => p.id === postId)?.likes_count || 0 - 1) })
          .eq('id', postId);

        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p));
      } else {
        // Like
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });

        // Increment count
        await supabase
          .from('posts')
          .update({ likes_count: (posts.find(p => p.id === postId)?.likes_count || 0) + 1 })
          .eq('id', postId);

        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || "Member";
  const isGoldStandard = user.membershipTier === "gold-standard";

  return (
    <MemberLayout>
      <div className="min-h-screen bg-[#fbf0f3]">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-[#251218]/5">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#251218]/40" />
                  <input
                    type="text"
                    placeholder="Search members, posts, discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-[#fdf5f7]/60 border border-[#251218]/10 rounded-full focus:border-[#c9969e] focus:outline-none transition-colors text-sm text-[#251218]"
                    style={{ fontFamily: "Lora, serif" }}
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4 ml-6">
                <button className="relative p-2 hover:bg-[#c9969e]/10 rounded-full transition-colors">
                  <Bell className="w-5 h-5 text-[#251218]/60" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c9969e] rounded-full"></span>
                </button>
                <Link to="/members/account" className="flex items-center gap-3 px-4 py-2 bg-[#fdf5f7]/60 hover:bg-white/80 rounded-full transition-colors border border-[#251218]/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white text-sm" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                    {firstName[0]}
                  </div>
                  <span className="text-sm text-[#251218]" style={{ fontFamily: "Lora, serif", fontWeight: 500 }}>
                    @{user.username || "member"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Center Feed */}
            <div className="lg:col-span-8 space-y-6">
              {/* Welcome Header */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl text-[#251218] mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                      Welcome back, <span className="italic text-[#c9969e]">{firstName}</span>
                    </h1>
                    <p className="text-base text-[#251218]/60" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-[#c9969e]/10 border border-[#c9969e]/30 rounded-full">
                    <span className="text-xs uppercase tracking-wider text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                      {isGoldStandard ? "Gold Standard" : "Blueprint"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Create Post */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white text-lg flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                    {firstName[0]}
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your wins, ask questions, or start a discussion..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#fdf5f7]/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e] focus:outline-none transition-colors resize-none text-[#251218]"
                      style={{ fontFamily: "Lora, serif" }}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#c9969e]/10 rounded-lg transition-colors">
                          <ImageIcon className="w-5 h-5 text-[#251218]/40" />
                        </button>
                        <button className="p-2 hover:bg-[#c9969e]/10 rounded-lg transition-colors">
                          <Video className="w-5 h-5 text-[#251218]/40" />
                        </button>
                        <button className="p-2 hover:bg-[#c9969e]/10 rounded-lg transition-colors">
                          <Smile className="w-5 h-5 text-[#251218]/40" />
                        </button>
                      </div>
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                        className="px-6 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Feed */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-[#c9969e]/20 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-[#c9969e] border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-[#251218]/60 mt-4" style={{ fontFamily: "Lora, serif" }}>Loading community feed...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-[#c9969e]/20 text-center">
                    <Sparkles className="w-12 h-12 text-[#c9969e] mx-auto mb-4" />
                    <h3 className="text-xl text-[#251218] mb-2" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                      Be the first to post
                    </h3>
                    <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                      Share your journey, ask questions, or celebrate wins with the community.
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20 hover:border-[#c9969e]/40 transition-all">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white text-sm" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                            {post.author.full_name?.[0] || "M"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link to={`/members/profile/${post.author.username}`} className="text-sm font-medium text-[#251218] hover:text-[#c9969e] transition-colors" style={{ fontFamily: "Lora, serif", fontWeight: 500 }}>
                                {post.author.full_name}
                              </Link>
                              {post.author.membership_tier === "gold-standard" && (
                                <span className="px-2 py-0.5 bg-[#c9969e]/20 text-[#c9969e] text-xs rounded-full uppercase tracking-wider" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                                  Gold
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#251218]/50" style={{ fontFamily: "Lora, serif" }}>
                              @{post.author.username} · {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-[#c9969e]/10 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[#251218]/40" />
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-base text-[#251218] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                          {post.content}
                        </p>
                        {post.image_url && (
                          <img src={post.image_url} alt="" className="mt-4 rounded-xl w-full object-cover max-h-96" />
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 pt-4 border-t border-[#251218]/5">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center gap-2 text-[#251218]/60 hover:text-[#c9969e] transition-colors group"
                        >
                          <Heart className="w-5 h-5 group-hover:fill-current" />
                          <span className="text-sm" style={{ fontFamily: "Lora, serif" }}>{post.likes_count}</span>
                        </button>
                        <button className="flex items-center gap-2 text-[#251218]/60 hover:text-[#c9969e] transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm" style={{ fontFamily: "Lora, serif" }}>{post.comments_count}</span>
                        </button>
                        <button className="flex items-center gap-2 text-[#251218]/60 hover:text-[#c9969e] transition-colors ml-auto">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Continue Reading */}
              {isGoldStandard && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                      Continue Reading
                    </h3>
                    <BookOpen className="w-5 h-5 text-[#c9969e]" />
                  </div>
                  <Link to="/members/library/the-gold-standard" className="block group">
                    <div className="aspect-video bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 rounded-xl mb-3 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-[#c9969e]" />
                    </div>
                    <h4 className="text-sm font-medium text-[#251218] mb-1 group-hover:text-[#c9969e] transition-colors" style={{ fontFamily: "Lora, serif" }}>
                      The Gold Standard
                    </h4>
                    <p className="text-xs text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                      Chapter 2: The Emotional Weight Nobody Sees
                    </p>
                    <div className="mt-3 h-1.5 bg-[#251218]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#c9969e] rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Featured Members */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                    Featured Members
                  </h3>
                  <Users className="w-5 h-5 text-[#c9969e]" />
                </div>
                <div className="space-y-3">
                  {featuredMembers.map((member) => (
                    <Link key={member.id} to={`/members/profile/${member.username}`} className="flex items-center gap-3 p-3 hover:bg-[#fdf5f7]/60 rounded-xl transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                        {member.full_name?.[0] || "M"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#251218] group-hover:text-[#c9969e] transition-colors truncate" style={{ fontFamily: "Lora, serif", fontWeight: 500 }}>
                          {member.full_name}
                        </p>
                        <p className="text-xs text-[#251218]/50 truncate" style={{ fontFamily: "Lora, serif" }}>
                          @{member.username}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/members/directory" className="block mt-4 text-center text-sm text-[#c9969e] hover:text-[#251218] transition-colors" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}>
                  View All Members →
                </Link>
              </div>

              {/* Upcoming Events */}
              {isGoldStandard && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                      Upcoming Calls
                    </h3>
                    <Calendar className="w-5 h-5 text-[#c9969e]" />
                  </div>
                  <Link to="/members/strategy-calls" className="block group">
                    <div className="p-4 bg-[#fdf5f7]/60 rounded-xl hover:bg-white/80 transition-colors border border-[#251218]/5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-[#c9969e] mb-1" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                            Next Call
                          </p>
                          <p className="text-sm font-medium text-[#251218]" style={{ fontFamily: "Lora, serif" }}>
                            Monthly Strategy Call
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                            May 15
                          </p>
                          <p className="text-xs text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                            2:00 PM EST
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#251218]/70 leading-relaxed" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                        Join Jayla for this month's business strategy session
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Trending Discussions */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                    Trending
                  </h3>
                  <TrendingUp className="w-5 h-5 text-[#c9969e]" />
                </div>
                <div className="space-y-3">
                  {["Pricing strategies that actually work", "Managing slow seasons without panic", "Building passive income streams"].map((topic, idx) => (
                    <Link key={idx} to="/members/community" className="block p-3 hover:bg-[#fdf5f7]/60 rounded-xl transition-colors group">
                      <p className="text-sm text-[#251218] group-hover:text-[#c9969e] transition-colors" style={{ fontFamily: "Lora, serif", fontWeight: 400 }}>
                        {topic}
                      </p>
                      <p className="text-xs text-[#251218]/50 mt-1" style={{ fontFamily: "Lora, serif" }}>
                        {Math.floor(Math.random() * 50) + 10} discussions
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
