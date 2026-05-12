import { useState } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { Plus, Search, Pin, Trash2, Edit3, Calendar, Tag } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  const notes: Note[] = [
    {
      id: 1,
      title: "Pricing Strategy Insights",
      content: "After reading Chapter 6, I realized I've been underpricing by at least 30%. Key insight: clients who negotiate on price are the same ones who will be difficult throughout the project. My new minimum is $X with no exceptions.",
      tags: ["Pricing", "Strategy"],
      isPinned: true,
      createdAt: "2026-05-08T10:00:00Z",
      updatedAt: "2026-05-08T14:30:00Z",
    },
    {
      id: 2,
      title: "Content Ideas from Community",
      content: "Sarah's post about her 40% price increase got me thinking about sharing my own journey. Could create a series on Instagram about pricing confidence. Points to cover: psychology of value, handling objections, positioning yourself as premium.",
      tags: ["Content", "Community"],
      isPinned: false,
      createdAt: "2026-05-07T16:20:00Z",
      updatedAt: "2026-05-07T16:20:00Z",
    },
    {
      id: 3,
      title: "May Framework Action Items",
      content: "Scaling Systems framework notes:\n\n1. Identify my biggest bottleneck (client onboarding)\n2. Create SOP for consultation process\n3. Research booking automation tools\n4. Draft job description for virtual assistant",
      tags: ["Action Items", "Frameworks"],
      isPinned: true,
      createdAt: "2026-05-06T09:15:00Z",
      updatedAt: "2026-05-08T11:00:00Z",
    },
  ];

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

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
                  Your Notes
                </h1>
                <p
                  className="text-lg text-[#251218]/60 max-w-2xl"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  Capture insights, ideas, and action items as you build
                </p>
              </div>

              <button
                className="flex items-center gap-2 px-8 py-4 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-all duration-300 shadow-lg"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs uppercase tracking-[0.2em]">New Note</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#251218]/30" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-[#251218]/10 rounded-xl focus:border-[#c9969e]/30 focus:outline-none transition-all"
                style={{ fontFamily: "Lora, serif" }}
              />
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="px-12 py-12">
          <div className="max-w-7xl">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-20">
                <p
                  className="text-lg text-[#251218]/40"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  No notes found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-xl transition-all duration-500 cursor-pointer"
                    onClick={() => setSelectedNote(note.id)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {note.isPinned && (
                          <Pin className="w-4 h-4 text-[#c9969e] mb-2" fill="#c9969e" />
                        )}
                        <h3
                          className="text-xl text-[#251218] group-hover:text-[#c9969e] transition-colors mb-2"
                          style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                        >
                          {note.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <p
                      className="text-sm text-[#251218]/70 line-clamp-4 mb-4 leading-relaxed"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      {note.content}
                    </p>

                    {/* Tags */}
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#c9969e]/10 text-[#c9969e] rounded-full text-xs"
                            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#251218]/5">
                      <div className="flex items-center gap-2 text-xs text-[#251218]/40">
                        <Calendar className="w-3 h-3" strokeWidth={1.5} />
                        <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-[#251218]/5 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4 text-[#251218]/40 hover:text-[#c9969e]" strokeWidth={1.5} />
                        </button>
                        <button className="p-1.5 hover:bg-[#251218]/5 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-[#251218]/40 hover:text-red-500" strokeWidth={1.5} />
                        </button>
                      </div>
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
