import { useState } from "react";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { FileText, Download, Calendar, ArrowRight, BookOpen, CheckCircle2, Sparkles } from "lucide-react";

export function FrameworksPage() {
  const [selectedFramework, setSelectedFramework] = useState<number | null>(null);

  const frameworks = [
    {
      id: 1,
      title: "Scaling Systems",
      subtitle: "May 2026 Framework",
      description:
        "Building repeatable processes that let your business grow without constant hands-on management",
      date: "May 1, 2026",
      duration: "45 min read",
      isNew: true,
      coverGradient: "from-[#c9969e] to-[#251218]",
      sections: [
        "Identifying Your Business Bottlenecks",
        "Creating Systems That Don't Require You",
        "Hiring & Delegation Without Losing Control",
        "Automating Client Onboarding",
        "Building Standard Operating Procedures"
      ]
    },
    {
      id: 2,
      title: "Premium Pricing Psychology",
      subtitle: "April 2026 Framework",
      description:
        "Understanding how to price for value and attract clients who don't negotiate",
      date: "Apr 1, 2026",
      duration: "38 min read",
      isNew: false,
      coverGradient: "from-[#c9969e]/80 to-[#251218]/80",
      sections: [
        "The Psychology of High-Ticket Pricing",
        "Positioning Yourself Above Market Rates",
        "Handling Discount Requests With Grace",
        "Creating Irresistible Premium Packages",
        "Value Anchoring & Price Confidence"
      ]
    },
    {
      id: 3,
      title: "Strategic Content Marketing",
      subtitle: "March 2026 Framework",
      description:
        "Building a content engine that establishes authority and generates consistent leads",
      date: "Mar 1, 2026",
      duration: "42 min read",
      isNew: false,
      coverGradient: "from-[#c9969e]/60 to-[#251218]/60",
      sections: [
        "Finding Your Signature Content Voice",
        "The 80/20 of Platform Selection",
        "Creating Content That Converts",
        "Batching & Repurposing Strategy",
        "Measuring What Actually Matters"
      ]
    },
  ];

  if (selectedFramework) {
    const framework = frameworks.find(f => f.id === selectedFramework);
    if (!framework) return null;

    return (
      <MemberLayout>
        <div className="min-h-screen">
          {/* Framework Reader Header */}
          <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#251218]/5">
            <div className="px-12 py-6 flex items-center justify-between">
              <button
                onClick={() => setSelectedFramework(null)}
                className="flex items-center gap-2 text-[#251218]/60 hover:text-[#251218] transition-colors"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span className="text-sm">Back to Frameworks</span>
              </button>

              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-[#251218]/60 hover:text-[#c9969e]" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <article className="max-w-4xl mx-auto px-12 py-20">
            {/* Hero */}
            <div className="mb-16">
              <div className="mb-6">
                <span
                  className="text-xs uppercase tracking-[0.3em] text-[#c9969e]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  {framework.subtitle}
                </span>
              </div>

              <h1
                className="text-[clamp(3rem,6vw,5rem)] text-[#251218] leading-[1] mb-8"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.02em" }}
              >
                {framework.title}
              </h1>

              <p
                className="text-2xl text-[#251218]/70 leading-relaxed mb-8"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                {framework.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-[#251218]/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    {framework.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" strokeWidth={1.5} />
                  <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                    {framework.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[#c9969e]/30 to-transparent mb-16"></div>

            {/* Table of Contents */}
            <div className="bg-gradient-to-br from-[#fdf5f7] to-[#fbf0f3] rounded-2xl p-10 mb-16 border border-[#c9969e]/10">
              <h2
                className="text-xl text-[#251218] mb-6"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                In This Framework
              </h2>
              <div className="space-y-4">
                {framework.sections.map((section, index) => (
                  <div key={index} className="flex items-start gap-4 group cursor-pointer">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/60 flex items-center justify-center text-[#c9969e] border border-[#c9969e]/20 group-hover:bg-[#c9969e] group-hover:text-white transition-all">
                      <span
                        className="text-xs"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <p
                      className="text-base text-[#251218]/70 group-hover:text-[#251218] transition-colors pt-0.5"
                      style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                    >
                      {section}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Article Body Placeholder */}
            <div className="prose-custom space-y-8">
              <p
                className="text-lg text-[#251218]/80 leading-relaxed"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                [Framework content would be loaded here from your CMS or database. This is a preview of the reading experience your members will have.]
              </p>
            </div>
          </article>
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
            <div className="max-w-4xl">
              <div className="inline-block px-6 py-2 bg-white/40 backdrop-blur-sm border border-[#c9969e]/20 rounded-full mb-6">
                <p
                  className="text-[9px] uppercase tracking-[0.25em] text-[#c9969e]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                >
                  Business Strategy
                </p>
              </div>

              <h1
                className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05] mb-4"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
              >
                Monthly Frameworks
              </h1>
              <p
                className="text-lg text-[#251218]/60 max-w-2xl"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                Deep-dive strategic briefings delivered monthly. One focused framework at a time, designed to transform how you build.
              </p>
            </div>
          </div>
        </div>

        {/* Framework Archive */}
        <div className="px-12 py-16">
          <div className="max-w-6xl">
            <div className="grid grid-cols-1 gap-8">
              {frameworks.map((framework) => (
                <div
                  key={framework.id}
                  onClick={() => setSelectedFramework(framework.id)}
                  className="group relative bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#c9969e]/10 hover:border-[#c9969e]/30 hover:shadow-2xl transition-all duration-700 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row gap-0">
                    {/* Magazine Cover */}
                    <div className={`relative w-full md:w-80 aspect-[3/4] bg-gradient-to-br ${framework.coverGradient} flex-shrink-0`}>
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                      <div className="relative h-full flex flex-col justify-between p-8">
                        <div>
                          {framework.isNew && (
                            <div className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full mb-4">
                              <span
                                className="text-[9px] uppercase tracking-[0.25em] text-[#c9969e]"
                                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                              >
                                New Release
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <p
                            className="text-white/80 text-sm mb-3"
                            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, letterSpacing: "0.15em" }}
                          >
                            {framework.subtitle.toUpperCase()}
                          </p>
                          <h3
                            className="text-white text-4xl leading-tight"
                            style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                          >
                            {framework.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1 p-10 flex flex-col justify-between">
                      <div>
                        <p
                          className="text-xl text-[#251218]/70 leading-relaxed mb-8"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          {framework.description}
                        </p>

                        <div className="space-y-3 mb-8">
                          {framework.sections.slice(0, 3).map((section, index) => (
                            <div key={index} className="flex items-center gap-3 text-[#251218]/60">
                              <CheckCircle2 className="w-4 h-4 text-[#c9969e]" strokeWidth={1.5} />
                              <span
                                className="text-sm"
                                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                              >
                                {section}
                              </span>
                            </div>
                          ))}
                          {framework.sections.length > 3 && (
                            <p
                              className="text-sm text-[#251218]/40 pl-7"
                              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                            >
                              + {framework.sections.length - 3} more sections
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-[#251218]/50">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" strokeWidth={1.5} />
                            <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                              {framework.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                            <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>
                              {framework.duration}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[#c9969e] group-hover:translate-x-2 transition-transform duration-500">
                          <span
                            className="text-sm uppercase tracking-[0.2em]"
                            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                          >
                            Read
                          </span>
                          <ArrowRight className="w-4 h-4" strokeWidth={2} />
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
    </MemberLayout>
  );
}
