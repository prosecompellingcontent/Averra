import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "@/utils/supabase/client";

interface Post {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  is_pinned: boolean;
  is_featured: boolean;
  is_announcement: boolean;
  author: {
    username: string | null;
    full_name: string | null;
  };
  comments_count?: number;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  post_id: string;
  author: {
    username: string | null;
    full_name: string | null;
  };
}

export function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [newAnnouncementText, setNewAnnouncementText] = useState("");
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setIsLoading(true);

      // Load posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles!posts_author_id_fkey(username, full_name)
        `)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error loading posts:", postsError);
      } else {
        // Get comment counts for each post
        const postsWithCounts = await Promise.all(
          (postsData || []).map(async (post) => {
            const { count } = await supabase
              .from("comments")
              .select("*", { count: "exact", head: true })
              .eq("post_id", post.id);
            return { ...post, comments_count: count || 0 };
          })
        );
        setPosts(postsWithCounts);
      }

      // Load comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(`
          *,
          author:profiles!comments_author_id_fkey(username, full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (commentsError) {
        console.error("Error loading comments:", commentsError);
      } else {
        setComments(commentsData || []);
      }
    } catch (error) {
      console.error("Error loading community data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
        return;
      }

      setPosts(posts.filter((p) => p.id !== postId));
      alert("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handlePinPost = async (postId: string, currentPinStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ is_pinned: !currentPinStatus })
        .eq("id", postId);

      if (error) {
        console.error("Error pinning post:", error);
        alert("Failed to pin/unpin post");
        return;
      }

      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, is_pinned: !currentPinStatus } : p
        )
      );
      alert(currentPinStatus ? "Post unpinned" : "Post pinned successfully");
    } catch (error) {
      console.error("Error pinning post:", error);
      alert("Failed to pin/unpin post");
    }
  };

  const handleFeaturePost = async (postId: string, currentFeatureStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ is_featured: !currentFeatureStatus })
        .eq("id", postId);

      if (error) {
        console.error("Error featuring post:", error);
        alert("Failed to feature/unfeature post");
        return;
      }

      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, is_featured: !currentFeatureStatus } : p
        )
      );
      alert(currentFeatureStatus ? "Post unfeatured" : "Post featured successfully");
    } catch (error) {
      console.error("Error featuring post:", error);
      alert("Failed to feature/unfeature post");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);

      if (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment");
        return;
      }

      setComments(comments.filter((c) => c.id !== commentId));
      alert("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncementText.trim()) {
      alert("Please enter announcement text");
      return;
    }

    try {
      setIsCreatingAnnouncement(true);

      // Get current admin user ID (you'll need to get this from auth context)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in to create announcements");
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .insert({
          content: newAnnouncementText,
          author_id: user.id,
          is_announcement: true,
          is_pinned: true,
        })
        .select(`
          *,
          author:profiles!posts_author_id_fkey(username, full_name)
        `)
        .single();

      if (error) {
        console.error("Error creating announcement:", error);
        alert("Failed to create announcement");
        return;
      }

      setPosts([{ ...data, comments_count: 0 }, ...posts]);
      setNewAnnouncementText("");
      alert("Announcement created successfully");
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement");
    } finally {
      setIsCreatingAnnouncement(false);
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
                Community Management
              </h1>
              <p
                className="text-sm text-[#251218]/60 mt-1"
                style={{ fontFamily: "Lora, serif" }}
              >
                Moderate posts, manage content, and create announcements
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
        {/* Create Announcement */}
        <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6 mb-6">
          <h2
            className="text-lg text-[#251218] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Create Announcement
          </h2>
          <textarea
            value={newAnnouncementText}
            onChange={(e) => setNewAnnouncementText(e.target.value)}
            placeholder="Write your announcement..."
            className="w-full px-4 py-3 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none mb-4"
            style={{ fontFamily: "Lora, serif" }}
            rows={4}
          />
          <button
            onClick={handleCreateAnnouncement}
            disabled={isCreatingAnnouncement || !newAnnouncementText.trim()}
            className="px-6 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
            {isCreatingAnnouncement ? "Creating..." : "Create Announcement"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-3 transition-colors ${
              activeTab === "posts"
                ? "bg-[#251218] text-white"
                : "bg-white text-[#251218] hover:bg-[#251218]/5"
            }`}
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-3 transition-colors ${
              activeTab === "comments"
                ? "bg-[#251218] text-white"
                : "bg-white text-[#251218] hover:bg-[#251218]/5"
            }`}
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
            Comments ({comments.length})
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-12 text-center">
            <p
              className="text-[#251218]/60"
              style={{ fontFamily: "Lora, serif" }}
            >
              Loading community data...
            </p>
          </div>
        ) : (
          <>
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-12 text-center">
                    <p
                      className="text-[#251218]/60"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      No posts yet
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p
                              className="text-sm text-[#251218] font-medium"
                              style={{ fontFamily: "Lora, serif" }}
                            >
                              {post.author?.full_name || "Unknown User"}
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
                          <div className="flex items-center gap-2 mb-3">
                            {post.is_announcement && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                Announcement
                              </span>
                            )}
                            {post.is_pinned && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                                Pinned
                              </span>
                            )}
                            {post.is_featured && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                          <p
                            className="text-[#251218] mb-2"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {post.content}
                          </p>
                          <p
                            className="text-xs text-[#251218]/60"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {post.comments_count || 0} comments
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#251218]/10">
                        <button
                          onClick={() => handlePinPost(post.id, post.is_pinned)}
                          className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          {post.is_pinned ? "Unpin" : "Pin"}
                        </button>
                        <button
                          onClick={() => handleFeaturePost(post.id, post.is_featured)}
                          className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          {post.is_featured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-12 text-center">
                    <p
                      className="text-[#251218]/60"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      No comments yet
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p
                              className="text-sm text-[#251218] font-medium"
                              style={{ fontFamily: "Lora, serif" }}
                            >
                              {comment.author?.full_name || "Unknown User"}
                            </p>
                            {comment.author?.username && (
                              <p
                                className="text-xs text-[#251218]/60"
                                style={{ fontFamily: "Lora, serif" }}
                              >
                                @{comment.author.username}
                              </p>
                            )}
                            <span className="text-xs text-[#251218]/40">•</span>
                            <p
                              className="text-xs text-[#251218]/60"
                              style={{ fontFamily: "Lora, serif" }}
                            >
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p
                            className="text-[#251218]"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {comment.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-[#251218]/10">
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
