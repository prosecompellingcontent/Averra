import { useState } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { Video, Calendar, Clock, Users, Play, Download, Bookmark } from "lucide-react";

interface StrategyCall {
  id: number;
  title: string;
  date: string;
  duration: string;
  topic: string;
  attendees: number;
  isUpcoming: boolean;
  isRecorded: boolean;
  chapters?: { time: string; title: string }[];
  thumbnail: string;
}

export function StrategyCallsPage() {
  const [selectedCall, setSelectedCall] = useState<number | null>(null);

  const calls: StrategyCall[] = [
    {
      id: 1,
      title: "Building Your First Digital Product",
      date: "May 15, 2026",
      duration: "90 min",
      topic: "Passive Income Strategy",
      attendees: 12,
      isUpcoming: true,
      isRecorded: false,
      thumbnail: "gradient-1",
    },
    {
      id: 2,
      title: "Scaling Beyond Solopreneurship",
      date: "April 22, 2026",
      duration: "85 min",
      topic: "Team Building",
      attendees: 15,
      isUpcoming: false,
      isRecorded: true,
      thumbnail: "gradient-2",
      chapters: [
        { time: "0:00", title: "Introduction & Current Challenges" },
        { time: "12:30", title: "When to Hire Your First Team Member" },
        { time: "34:15", title: "Delegation Without Losing Quality" },
        { time: "58:00", title: "Building Systems for Consistency" },
        { time: "72:45", title: "Q&A Session" },
      ],
    },
    {
      id: 3,
      title: "Premium Client Positioning",
      date: "April 8, 2026",
      duration: "78 min",
      topic: "Brand Strategy",
      attendees: 18,
      isUpcoming: false,
      isRecorded: true,
      thumbnail: "gradient-3",
      chapters: [
        { time: "0:00", title: "Welcome & Agenda" },
        { time: "8:20", title: "The Psychology of Premium Pricing" },
        { time: "28:45", title: "Positioning Statement Workshop" },
        { time: "51:30", title: "Client Selection Criteria" },
        { time: "65:00", title: "Live Q&A" },
      ],
    },
  ];

  const upcomingCall = calls.find((call) => call.isUpcoming);
  const pastCalls = calls.filter((call) => !call.isUpcoming);

  if (selectedCall) {
    const call = calls.find((c) => c.id === selectedCall);
    if (!call) return null;

    return (
      <MemberLayout>
        <div className="min-h-screen">
          {/* Video Player */}
          <div className="bg-[#251218]">
            <div className="max-w-7xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20">
                    <Play className="w-12 h-12 text-white ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call Info */}
          <div className="px-12 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <button
                    onClick={() => setSelectedCall(null)}
                    className="text-sm text-[#251218]/60 hover:text-[#251218] mb-6 transition-colors"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    ← Back to All Calls
                  </button>

                  <h1
                    className="text-4xl text-[#251218] mb-4"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    {call.title}
                  </h1>

                  <div className="flex items-center gap-6 text-sm text-[#251218]/60 mb-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" strokeWidth={1.5} />
                      <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                        {call.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" strokeWidth={1.5} />
                      <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                        {call.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" strokeWidth={1.5} />
                      <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                        {call.attendees} members
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-[#c9969e]/30 via-[#c9969e]/10 to-transparent mb-8"></div>

                  {/* Chapters */}
                  {call.chapters && (
                    <div>
                      <h2
                        className="text-xl text-[#251218] mb-6"
                        style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                      >
                        Chapters
                      </h2>

                      <div className="space-y-3">
                        {call.chapters.map((chapter, index) => (
                          <button
                            key={index}
                            className="w-full flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#251218]/5 hover:border-[#c9969e]/30 hover:shadow-lg transition-all duration-300 text-left group"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 flex items-center justify-center group-hover:from-[#c9969e] group-hover:to-[#251218] transition-all">
                              <Play className="w-4 h-4 text-[#c9969e] group-hover:text-white" strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                              <p
                                className="text-sm text-[#251218] mb-1"
                                style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                              >
                                {chapter.title}
                              </p>
                              <p
                                className="text-xs text-[#251218]/40"
                                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                              >
                                {chapter.time}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/10">
                    <h3
                      className="text-lg text-[#251218] mb-4"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      Actions
                    </h3>

                    <div className="space-y-3">
                      <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#251218]/5 hover:bg-[#c9969e]/10 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-[#251218]/60" strokeWidth={1.5} />
                        <span
                          className="text-sm text-[#251218]"
                          style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                        >
                          Download Recording
                        </span>
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#251218]/5 hover:bg-[#c9969e]/10 rounded-lg transition-colors">
                        <Bookmark className="w-4 h-4 text-[#251218]/60" strokeWidth={1.5} />
                        <span
                          className="text-sm text-[#251218]"
                          style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                        >
                          Save for Later
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#fdf5f7] to-[#fbf0f3] rounded-2xl p-6 border border-[#c9969e]/10">
                    <p
                      className="text-xs uppercase tracking-[0.15em] text-[#c9969e] mb-3"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                    >
                      Topic
                    </p>
                    <p
                      className="text-base text-[#251218]"
                      style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                    >
                      {call.topic}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c9969e]/5 rounded-full blur-3xl"></div>

          <div className="relative px-12 py-12">
            <div className="max-w-5xl">
              <div className="inline-block px-6 py-2 bg-white/40 backdrop-blur-sm border border-[#c9969e]/20 rounded-full mb-6">
                <p
                  className="text-[9px] uppercase tracking-[0.25em] text-[#c9969e]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                >
                  Gold Standard Exclusive
                </p>
              </div>

              <h1
                className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05] mb-4"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                Strategy Calls
              </h1>
              <p
                className="text-lg text-[#251218]/60 max-w-2xl"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                Monthly group strategy sessions with Jayla and fellow Gold Standard members
              </p>
            </div>
          </div>
        </div>

        <div className="px-12 py-16">
          <div className="max-w-6xl space-y-16">
            {/* Upcoming Call */}
            {upcomingCall && (
              <div>
                <h2
                  className="text-2xl text-[#251218] mb-8"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Next Call
                </h2>

                <div className="bg-gradient-to-br from-[#c9969e] to-[#251218] rounded-2xl overflow-hidden border border-[#c9969e]/20 shadow-2xl">
                  <div className="relative p-12">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                    <div className="relative">
                      <p
                        className="text-sm uppercase tracking-[0.2em] text-white/80 mb-4"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        {upcomingCall.topic}
                      </p>
                      <h3
                        className="text-4xl text-white mb-6"
                        style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                      >
                        {upcomingCall.title}
                      </h3>

                      <div className="flex items-center gap-8 text-white/80 mb-8">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" strokeWidth={1.5} />
                          <span
                            className="text-sm"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            {upcomingCall.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" strokeWidth={1.5} />
                          <span
                            className="text-sm"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            {upcomingCall.duration}
                          </span>
                        </div>
                      </div>

                      <button className="px-8 py-4 bg-white text-[#251218] hover:bg-white/90 transition-colors shadow-lg">
                        <span
                          className="text-xs uppercase tracking-[0.2em]"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          Add to Calendar
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Past Calls Archive */}
            <div>
              <h2
                className="text-2xl text-[#251218] mb-8"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Replay Archive
              </h2>

              <div className="grid grid-cols-1 gap-8">
                {pastCalls.map((call) => (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call.id)}
                    className="group bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-2xl transition-all duration-700 cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row gap-0">
                      {/* Thumbnail */}
                      <div className="relative w-full md:w-80 aspect-video bg-gradient-to-br from-[#c9969e] to-[#251218] flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                        <div className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8">
                        <p
                          className="text-xs uppercase tracking-[0.15em] text-[#c9969e] mb-3"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                        >
                          {call.topic}
                        </p>

                        <h3
                          className="text-2xl text-[#251218] mb-4 group-hover:text-[#c9969e] transition-colors"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                        >
                          {call.title}
                        </h3>

                        <div className="flex items-center gap-6 text-sm text-[#251218]/60">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" strokeWidth={1.5} />
                            <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                              {call.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" strokeWidth={1.5} />
                            <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                              {call.duration}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" strokeWidth={1.5} />
                            <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                              {call.chapters?.length || 0} chapters
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
