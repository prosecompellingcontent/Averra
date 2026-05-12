import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useNavigate, Link } from "react-router";
import { supabase } from "@/utils/supabase/client";
import {
  Users,
  Activity,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Upload,
  Settings,
  BarChart3,
  Shield,
  Bell,
  Mail,
  Search,
  Home,
  BookOpen,
  Zap,
} from "lucide-react";

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  blueprintMembers: number;
  goldStandardMembers: number;
  totalPosts: number;
  totalComments: number;
  pendingReports: number;
  revenueThisMonth: number;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    blueprintMembers: 0,
    goldStandardMembers: 0,
    totalPosts: 0,
    totalComments: 0,
    pendingReports: 0,
    revenueThisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/members/login");
      return;
    }
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setIsLoading(true);

    try {
      // Load member stats
      const { data: members, error: membersError } = await supabase
        .from('profiles')
        .select('id, membership_type, membership_status, created_at');

      if (!membersError && members) {
        const blueprintCount = members.filter(m => m.membership_type === 'blueprint').length;
        const goldCount = members.filter(m => m.membership_type === 'gold-standard').length;
        const activeCount = members.filter(m => m.membership_status === 'active').length;

        setStats(prev => ({
          ...prev,
          totalMembers: members.length,
          activeMembers: activeCount,
          blueprintMembers: blueprintCount,
          goldStandardMembers: goldCount,
        }));
      }

      // Load post stats
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true });

      setStats(prev => ({
        ...prev,
        totalPosts: postsCount || 0,
        totalComments: commentsCount || 0,
      }));

      // Load recent members
      const { data: recent } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentMembers(recent || []);

      // Load recent posts
      const { data: recentPosts } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey(username, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentActivity(recentPosts || []);

    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fbf0f3]">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-[#251218]/5">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/admin/dashboard" className="text-2xl text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                AVERRA Admin
              </Link>
              <div className="flex items-center gap-1 px-3 py-1 bg-[#c9969e]/10 rounded-full">
                <Shield className="w-4 h-4 text-[#c9969e]" />
                <span className="text-xs uppercase tracking-wider text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Admin Access
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-[#251218]/60" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#c9969e] rounded-full"></span>
              </button>
              <Link to="/members/dashboard" className="px-4 py-2 text-sm text-[#251218]/70 hover:text-[#251218] transition-colors" style={{ fontFamily: "Lora, serif" }}>
                View as Member
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 bg-[#c9969e]/15 text-[#251218] rounded-lg" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              <Home className="w-4 h-4" />
              Overview
            </Link>
            <Link to="/admin/members" className="flex items-center gap-2 px-4 py-2 text-[#251218]/60 hover:bg-[#251218]/5 rounded-lg transition-colors" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}>
              <Users className="w-4 h-4" />
              Members
            </Link>
            <Link to="/admin/community" className="flex items-center gap-2 px-4 py-2 text-[#251218]/60 hover:bg-[#251218]/5 rounded-lg transition-colors" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}>
              <MessageSquare className="w-4 h-4" />
              Community
            </Link>
            <Link to="/admin/content" className="flex items-center gap-2 px-4 py-2 text-[#251218]/60 hover:bg-[#251218]/5 rounded-lg transition-colors" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}>
              <Upload className="w-4 h-4" />
              Content
            </Link>
            <Link to="/admin/analytics" className="flex items-center gap-2 px-4 py-2 text-[#251218]/60 hover:bg-[#251218]/5 rounded-lg transition-colors" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}>
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
            <Link to="/admin/qa" className="flex items-center gap-2 px-4 py-2 text-[#251218]/60 hover:bg-[#251218]/5 rounded-lg transition-colors" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}>
              <Zap className="w-4 h-4" />
              QA Testing
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-[#c9969e]" />
                <span className="text-xs uppercase tracking-wider text-[#251218]/50" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Total Members
                </span>
              </div>
              <p className="text-3xl text-[#251218] mb-1" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                {stats.totalMembers}
              </p>
              <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                {stats.activeMembers} active
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-[#c9969e]" />
                <span className="text-xs uppercase tracking-wider text-[#251218]/50" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Blueprint
                </span>
              </div>
              <p className="text-3xl text-[#251218] mb-1" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                {stats.blueprintMembers}
              </p>
              <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                members
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-[#c9969e]" />
                <span className="text-xs uppercase tracking-wider text-[#251218]/50" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Gold Standard
                </span>
              </div>
              <p className="text-3xl text-[#251218] mb-1" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                {stats.goldStandardMembers}
              </p>
              <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                members
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="w-8 h-8 text-[#c9969e]" />
                <span className="text-xs uppercase tracking-wider text-[#251218]/50" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Community
                </span>
              </div>
              <p className="text-3xl text-[#251218] mb-1" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                {stats.totalPosts}
              </p>
              <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif" }}>
                {stats.totalComments} comments
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/admin/members" className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20 hover:border-[#c9969e]/40 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-[#c9969e]/10 rounded-xl group-hover:bg-[#c9969e]/20 transition-colors">
                  <Users className="w-6 h-6 text-[#c9969e]" />
                </div>
                <h3 className="text-lg text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                  Manage Members
                </h3>
              </div>
              <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                View, search, and manage all members
              </p>
            </Link>

            <Link to="/admin/community" className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20 hover:border-[#c9969e]/40 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-[#c9969e]/10 rounded-xl group-hover:bg-[#c9969e]/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-[#c9969e]" />
                </div>
                <h3 className="text-lg text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                  Community Moderation
                </h3>
              </div>
              <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                Moderate posts, comments, and discussions
              </p>
            </Link>

            <Link to="/admin/content" className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20 hover:border-[#c9969e]/40 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-[#c9969e]/10 rounded-xl group-hover:bg-[#c9969e]/20 transition-colors">
                  <Upload className="w-6 h-6 text-[#c9969e]" />
                </div>
                <h3 className="text-lg text-[#251218]" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                  Content Management
                </h3>
              </div>
              <p className="text-sm text-[#251218]/60" style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                Upload ebooks, videos, and resources
              </p>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Members */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <h3 className="text-xl text-[#251218] mb-4" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                Recent Members
              </h3>
              <div className="space-y-3">
                {recentMembers.length === 0 ? (
                  <p className="text-sm text-[#251218]/50 text-center py-8" style={{ fontFamily: "Lora, serif" }}>
                    No members yet
                  </p>
                ) : (
                  recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 hover:bg-[#251218]/5 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center text-white text-sm" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                          {member.full_name?.[0] || "M"}
                        </div>
                        <div>
                          <p className="text-sm text-[#251218]" style={{ fontFamily: "Lora, serif", fontWeight: 500 }}>
                            {member.full_name}
                          </p>
                          <p className="text-xs text-[#251218]/50" style={{ fontFamily: "Lora, serif" }}>
                            @{member.username || 'pending'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-2 py-1 bg-[#c9969e]/10 rounded-full">
                          <span className="text-xs text-[#c9969e]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                            {member.membership_type === 'gold-standard' ? 'Gold' : 'Blueprint'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/20">
              <h3 className="text-xl text-[#251218] mb-4" style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}>
                Community Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-[#251218]/50 text-center py-8" style={{ fontFamily: "Lora, serif" }}>
                    No activity yet
                  </p>
                ) : (
                  recentActivity.slice(0, 5).map((post) => (
                    <div key={post.id} className="p-3 hover:bg-[#251218]/5 rounded-lg transition-colors">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-[#c9969e] mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-[#251218] line-clamp-2" style={{ fontFamily: "Lora, serif" }}>
                            {post.content}
                          </p>
                          <p className="text-xs text-[#251218]/50 mt-1" style={{ fontFamily: "Lora, serif" }}>
                            by @{post.author?.username || 'unknown'} • {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
