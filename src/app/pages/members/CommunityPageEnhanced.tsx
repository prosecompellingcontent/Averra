import { useState, useEffect, useRef } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { useAuth } from "@/app/context/AuthContext";
import { supabase, subscribeToPost, subscribeToComments, subscribeToLikes, updateOnlineStatus } from "@/utils/supabase/client";
import {
  Send, Heart, MessageCircle, Bookmark, MoreVertical,
  Users, Search, Filter, TrendingUp, Clock, Pin, Edit2, Trash2
} from "lucide-react";

interface Post {
  id: string;
  author_id: string;
  content: string;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    is_online: boolean;
  };
  liked_by_current_user?: boolean;
  saved_by_current_user?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

interface OnlineMember {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  membership_type: string;
}

export function CommunityPageEnhanced() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [filter, setFilter] = useState<"all" | "trending" | "recent">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    // Set user as online
    updateOnlineStatus(user.id, true);

    // Load initial data
    loadPosts();
    loadOnlineMembers();

    // Subscribe to real-time updates
    const postsChannel = subscribeToPost((payload) => {
      if (payload.eventType === 'INSERT') {
        loadPosts();
      } else if (payload.eventType === 'UPDATE') {
        setPosts(prev => prev.map(p =>
          p.id === payload.new.id ? { ...p, ...payload.new } : p
        ));
      } else if (payload.eventType === 'DELETE') {
        setPosts(prev => prev.filter(p => p.id !== payload.old.id));
      }
    });

    // Set user as offline on unmount
    return () => {
      updateOnlineStatus(user.id, false);
      supabase.removeChannel(postsChannel);
    };
  }, [user]);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, full_name, avatar_url, is_online),
        likes:likes(user_id),
        saved_posts(user_id)
      `)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading posts:', error);
      return;
    }

    const postsWithFlags = data.map(post => ({
      ...post,
      liked_by_current_user: post.likes?.some((like: any) => like.user_id === user?.id),
      saved_by_current_user: post.saved_posts?.some((saved: any) => saved.user_id === user?.id),
    }));

    setPosts(postsWithFlags);
  };

  const loadOnlineMembers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, membership_type')
      .eq('is_online', true)
      .neq('id', user?.id || '');

    if (!error && data) {
      setOnlineMembers(data);
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim() || !user) return;

    setIsPosting(true);

    const { error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        content: newPostContent.trim(),
      });

    if (error) {
      console.error('Error creating post:', error);
    } else {
      setNewPostContent("");
      loadPosts();
    }

    setIsPosting(false);
  };

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    if (currentlyLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id });
    }

    loadPosts();
  };

  const toggleSave = async (postId: string, currentlySaved: boolean) => {
    if (!user) return;

    if (currentlySaved) {
      await supabase
        .from('saved_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('saved_posts')
        .insert({ post_id: postId, user_id: user.id });
    }

    loadPosts();
  };

  const loadComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!comments_author_id_fkey(username, full_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(prev => ({ ...prev, [postId]: data }));
    }
  };

  const addComment = async (postId: string) => {
    if (!newComment.trim() || !user) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: user.id,
        content: newComment.trim(),
      });

    if (!error) {
      setNewComment("");
      loadComments(postId);
      loadPosts();
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', user.id);

    if (!error) {
      loadPosts();
    }
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      return post.content.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (filter === "trending") {
      return (b.likes_count + b.comments_count) - (a.likes_count + a.comments_count);
    }
    return 0;
  });

  if (!user) return null;

  return (
    <MemberLayout>
      <div className="min-h-screen bg-[#fdf5f7]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header */}
              <div>
                <h1
                  className="text-4xl text-[#251218] mb-2"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Community
                </h1>
                <p
                  className="text-[#251218]/60"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Connect with {onlineMembers.length + 1} members online now
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#c9969e]/10">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#251218]/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2 bg-white/60 border border-[#251218]/10 rounded-lg focus:border-[#c9969e]/30 focus:outline-none transition-all"
                    style={{ fontFamily: "Lora, serif", color: "#251218" }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filter === "all"
                        ? "bg-[#c9969e] text-white"
                        : "bg-white/60 text-[#251218]/60 hover:bg-white/80"
                    }`}
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("trending")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filter === "trending"
                        ? "bg-[#c9969e] text-white"
                        : "bg-white/60 text-[#251218]/60 hover:bg-white/80"
                    }`}
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Trending
                  </button>
                  <button
                    onClick={() => setFilter("recent")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filter === "recent"
                        ? "bg-[#c9969e] text-white"
                        : "bg-white/60 text-[#251218]/60 hover:bg-white/80"
                    }`}
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    Recent
                  </button>
                </div>
              </div>

              {/* New Post */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/10">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share with the community..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/60 border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all resize-none"
                  style={{ fontFamily: "Lora, serif", color: "#251218" }}
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={createPost}
                    disabled={isPosting || !newPostContent.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span
                      className="text-sm uppercase tracking-[0.2em]"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      {isPosting ? "Posting..." : "Post"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {sortedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/10 hover:border-[#c9969e]/20 transition-all"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white font-medium">
                            {post.author?.username?.[0]?.toUpperCase() || "?"}
                          </div>
                          {post.author?.is_online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <p
                            className="text-[#251218] font-medium"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            @{post.author?.username || "unknown"}
                          </p>
                          <p
                            className="text-xs text-[#251218]/50"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {post.is_pinned && (
                          <Pin className="w-4 h-4 text-[#c9969e] ml-2" fill="currentColor" />
                        )}
                      </div>

                      {post.author_id === user.id && (
                        <div className="relative">
                          <button className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-[#251218]/40" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <p
                      className="text-[#251218] mb-4 leading-relaxed whitespace-pre-wrap"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-[#251218]/5">
                      <button
                        onClick={() => toggleLike(post.id, post.liked_by_current_user || false)}
                        className="flex items-center gap-2 text-[#251218]/60 hover:text-[#c9969e] transition-colors"
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={post.liked_by_current_user ? "currentColor" : "none"}
                        />
                        <span style={{ fontFamily: "Lora, serif" }}>{post.likes_count}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPost(selectedPost === post.id ? null : post.id);
                          if (selectedPost !== post.id) loadComments(post.id);
                        }}
                        className="flex items-center gap-2 text-[#251218]/60 hover:text-[#c9969e] transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span style={{ fontFamily: "Lora, serif" }}>{post.comments_count}</span>
                      </button>

                      <button
                        onClick={() => toggleSave(post.id, post.saved_by_current_user || false)}
                        className="flex items-center gap-2 text-[#251218]/60 hover:text-[#c9969e] transition-colors"
                      >
                        <Bookmark
                          className="w-5 h-5"
                          fill={post.saved_by_current_user ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    {/* Comments Section */}
                    {selectedPost === post.id && (
                      <div className="mt-6 pt-6 border-t border-[#251218]/10">
                        <div className="space-y-4 mb-4">
                          {comments[post.id]?.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9969e]/50 to-[#251218]/50 flex items-center justify-center text-white text-sm">
                                {comment.author?.username?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div className="flex-1">
                                <p
                                  className="text-sm font-medium text-[#251218]"
                                  style={{ fontFamily: "Lora, serif" }}
                                >
                                  @{comment.author?.username || "unknown"}
                                </p>
                                <p
                                  className="text-[#251218]/80 mt-1"
                                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                                >
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                            placeholder="Add a comment..."
                            className="flex-1 px-4 py-2 bg-white/60 border border-[#251218]/10 rounded-lg focus:border-[#c9969e]/30 focus:outline-none transition-all"
                            style={{ fontFamily: "Lora, serif", color: "#251218" }}
                          />
                          <button
                            onClick={() => addComment(post.id)}
                            className="px-4 py-2 bg-[#c9969e] text-white rounded-lg hover:bg-[#251218] transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Online Members */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/10 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#c9969e]" />
                  <h3
                    className="text-lg text-[#251218]"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    Online Now
                  </h3>
                </div>

                <div className="space-y-3">
                  {onlineMembers.slice(0, 10).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white text-sm">
                          {member.username?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm text-[#251218] truncate"
                          style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                        >
                          @{member.username}
                        </p>
                        <p
                          className="text-xs text-[#251218]/50 capitalize"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {member.membership_type?.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {onlineMembers.length > 10 && (
                  <p
                    className="text-xs text-[#251218]/50 mt-4 text-center"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    +{onlineMembers.length - 10} more online
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
