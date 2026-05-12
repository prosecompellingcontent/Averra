import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "@/utils/supabase/client";

interface Member {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  membership_type: string | null;
  membership_status: string | null;
  created_at: string;
  has_completed_onboarding: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [membershipFilter, setMembershipFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [members, searchTerm, membershipFilter, statusFilter]);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading members:", error);
        return;
      }

      setMembers(data || []);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...members];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.email?.toLowerCase().includes(search) ||
          m.full_name?.toLowerCase().includes(search) ||
          m.username?.toLowerCase().includes(search)
      );
    }

    // Membership type filter
    if (membershipFilter !== "all") {
      filtered = filtered.filter((m) => m.membership_type === membershipFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((m) => m.membership_status === statusFilter);
    }

    setFilteredMembers(filtered);
  };

  const getMembershipLabel = (type: string | null) => {
    if (!type) return "No Membership";
    if (type === "blueprint") return "Blueprint";
    if (type === "gold-standard") return "Gold Standard";
    return type;
  };

  const getStatusBadge = (status: string | null) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (status === "active")
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Active
        </span>
      );
    if (status === "canceled")
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          Canceled
        </span>
      );
    if (status === "past_due")
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Past Due
        </span>
      );
    return (
      <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
        {status || "Unknown"}
      </span>
    );
  };

  const handleSendMessage = async (member: Member) => {
    // TODO: Implement messaging system
    alert(`Send message to ${member.email}`);
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
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
                Member Management
              </h1>
              <p
                className="text-sm text-[#251218]/60 mt-1"
                style={{ fontFamily: "Lora, serif" }}
              >
                View, search, and manage all AVERRA members
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Search Members
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Email, name, or username..."
                className="w-full px-4 py-2 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none"
                style={{ fontFamily: "Lora, serif" }}
              />
            </div>

            {/* Membership Type Filter */}
            <div>
              <label
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Membership Type
              </label>
              <select
                value={membershipFilter}
                onChange={(e) => setMembershipFilter(e.target.value)}
                className="w-full px-4 py-2 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none"
                style={{ fontFamily: "Lora, serif" }}
              >
                <option value="all">All Types</option>
                <option value="blueprint">Blueprint</option>
                <option value="gold-standard">Gold Standard</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none"
                style={{ fontFamily: "Lora, serif" }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="canceled">Canceled</option>
                <option value="past_due">Past Due</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p
              className="text-sm text-[#251218]/60"
              style={{ fontFamily: "Lora, serif" }}
            >
              Showing {filteredMembers.length} of {members.length} members
            </p>
            <button
              onClick={loadMembers}
              className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Members Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-12 text-center">
            <p
              className="text-[#251218]/60"
              style={{ fontFamily: "Lora, serif" }}
            >
              Loading members...
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-12 text-center">
            <p
              className="text-[#251218]/60"
              style={{ fontFamily: "Lora, serif" }}
            >
              No members found
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#251218]/5">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Member
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Membership
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Joined
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Onboarding
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#251218]/10">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-[#251218]/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p
                            className="text-sm text-[#251218] font-medium"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {member.full_name || "No name"}
                          </p>
                          <p
                            className="text-xs text-[#251218]/60"
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {member.email}
                          </p>
                          {member.username && (
                            <p
                              className="text-xs text-[#c9969e]"
                              style={{ fontFamily: "Lora, serif" }}
                            >
                              @{member.username}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm text-[#251218]"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {getMembershipLabel(member.membership_type)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(member.membership_status)}
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {member.has_completed_onboarding ? (
                          <span className="text-green-600 text-sm">✓ Complete</span>
                        ) : (
                          <span className="text-yellow-600 text-sm">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleViewDetails(member)}
                          className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleSendMessage(member)}
                          className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#251218]/10">
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    className="text-2xl text-[#251218]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {selectedMember.full_name || "Member Details"}
                  </h2>
                  <p
                    className="text-sm text-[#251218]/60 mt-1"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {selectedMember.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-[#251218]/60 hover:text-[#251218] text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className="text-xs text-[#251218]/60 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    User ID
                  </p>
                  <p
                    className="text-sm text-[#251218]"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {selectedMember.id}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-[#251218]/60 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Username
                  </p>
                  <p
                    className="text-sm text-[#251218]"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {selectedMember.username || "Not set"}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-[#251218]/60 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Membership Type
                  </p>
                  <p
                    className="text-sm text-[#251218]"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {getMembershipLabel(selectedMember.membership_type)}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-[#251218]/60 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Status
                  </p>
                  {getStatusBadge(selectedMember.membership_status)}
                </div>
                <div>
                  <p
                    className="text-xs text-[#251218]/60 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Joined Date
                  </p>
                  <p
                    className="text-sm text-[#251218]"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {new Date(selectedMember.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-[#251218]/60 mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Onboarding
                  </p>
                  <p
                    className="text-sm text-[#251218]"
                    style={{ fontFamily: "Lora, serif" }}
                  >
                    {selectedMember.has_completed_onboarding ? "Complete" : "Incomplete"}
                  </p>
                </div>
                {selectedMember.stripe_customer_id && (
                  <div>
                    <p
                      className="text-xs text-[#251218]/60 mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Stripe Customer ID
                    </p>
                    <p
                      className="text-sm text-[#251218] font-mono"
                      style={{ fontSize: "11px" }}
                    >
                      {selectedMember.stripe_customer_id}
                    </p>
                  </div>
                )}
                {selectedMember.stripe_subscription_id && (
                  <div>
                    <p
                      className="text-xs text-[#251218]/60 mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Stripe Subscription ID
                    </p>
                    <p
                      className="text-sm text-[#251218] font-mono"
                      style={{ fontSize: "11px" }}
                    >
                      {selectedMember.stripe_subscription_id}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#251218]/10">
                <button
                  onClick={() => handleSendMessage(selectedMember)}
                  className="flex-1 px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  Send Message
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="flex-1 px-4 py-2 bg-white border border-[#251218]/20 text-[#251218] hover:bg-[#251218]/5 transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
