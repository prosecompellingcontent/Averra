import { useState } from "react";
import { Link } from "react-router";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import {
  BookOpen,
  Download,
  Bookmark,
  Volume2,
  Maximize,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
} from "lucide-react";

export function LibraryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(34);

  const totalPages = 9;

  return (
    <MemberLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed] border-b border-[#251218]/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c9969e]/5 rounded-full blur-3xl"></div>

          <div className="relative px-12 py-16">
            <h1
              className="text-[clamp(2.5rem,5vw,4rem)] text-[#251218] leading-[1.05] mb-4"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              Your Digital
              <br />
              <span className="italic text-[#c9969e]">Library</span>
            </h1>
            <p
              className="text-lg text-[#251218]/60"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              Access your collection anytime, anywhere
            </p>
          </div>
        </div>

        {/* Main Library */}
        <div className="px-12 py-12">
          <div className="max-w-6xl">
            {/* Featured Book */}
            <div className="mb-16">
              <p
                className="text-xs uppercase tracking-[0.3em] text-[#c9969e] mb-6"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                Continue Reading
              </p>

              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-[#c9969e]/20 shadow-2xl overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-[#c9969e]/10 to-transparent rounded-full blur-3xl"></div>

                <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                  {/* Book Cover */}
                  <div className="lg:col-span-1">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative aspect-[3/4] bg-gradient-to-br from-[#c9969e] via-[#b88890] to-[#251218] rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                        {/* Pattern overlay */}
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                        }}></div>

                        <div className="relative z-10 text-center p-12">
                          <h2
                            className="text-4xl text-white mb-4 leading-tight"
                            style={{
                              fontFamily: "Playfair Display, serif",
                              fontWeight: 400,
                            }}
                          >
                            The Gold
                            <br />
                            <span className="italic font-light">Standard</span>
                          </h2>
                          <div className="h-px bg-white/30 mb-4"></div>
                          <p
                            className="text-white/90 text-sm"
                            style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                          >
                            Building Beyond The Chair
                          </p>
                          <p
                            className="text-white/60 text-xs mt-2"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            by Jayla · AVERRA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3
                        className="text-3xl text-[#251218] mb-3"
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontWeight: 400,
                        }}
                      >
                        The Gold Standard
                      </h3>
                      <p
                        className="text-sm text-[#251218]/50"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        BUILDING BEYOND THE CHAIR
                      </p>
                    </div>

                    <p
                      className="text-base text-[#251218]/70 leading-relaxed"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      The eBook for beauty professionals who are done trading hours for money and ready to build something that actually scales. Nine chapters, zero fluff. The blueprint for building a business that doesn't require you to sacrifice yourself to maintain it.
                    </p>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p
                          className="text-sm text-[#251218]/60"
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          Reading Progress
                        </p>
                        <p
                          className="text-sm text-[#c9969e]"
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          {readingProgress}%
                        </p>
                      </div>
                      <div className="h-2 bg-[#251218]/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#c9969e] to-[#251218] transition-all duration-500"
                          style={{ width: `${readingProgress}%` }}
                        ></div>
                      </div>
                      <p
                        className="text-xs text-[#251218]/50 mt-2"
                        style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                      >
                        Chapter 3 of 9 · Last read 2 hours ago
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Link
                        to="/members/library/the-gold-standard"
                        className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:scale-105 transition-all duration-300 shadow-lg"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        <BookOpen className="w-5 h-5" />
                        <span className="text-sm uppercase tracking-[0.2em]">
                          Continue Reading
                        </span>
                      </Link>

                      <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`flex items-center gap-3 px-6 py-4 border transition-all duration-300 ${
                          isBookmarked
                            ? "border-[#c9969e] bg-[#c9969e]/10 text-[#c9969e]"
                            : "border-[#251218]/20 bg-white/40 text-[#251218]/70 hover:border-[#c9969e] hover:text-[#c9969e]"
                        }`}
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        <Bookmark
                          className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                        />
                      </button>

                      <button
                        className="flex items-center gap-3 px-6 py-4 border border-[#251218]/20 bg-white/40 text-[#251218]/70 hover:border-[#c9969e] hover:text-[#c9969e] transition-all duration-300"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter List */}
            <div>
              <h3
                className="text-2xl text-[#251218] mb-8"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                Chapters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { num: 1, title: "Why Being Fully Booked Isn't Freedom", time: "12 min" },
                  { num: 2, title: "The Nervous System of Staying Stuck", time: "15 min" },
                  { num: 3, title: "What This Business Model Is Really Costing You", time: "18 min", current: true },
                  { num: 4, title: "Building Income Beyond The Chair", time: "22 min" },
                  { num: 5, title: "The Seasonal Roadmap to Business Ownership", time: "25 min" },
                  { num: 6, title: "Premium Pricing Psychology", time: "20 min" },
                  { num: 7, title: "Client Loyalty That Lasts", time: "16 min" },
                  { num: 8, title: "Becoming The Brand People Don't Negotiate With", time: "19 min" },
                  { num: 9, title: "Your Next 12 Months", time: "14 min" },
                ].map((chapter) => (
                  <button
                    key={chapter.num}
                    onClick={() => {
                      setCurrentPage(chapter.num);
                      setIsReading(true);
                    }}
                    className={`group text-left p-6 rounded-xl border transition-all duration-300 ${
                      chapter.current
                        ? "bg-white/80 backdrop-blur-sm border-[#c9969e]/30 shadow-lg"
                        : "bg-white/40 backdrop-blur-sm border-[#251218]/10 hover:border-[#c9969e]/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        chapter.current
                          ? "bg-gradient-to-br from-[#c9969e] to-[#251218]"
                          : "bg-[#c9969e]/10 group-hover:bg-[#c9969e]/20"
                      }`}>
                        <span
                          className={`text-sm ${chapter.current ? 'text-white' : 'text-[#c9969e]'}`}
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          {String(chapter.num).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-base mb-2 transition-colors ${
                            chapter.current
                              ? "text-[#251218]"
                              : "text-[#251218]/80 group-hover:text-[#c9969e]"
                          }`}
                          style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                        >
                          {chapter.title}
                        </h4>
                        <p
                          className="text-sm text-[#251218]/50"
                          style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                        >
                          {chapter.time} read
                        </p>
                      </div>
                      {chapter.current && (
                        <div className="flex-shrink-0">
                          <div className="px-3 py-1 bg-[#c9969e]/20 rounded-full">
                            <span
                              className="text-xs text-[#c9969e]"
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                              }}
                            >
                              Reading
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}

function EbookReader({
  currentPage,
  setCurrentPage,
  onClose,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onClose: () => void;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"
      } bg-[#fdf5f7] flex flex-col`}
    >
      {/* Reader Header */}
      <div className="border-b border-[#251218]/5 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#251218]" />
            </button>
            <div>
              <p
                className="text-sm text-[#251218]"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 400,
                }}
              >
                The Gold Standard
              </p>
              <p
                className="text-xs text-[#251218]/50"
                style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
              >
                Chapter {currentPage} of 9
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors group"
              title="Read Aloud"
            >
              <Volume2 className="w-5 h-5 text-[#251218]/40 group-hover:text-[#c9969e]" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors group"
            >
              <Maximize className="w-5 h-5 text-[#251218]/40 group-hover:text-[#c9969e]" />
            </button>
            <button className="p-2 hover:bg-[#251218]/5 rounded-lg transition-colors group">
              <Bookmark className="w-5 h-5 text-[#251218]/40 group-hover:text-[#c9969e]" />
            </button>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-24">
          <article
            className="prose prose-lg max-w-none"
            style={{ fontSize: `${fontSize}px`, fontFamily: "Lora, serif" }}
          >
            <h1
              className="text-5xl mb-12 text-[#251218] leading-tight"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              Chapter {currentPage}
            </h1>

            <div className="space-y-8 text-[#251218]/80 leading-[1.8]">
              <p>
                This is placeholder content for Chapter {currentPage}. In a real
                implementation, this would load the actual eBook content from
                your backend or content management system.
              </p>
              <p>
                The digital library provides a premium reading experience with
                features like bookmarking, progress tracking, and audio narration support.
              </p>
              <p>
                The design maintains the calm, editorial feel of a luxury magazine while providing all the functionality of a modern digital reading experience.
              </p>
            </div>
          </article>
        </div>
      </div>

      {/* Reader Footer Navigation */}
      <div className="border-t border-[#251218]/5 bg-white/50 backdrop-blur-xl sticky bottom-0">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-6 py-3 text-[#251218]/70 hover:text-[#251218] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(9)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`transition-all duration-300 rounded-full ${
                  currentPage === i + 1
                    ? "w-10 h-2.5 bg-gradient-to-r from-[#c9969e] to-[#251218]"
                    : "w-2.5 h-2.5 bg-[#251218]/10 hover:bg-[#251218]/20"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(9, currentPage + 1))}
            disabled={currentPage === 9}
            className="flex items-center gap-2 px-6 py-3 text-[#251218]/70 hover:text-[#251218] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
