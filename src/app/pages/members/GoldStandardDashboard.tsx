import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/utils/supabase/client";
import { Users, BookOpen, MessageSquare, Calendar, CheckSquare, Video, Headphones, Star } from "lucide-react";

interface Post {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string | null;
    full_name: string | null;
  };
}

export function GoldStandardDashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommunityFeed();
  }, []);

  const loadCommunityFeed = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles!posts_author_id_fkey(username, full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error loading feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#251218] to-[#c9969e] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
            <h1
              className="text-3xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Gold Standard Dashboard
            </h1>
          </div>
          <p style={{ fontFamily: "Lora, serif" }}>
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Premium Access */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h2
                className="text-xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Premium Access
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link
                  to="/members/ebook-reader"
                  className="p-4 border border-[#251218]/10 rounded-lg hover:border-[#c9969e] hover:bg-[#c9969e]/5 transition-all"
                >
                  <BookOpen className="w-6 h-6 text-[#c9969e] mb-2" />
                  <p
                    className="text-sm text-[#251218] font-medium"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Ebook Library
                  </p>
                </Link>
                <Link
                  to="/members/library"
                  className="p-4 border border-[#251218]/10 rounded-lg hover:border-[#c9969e] hover:bg-[#c9969e]/5 transition-all"
                >
                  <Headphones className="w-6 h-6 text-[#c9969e] mb-2" />
                  <p
                    className="text-sm text-[#251218] font-medium"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Audiobook
                  </p>
                </Link>
                <Link
                  to="/members/strategy-calls"
                  className="p-4 border border-[#251218]/10 rounded-lg hover:border-[#c9969e] hover:bg-[#c9969e]/5 transition-all"
                >
                  <Video className="w-6 h-6 text-[#c9969e] mb-2" />
                  <p
                    className="text-sm text-[#251218] font-medium"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Strategy Calls
                  </p>
                </Link>
                <Link
                  to="/members/community"
                  className="p-4 border border-[#251218]/10 rounded-lg hover:border-[#c9969e] hover:bg-[#c9969e]/5 transition-all"
                >
                  <MessageSquare className="w-6 h-6 text-[#c9969e] mb-2" />
                  <p
                    className="text-sm text-[#251218] font-medium"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Community
                  </p>
                </Link>
                <Link
                  to="/members/directory"
                  className="p-4 border border-[#251218]/10 rounded-lg hover:border-[#c9969e] hover:bg-[#c9969e]/5 transition-all"
                >
                  <Users className="w-6 h-6 text-[#c9969e] mb-2" />
                  <p
                    className="text-sm text-[#251218] font-medium"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Directory
                  </p>
                </Link>
                <Link
                  to="/members/frameworks"
                  className="p-4 border border-[#251218]/10 rounded-lg hover:border-[#c9969e] hover:bg-[#c9969e]/5 transition-all"
                >
                  <CheckSquare className="w-6 h-6 text-[#c9969e] mb-2" />
                  <p
                    className="text-sm text-[#251218] font-medium"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Frameworks
                  </p>
                </Link>
              </div>
            </div>

            {/* Continue Reading */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h2
                className="text-xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Continue Reading
              </h2>
              <Link
                to="/members/ebook-reader"
                className="flex items-center gap-4 p-4 bg-[#c9969e]/5 rounded-lg hover:bg-[#c9969e]/10 transition-colors"
              >
                <div className="w-16 h-24 bg-gradient-to-br from-[#c9969e] to-[#251218] rounded flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm text-[#251218] font-medium mb-1"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    The Gold Standard Framework
                  </p>
                  <p
                    className="text-xs text-[#251218]/60"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Chapter 3: Building Systems
                  </p>
                  <div className="mt-2 w-full bg-[#251218]/10 rounded-full h-2">
                    <div
                      className="bg-[#c9969e] h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Community Feed */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h2
                className="text-xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Community Feed
              </h2>

              {isLoading ? (
                <p className="text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                  Loading...
                </p>
              ) : posts.length === 0 ? (
                <p className="text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                  No posts yet. Be the first to share!
                </p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="pb-4 border-b border-[#251218]/10 last:border-0"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <p
                          className="text-sm text-[#251218] font-medium"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {post.author?.full_name || "Member"}
                        </p>
                        {post.author?.username && (
                          <p
                            className="text-xs text-[#251218]/60"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            @{post.author.username}
                          </p>
                        )}
                        <span className="text-xs text-[#251218]/40">•</span>
                        <p
                          className="text-xs text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p
                        className="text-[#251218]"
                        style={{ fontFamily: "Lora, serif" }}
                      >
                        {post.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Link
                to="/members/community"
                className="block mt-4 text-center text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                View All Posts →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Strategy Calls */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h3
                className="text-lg text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Upcoming Calls
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-[#c9969e] flex-shrink-0" />
                  <div>
                    <p
                      className="text-sm text-[#251218] font-medium"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      Group Strategy Session
                    </p>
                    <p
                      className="text-xs text-[#251218]/60"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      Coming soon
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/members/strategy-calls"
                className="block mt-4 text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                View All Calls →
              </Link>
            </div>

            {/* Premium Resources */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h3
                className="text-lg text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Premium Resources
              </h3>
              <div className="space-y-2">
                <Link
                  to="/members/ebook-reader"
                  className="block text-sm text-[#251218]/70 hover:text-[#c9969e] transition-colors"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  → Full Ebook Access
                </Link>
                <Link
                  to="/members/library"
                  className="block text-sm text-[#251218]/70 hover:text-[#c9969e] transition-colors"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  → Audiobook Library
                </Link>
                <Link
                  to="/members/strategy-calls"
                  className="block text-sm text-[#251218]/70 hover:text-[#c9969e] transition-colors"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  → Strategy Call Replays
                </Link>
                <Link
                  to="/members/frameworks"
                  className="block text-sm text-[#251218]/70 hover:text-[#c9969e] transition-colors"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  → Premium Frameworks
                </Link>
                <Link
                  to="/members/saved"
                  className="block text-sm text-[#251218]/70 hover:text-[#c9969e] transition-colors"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  → Saved Content
                </Link>
              </div>
            </div>

            {/* Your Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h3
                className="text-lg text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Your Progress
              </h3>
              <div className="space-y-3">
                <div>
                  <p
                    className="text-sm text-[#251218]/70 mb-1"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Ebook Progress
                  </p>
                  <div className="w-full bg-[#251218]/10 rounded-full h-2">
                    <div
                      className="bg-[#c9969e] h-2 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <p
                    className="text-xs text-[#251218]/60 mt-1"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    45% Complete
                  </p>
                </div>
                <Link
                  to="/members/progress"
                  className="block text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  View Full Progress →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
