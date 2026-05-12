import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "@/utils/supabase/client";

interface AnalyticsData {
  totalMembers: number;
  activeMembers: number;
  blueprintMembers: number;
  goldMembers: number;
  totalPosts: number;
  totalComments: number;
  newMembersThisMonth: number;
  engagementRate: number;
  topContributors: Array<{
    id: string;
    name: string;
    username: string | null;
    postCount: number;
    commentCount: number;
  }>;
  recentActivity: Array<{
    date: string;
    posts: number;
    comments: number;
    newMembers: number;
  }>;
}

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<string>("30");

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      // Get member stats
      const { data: members, error: membersError } = await supabase
        .from("profiles")
        .select("id, membership_type, membership_status, created_at");

      if (membersError) {
        console.error("Error loading members:", membersError);
      }

      const totalMembers = members?.length || 0;
      const activeMembers = members?.filter(m => m.membership_status === "active").length || 0;
      const blueprintMembers = members?.filter(m => m.membership_type === "blueprint").length || 0;
      const goldMembers = members?.filter(m => m.membership_type === "gold-standard").length || 0;

      // Get new members this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const newMembersThisMonth = members?.filter(m =>
        new Date(m.created_at) >= startOfMonth
      ).length || 0;

      // Get post and comment counts
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("id, author_id, created_at");

      if (postsError) {
        console.error("Error loading posts:", postsError);
      }

      const totalPosts = posts?.length || 0;

      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("id, author_id, created_at");

      if (commentsError) {
        console.error("Error loading comments:", commentsError);
      }

      const totalComments = comments?.length || 0;

      // Calculate engagement rate (members who have posted or commented)
      const activeContributors = new Set([
        ...(posts?.map(p => p.author_id) || []),
        ...(comments?.map(c => c.author_id) || [])
      ]);
      const engagementRate = totalMembers > 0
        ? (activeContributors.size / totalMembers) * 100
        : 0;

      // Get top contributors
      const contributorMap = new Map<string, { posts: number; comments: number }>();

      posts?.forEach(post => {
        const current = contributorMap.get(post.author_id) || { posts: 0, comments: 0 };
        contributorMap.set(post.author_id, { ...current, posts: current.posts + 1 });
      });

      comments?.forEach(comment => {
        const current = contributorMap.get(comment.author_id) || { posts: 0, comments: 0 };
        contributorMap.set(comment.author_id, { ...current, comments: current.comments + 1 });
      });

      const topContributorIds = Array.from(contributorMap.entries())
        .sort((a, b) => (b[1].posts + b[1].comments) - (a[1].posts + a[1].comments))
        .slice(0, 10)
        .map(([id]) => id);

      const { data: topContributorProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, username")
        .in("id", topContributorIds);

      const topContributors = topContributorProfiles?.map(profile => {
        const stats = contributorMap.get(profile.id);
        return {
          id: profile.id,
          name: profile.full_name || "Unknown",
          username: profile.username,
          postCount: stats?.posts || 0,
          commentCount: stats?.comments || 0,
        };
      }) || [];

      // Get recent activity (last 30 days)
      const daysBack = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const recentActivity: Array<{
        date: string;
        posts: number;
        comments: number;
        newMembers: number;
      }> = [];

      for (let i = 0; i < daysBack; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (daysBack - i - 1));
        const dateStr = date.toISOString().split('T')[0];

        const dayPosts = posts?.filter(p =>
          p.created_at.startsWith(dateStr)
        ).length || 0;

        const dayComments = comments?.filter(c =>
          c.created_at.startsWith(dateStr)
        ).length || 0;

        const dayMembers = members?.filter(m =>
          m.created_at.startsWith(dateStr)
        ).length || 0;

        recentActivity.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          posts: dayPosts,
          comments: dayComments,
          newMembers: dayMembers,
        });
      }

      setAnalytics({
        totalMembers,
        activeMembers,
        blueprintMembers,
        goldMembers,
        totalPosts,
        totalComments,
        newMembersThisMonth,
        engagementRate,
        topContributors,
        recentActivity,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setIsLoading(false);
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
                Analytics Dashboard
              </h1>
              <p
                className="text-sm text-[#251218]/60 mt-1"
                style={{ fontFamily: "Lora, serif" }}
              >
                Track engagement, growth, and community metrics
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
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-12 text-center">
            <p
              className="text-[#251218]/60"
              style={{ fontFamily: "Lora, serif" }}
            >
              Loading analytics...
            </p>
          </div>
        ) : analytics ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
                <p
                  className="text-sm text-[#251218]/60 mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Total Members
                </p>
                <p
                  className="text-3xl text-[#251218] font-medium"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {analytics.totalMembers}
                </p>
                <p
                  className="text-xs text-[#251218]/60 mt-2"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  {analytics.activeMembers} active
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
                <p
                  className="text-sm text-[#251218]/60 mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Membership Split
                </p>
                <p
                  className="text-lg text-[#251218]"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  {analytics.blueprintMembers} Blueprint
                </p>
                <p
                  className="text-lg text-[#c9969e]"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  {analytics.goldMembers} Gold Standard
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
                <p
                  className="text-sm text-[#251218]/60 mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Community Activity
                </p>
                <p
                  className="text-3xl text-[#251218] font-medium"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {analytics.totalPosts}
                </p>
                <p
                  className="text-xs text-[#251218]/60 mt-2"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  {analytics.totalComments} comments
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
                <p
                  className="text-sm text-[#251218]/60 mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Engagement Rate
                </p>
                <p
                  className="text-3xl text-[#251218] font-medium"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {analytics.engagementRate.toFixed(1)}%
                </p>
                <p
                  className="text-xs text-[#251218]/60 mt-2"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  {analytics.newMembersThisMonth} new this month
                </p>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-lg text-[#251218]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Recent Activity
                </h2>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none text-sm"
                  style={{ fontFamily: "Lora, serif" }}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#251218]/10">
                      <th
                        className="text-left py-2 px-4 text-[#251218]/60"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
                      >
                        Date
                      </th>
                      <th
                        className="text-left py-2 px-4 text-[#251218]/60"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
                      >
                        Posts
                      </th>
                      <th
                        className="text-left py-2 px-4 text-[#251218]/60"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
                      >
                        Comments
                      </th>
                      <th
                        className="text-left py-2 px-4 text-[#251218]/60"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
                      >
                        New Members
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentActivity.slice(-14).map((day, index) => (
                      <tr key={index} className="border-b border-[#251218]/5">
                        <td
                          className="py-2 px-4 text-[#251218]"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {day.date}
                        </td>
                        <td
                          className="py-2 px-4 text-[#251218]"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {day.posts}
                        </td>
                        <td
                          className="py-2 px-4 text-[#251218]"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {day.comments}
                        </td>
                        <td
                          className="py-2 px-4 text-[#c9969e]"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {day.newMembers}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
              <h2
                className="text-lg text-[#251218] mb-6"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Top Contributors
              </h2>

              <div className="space-y-4">
                {analytics.topContributors.length === 0 ? (
                  <p
                    className="text-[#251218]/60 text-center py-8"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    No contributors yet
                  </p>
                ) : (
                  analytics.topContributors.map((contributor, index) => (
                    <div
                      key={contributor.id}
                      className="flex items-center justify-between p-4 bg-[#251218]/5 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-8 h-8 bg-[#c9969e] text-white rounded-full flex items-center justify-center text-sm font-medium"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p
                            className="text-sm text-[#251218] font-medium"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {contributor.name}
                          </p>
                          {contributor.username && (
                            <p
                              className="text-xs text-[#251218]/60"
                              style={{ fontFamily: "Lora, serif" }}
                            >
                              @{contributor.username}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-sm text-[#251218]"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {contributor.postCount} posts
                        </p>
                        <p
                          className="text-xs text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {contributor.commentCount} comments
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-12 text-center">
            <p
              className="text-[#251218]/60"
              style={{ fontFamily: "Lora, serif" }}
            >
              Failed to load analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
