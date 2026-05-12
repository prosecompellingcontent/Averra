import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/utils/supabase/client";
import { Users, BookOpen, MessageSquare, Calendar, CheckSquare } from "lucide-react";

interface Post {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string | null;
    full_name: string | null;
  };
}

export function BlueprintDashboard() {
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
      <div className="bg-white border-b border-[#251218]/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1
            className="text-3xl text-[#251218] mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Blueprint Dashboard
          </h1>
          <p
            className="text-[#251218]/60"
            style={{ fontFamily: "Lora, serif" }}
          >
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Access */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h2
                className="text-xl text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Quick Access
              </h2>
              <div className="grid grid-cols-2 gap-4">
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
                  to="/members/library"
                  className="p-4 border border-[#251218]/10 rounded-lg hover:border-[#c9969e] hover:bg-[#c9969e]/5 transition-all"
                >
                  <BookOpen className="w-6 h-6 text-[#c9969e] mb-2" />
                  <p
                    className="text-sm text-[#251218] font-medium"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Resources
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
            {/* Upgrade Prompt */}
            <div className="bg-gradient-to-br from-[#c9969e]/10 to-[#c9969e]/5 rounded-lg p-6 border border-[#c9969e]/20">
              <h3
                className="text-lg text-[#251218] mb-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Unlock More
              </h3>
              <p
                className="text-sm text-[#251218]/70 mb-4"
                style={{ fontFamily: "Lora, serif" }}
              >
                Upgrade to Gold Standard for ebook access, strategy calls, and premium resources.
              </p>
              <Link
                to="/membership-options"
                className="block text-center px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                Upgrade Now
              </Link>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h3
                className="text-lg text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-[#c9969e] flex-shrink-0" />
                  <div>
                    <p
                      className="text-sm text-[#251218] font-medium"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      Monthly Framework Drop
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
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h3
                className="text-lg text-[#251218] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Blueprint Resources
              </h3>
              <div className="space-y-2">
                <Link
                  to="/members/library"
                  className="block text-sm text-[#251218]/70 hover:text-[#c9969e] transition-colors"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  → Implementation Guides
                </Link>
                <Link
                  to="/members/frameworks"
                  className="block text-sm text-[#251218]/70 hover:text-[#c9969e] transition-colors"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  → Monthly Frameworks
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
          </div>
        </div>
      </div>
    </div>
  );
}
