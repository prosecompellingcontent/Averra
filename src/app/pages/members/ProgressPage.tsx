import { MemberLayout } from "@/app/layouts/MemberLayout";
import { useAuth } from "@/app/context/AuthContext";
import {
  TrendingUp,
  Award,
  BookOpen,
  MessageCircle,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export function ProgressPage() {
  const { user } = useAuth();

  const stats = [
    {
      label: "Member Since",
      value: "April 2026",
      sublabel: "35 days",
      icon: Calendar,
      gradient: "from-[#c9969e] to-[#251218]",
    },
    {
      label: "Chapters Read",
      value: "6 / 12",
      sublabel: "50% complete",
      icon: BookOpen,
      gradient: "from-[#c9969e]/80 to-[#251218]/80",
    },
    {
      label: "Frameworks Completed",
      value: "2 / 3",
      sublabel: "67% complete",
      icon: FileText,
      gradient: "from-[#c9969e]/60 to-[#251218]/60",
    },
    {
      label: "Community Posts",
      value: "4",
      sublabel: "12 replies",
      icon: MessageCircle,
      gradient: "from-[#c9969e]/40 to-[#251218]/40",
    },
  ];

  const milestones = [
    {
      id: 1,
      title: "Started Your Journey",
      description: "Joined AVERRA and completed onboarding",
      date: "April 5, 2026",
      completed: true,
    },
    {
      id: 2,
      title: "First Framework Completed",
      description: "Finished Premium Pricing Psychology framework",
      date: "April 12, 2026",
      completed: true,
    },
    {
      id: 3,
      title: "Community Connection",
      description: "Posted your first discussion in the community",
      date: "April 18, 2026",
      completed: true,
    },
    {
      id: 4,
      title: "Halfway Through The Book",
      description: "Completed 50% of The Gold Standard",
      date: "May 1, 2026",
      completed: true,
    },
    {
      id: 5,
      title: "Month One Complete",
      description: "30 days of consistent engagement",
      date: "May 5, 2026",
      completed: true,
    },
    {
      id: 6,
      title: "Framework Mastery",
      description: "Complete all monthly frameworks",
      date: "In progress",
      completed: false,
    },
    {
      id: 7,
      title: "Finished The Gold Standard",
      description: "Read all 12 chapters",
      date: "In progress",
      completed: false,
    },
  ];

  const monthlyActivity = [
    { month: "April", chaptersRead: 4, frameworksCompleted: 1, posts: 2 },
    { month: "May", chaptersRead: 2, frameworksCompleted: 1, posts: 2 },
  ];

  const currentGoals = [
    {
      title: "Complete May Framework",
      description: "Finish reading Scaling Systems",
      progress: 60,
    },
    {
      title: "Implement Pricing Changes",
      description: "Apply new pricing strategy to 3 upcoming clients",
      progress: 33,
    },
    {
      title: "Engage Weekly",
      description: "Post or comment in community at least once per week",
      progress: 75,
    },
  ];

  return (
    <MemberLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#c9969e]/5 rounded-full blur-3xl"></div>

          <div className="relative px-12 py-12">
            <div className="max-w-5xl">
              <h1
                className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05] mb-3"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                Your Progress
              </h1>
              <p
                className="text-lg text-[#251218]/60"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                Tracking your growth journey
              </p>
            </div>
          </div>
        </div>

        <div className="px-12 py-12">
          <div className="max-w-7xl space-y-16">
            {/* Stats Overview */}
            <div>
              <h2
                className="text-2xl text-[#251218] mb-8"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-xl transition-all duration-500"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      <p
                        className="text-xs text-[#251218]/50 mb-2 uppercase tracking-[0.15em]"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        {stat.label}
                      </p>
                      <p
                        className="text-3xl text-[#251218] mb-1"
                        style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="text-sm text-[#251218]/50"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        {stat.sublabel}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Goals */}
            <div>
              <h2
                className="text-2xl text-[#251218] mb-8"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Current Focus
              </h2>

              <div className="space-y-4">
                {currentGoals.map((goal, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c9969e]/10 hover:border-[#c9969e]/30 transition-all duration-500"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3
                          className="text-lg text-[#251218] mb-1"
                          style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                        >
                          {goal.title}
                        </h3>
                        <p
                          className="text-sm text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          {goal.description}
                        </p>
                      </div>
                      <span
                        className="text-sm text-[#c9969e]"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        {goal.progress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-[#251218]/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#c9969e] to-[#251218] transition-all duration-700"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Timeline */}
            <div>
              <h2
                className="text-2xl text-[#251218] mb-8"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Milestones
              </h2>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#c9969e] via-[#c9969e]/50 to-[#251218]/20"></div>

                <div className="space-y-8">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="relative flex items-start gap-6">
                      {/* Timeline Dot */}
                      <div
                        className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#fdf5f7] ${
                          milestone.completed
                            ? "bg-gradient-to-br from-[#c9969e] to-[#251218]"
                            : "bg-white/60 backdrop-blur-sm border-[#251218]/10"
                        }`}
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2} />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-[#251218]/20"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-500 ${
                          milestone.completed
                            ? "border-[#c9969e]/20"
                            : "border-[#251218]/10"
                        }`}
                      >
                        <h3
                          className="text-lg text-[#251218] mb-2"
                          style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                        >
                          {milestone.title}
                        </h3>
                        <p
                          className="text-sm text-[#251218]/60 mb-3"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          {milestone.description}
                        </p>
                        <p
                          className="text-xs text-[#251218]/40"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          {milestone.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Activity */}
            <div>
              <h2
                className="text-2xl text-[#251218] mb-8"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Monthly Activity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {monthlyActivity.map((month, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#c9969e]/10"
                  >
                    <h3
                      className="text-xl text-[#251218] mb-6"
                      style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                    >
                      {month.month}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          Chapters Read
                        </span>
                        <span
                          className="text-lg text-[#251218]"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                        >
                          {month.chaptersRead}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          Frameworks Completed
                        </span>
                        <span
                          className="text-lg text-[#251218]"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                        >
                          {month.frameworksCompleted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          Community Posts
                        </span>
                        <span
                          className="text-lg text-[#251218]"
                          style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                        >
                          {month.posts}
                        </span>
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
