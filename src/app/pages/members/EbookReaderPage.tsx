import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MemberLayout } from "@/app/layouts/MemberLayout";
import { useAuth } from "@/app/context/AuthContext";
import {
  BookOpen, ChevronLeft, ChevronRight, Bookmark, Menu,
  Volume2, Maximize, Settings, Sun, Moon, Type, X
} from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const EBOOK_CHAPTERS: Chapter[] = [
  {
    id: "dedication",
    title: "Dedication",
    content: `To the MUA working a 12-hour Saturday with a smile painted on their face and aching feet they won't mention to anyone.

To the lash artist who hasn't taken a real day off in two years and calls it passion when it's actually a fear of failure.

To the nail tech who checks their booking site every hour until midnight because the silence makes them nervous.

To the stylist who has absorbed the weight of every client's heartbreak, exhaustion, and bad day and somehow found a way to keep going.

To the waxers, the brow artists, the barbers, the salon-suite owners, every provider who built something real with their hands, their artistry, and their nervous system and is quietly wondering if this is all there is.

This book is not for who you were when you started. It is for who you have become, and for who you are about to be.`
  },
  {
    id: "introduction",
    title: "Introduction: The Business You Built Is Starting To Own You",
    content: `You didn't become a beauty professional for the money. That's not how this starts for most people. You became one because you felt something when your hands moved, because the transformation you could create in someone else felt like the truest thing you'd ever done. You wanted to be your own boss, set your own schedule, build something that was yours. And you did. You actually did.

Which is exactly why nobody prepared you for this feeling.

The feeling that something is wrong, even though everything looks right. The feeling that you are working harder than you ever have and somehow moving slower than you expected. The feeling that you are the business, that if you stepped away for even two weeks everything would unravel. That the schedule you built is now a cage you maintain. That the clients you love are starting to feel like obligations. That the passion that once felt like oxygen now feels like labor.

You are not burned out because you love your craft less. You are burned out because the business model you are operating inside of was never designed to sustain you.

This is not a book about motivation. You don't need another person telling you to believe in yourself. You've already proven that you believe in yourself. The proof is that you're still standing. Still booking. Still showing up. Still building.

What this book is about is architecture. The invisible architecture of a beauty business that has quietly organized itself around your labor, your presence, your energy, your body, and what it actually takes to rebuild it around something more durable. Around systems, authority, and a kind of wealth that doesn't require you to sacrifice yourself every single day to maintain it.`
  },
  {
    id: "chapter-1",
    title: "Chapter One: The Addiction To Being Needed",
    content: `It's 6:47 in the morning, and before your alarm has fully finished its sound, your hand is already on your phone. Not for any specific reason you could name. Just to check. To see what came in overnight. To make sure the calendar still looks the way it did when you fell asleep. There's something about that moment, that ritual of checking, that feels almost essential. Like breathing. Like your day can't actually start until you know the appointments are there, the messages are waiting, the demand is still real.

You probably haven't named this as an addiction. Why would you? It looks like diligence. It looks like dedication. It looks like the kind of work ethic that built your reputation. But underneath the professionalism, something else is happening, and it has less to do with your clients and everything to do with what their demand means to you.

Being booked doesn't just mean you have income. Being booked means you're wanted. Being needed means you matter. And somewhere along the way, mattering became dependent on how full your schedule was.

For many beauty professionals, and especially for Black beauty providers, Latina providers, Asian providers, and providers of color who built businesses in industries that weren't designed with their success in mind, the act of being booked carries a weight that goes far beyond appointment slots.`
  },
  {
    id: "chapter-2",
    title: "Chapter Two: The Emotional Weight Nobody Sees",
    content: `There is a kind of tiredness that sleep doesn't fix. You've probably felt it, the exhaustion that is still there on Monday morning even when you took Sunday off, that doesn't fully lift between clients, that sits somewhere behind your eyes and in the particular flatness that takes over your voice by the end of a long day. It isn't the tiredness of physical labor, though your hands ache and your lower back has become a constant negotiation. It's something else. Something closer to your core.

This is emotional labor. And in the beauty industry, it is invisible, uncompensated, and wildly underestimated, including by the very people performing it.

Your clients don't just come to you for a service. They come to you for a feeling. An experience. They come to you for a space where someone will actually listen, hold their energy, and send them back into the world feeling seen. And you give it. Every time. Because that's who you are. And that's also what's destroying you.`
  },
  {
    id: "chapter-3",
    title: "Chapter Three: Why The Business Still Feels Empty Even When You're Successful",
    content: `From the outside, your business looks like everything you hoped it would be. The calendar is full. The client retention is strong. You are known in your area as someone who delivers results. You have built credibility, consistency, and a reputation that took years to establish. On paper, you are succeeding.

But the business still feels empty.

Not because the work doesn't matter. Not because the clients don't appreciate you. The business feels empty because no matter how hard you work, no matter how much you grow, you are still the only one holding it up. And somewhere in the back of your mind, you already know that this version of success is not sustainable.

This chapter is about the structural problem that your work ethic cannot solve. The gap between being fully booked and being financially free. The difference between building a business and building a business that can eventually support your life without requiring your constant presence to maintain it.`
  },
  {
    id: "chapter-4",
    title: "Chapter Four: What Happens If Nothing Changes",
    content: `Let's be honest about what the next two years look like if nothing changes.

You keep booking clients. You keep showing up. You keep answering messages late at night because silence makes you nervous. You keep working weekends because the money is too good to turn down. You keep sacrificing rest because rest feels like falling behind.

And slowly, quietly, the exhaustion starts to feel normal. The back pain becomes something you manage instead of something you address. The guilt around taking time off becomes the default. The idea of a vacation without your phone feels impossible.

This is not a scare tactic. This is pattern recognition. This chapter walks through what the future looks like if the business model stays the same. Not because you are failing. Because the structure itself was never designed to support long-term sustainability.`
  },
  {
    id: "chapter-5",
    title: "Chapter Five: The Fear Of Becoming Replaceable",
    content: `There is a fear underneath all of this that most beauty professionals do not talk about out loud.

The fear that if you step away, even for a moment, your clients will find someone else. The fear that your value is directly tied to your availability. The fear that the moment you are not the one performing the service, the business falls apart.

This fear is what keeps you overworking. This fear is what makes delegation feel impossible. This fear is what makes rest feel dangerous.

But here is what that fear is actually protecting: a business model that depends entirely on you being irreplaceable. And as long as that model stays in place, you will never be able to step back without the business suffering.

This chapter unpacks the psychology behind that fear and what it actually takes to build a business where your value is not dependent on your constant availability.`
  },
  {
    id: "chapter-6",
    title: "Chapter Six: Who You Become If Nothing Changes And Who You Become If It Does",
    content: `You are standing at a decision point.

On one side is the version of you who keeps going exactly as you are. Fully booked. Financially stressed. Exhausted but unable to stop. Five years from now, this version of you is still working the same hours, still answering messages on Sundays, still wondering when it will finally feel easier.

On the other side is the version of you who decides that the current structure is not sustainable and begins building differently. This version of you learns how to create income that does not depend entirely on appointments. This version of you builds systems that allow the business to function without your constant presence. This version of you understands that rest is not a luxury, it is a business strategy.

Two futures. One choice.

This chapter outlines what both paths actually look like and what it takes to move from one to the other.`
  },
  {
    id: "chapter-7",
    title: "Chapter Seven: Building Beyond The Chair",
    content: `This is where the shift happens.

Building beyond the chair does not mean abandoning your clients. It does not mean you stop performing services. It means you begin creating income streams, systems, and structures that allow your business to grow without being entirely dependent on your physical labor.

For some beauty professionals, this means building digital products. For others, it means creating group programs or workshops. For others, it means training other providers and building a team. The method is less important than the principle: your business should eventually be able to generate revenue even when you are not the one performing every single service.

This chapter breaks down what that actually looks like in practice. Not theory. Not vague motivational advice. Actual structure. Actual strategy. Actual next steps.`
  },
  {
    id: "chapter-8",
    title: "Chapter Eight: The Businesses Clients Trust Most",
    content: `Clients do not just buy services. They buy confidence. They buy certainty. They buy the feeling that they are making the right decision by choosing you.

And the businesses that command premium pricing, that build long-term client loyalty, that do not have to compete on price are the businesses that have mastered the psychology of trust.

This chapter walks through how perception shapes pricing. How authority influences client behavior. How positioning determines whether your clients negotiate with you or simply book.

The beauty professionals who build the most sustainable businesses are not necessarily the most talented. They are the ones who understand that the way their business is perceived is just as important as the quality of the work they deliver.

This chapter teaches you how to build that perception intentionally.`
  },
  {
    id: "chapter-9",
    title: "Chapter Nine: Building The Business That Finally Sets You Free",
    content: `This is the operational blueprint.

Season by season. Step by step. What it actually takes to move from a business that depends entirely on your labor to a business that can grow, scale, and support your life without requiring your constant sacrifice.

This chapter is not motivational. It is methodical. It walks through the exact phases of restructuring a beauty business so that you can begin building income that does not disappear the moment you step away.

You will learn how to identify what to build first. How to price for sustainability instead of volume. How to create systems that reduce decision fatigue. How to build authority that attracts clients instead of constantly chasing them.

This is the chapter you return to when you are ready to stop surviving your business and start building one that actually works for you.`
  },
  {
    id: "conclusion",
    title: "Conclusion: The Beauty Industry Needs A New Definition Of Success",
    content: `For too long, success in the beauty industry has been defined by how busy you are. How booked your schedule is. How many clients you can fit into a week. How much you can endure before you finally break.

That definition of success is broken.

Real success is not measured by how full your calendar is. It is measured by how much freedom your business creates. How much rest you can take without financial stress. How much your income has diversified beyond appointments. How sustainable your business model actually is.

The beauty industry needs providers who are willing to build differently. Who are willing to challenge the idea that nonstop labor is the only path to financial stability. Who are willing to create businesses that support their lives instead of consuming them.

You already proved you can work hard. You already proved you are talented. You already proved you can build something real.

Now it is time to build something that lasts.

This book was written for you. Not the version of you who is still trying to prove yourself. The version of you who is ready to build beyond the chair and create a business that finally sets you free.`
  }
];

export function EbookReaderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [readingProgress, setReadingProgress] = useState(0);

  // ACCESS CONTROL: Only Gold Standard members or users who purchased ebook can access
  useEffect(() => {
    if (!user) {
      navigate("/members/login");
      return;
    }

    // Check if user has access
    const hasEbookPurchase = localStorage.getItem(`ebook_purchased_${user.id}`) === "true";
    const hasGoldStandardAccess = user.membershipTier === "gold-standard";

    if (!hasEbookPurchase && !hasGoldStandardAccess) {
      // User doesn't have access - redirect to membership upgrade page
      navigate("/membership-options");
    }
  }, [user, navigate]);

  if (!user) return null;

  const currentChapter = EBOOK_CHAPTERS[currentChapterIndex];
  const totalChapters = EBOOK_CHAPTERS.length;

  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem('ebook-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentChapterIndex(data.chapterIndex || 0);
        setBookmarks(new Set(data.bookmarks || []));
        setFontSize(data.fontSize || 18);
        setIsDarkMode(data.darkMode || false);
      } catch (e) {
        console.error('Failed to load reading progress', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save progress
    const data = {
      chapterIndex: currentChapterIndex,
      bookmarks: Array.from(bookmarks),
      fontSize,
      darkMode: isDarkMode,
      lastRead: new Date().toISOString()
    };
    localStorage.setItem('ebook-progress', JSON.stringify(data));

    // Calculate reading progress
    const progress = ((currentChapterIndex + 1) / totalChapters) * 100;
    setReadingProgress(Math.round(progress));
  }, [currentChapterIndex, bookmarks, fontSize, isDarkMode, totalChapters]);

  const goToNextChapter = () => {
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleBookmark = () => {
    const newBookmarks = new Set(bookmarks);
    if (bookmarks.has(currentChapter.id)) {
      newBookmarks.delete(currentChapter.id);
    } else {
      newBookmarks.add(currentChapter.id);
    }
    setBookmarks(newBookmarks);
  };

  const goToChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setShowChapters(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) return null;

  const bgColor = isDarkMode ? "bg-[#1a0d11]" : "bg-[#fdf5f7]";
  const textColor = isDarkMode ? "text-[#fdf5f7]" : "text-[#251218]";
  const mutedColor = isDarkMode ? "text-[#fdf5f7]/60" : "text-[#251218]/60";

  return (
    <MemberLayout>
      <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
        {/* Top Bar */}
        <div className={`sticky top-0 z-50 ${bgColor} border-b border-[#251218]/5 backdrop-blur-sm`}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setShowChapters(!showChapters)}
              className={`flex items-center gap-2 ${mutedColor} hover:text-[#c9969e] transition-colors`}
            >
              <Menu className="w-5 h-5" />
              <span style={{ fontFamily: "Lora, serif", fontWeight: 300 }}>Chapters</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleBookmark}
                className={`${bookmarks.has(currentChapter.id) ? "text-[#c9969e]" : mutedColor} hover:text-[#c9969e] transition-colors`}
              >
                <Bookmark className="w-5 h-5" fill={bookmarks.has(currentChapter.id) ? "currentColor" : "none"} />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`${mutedColor} hover:text-[#c9969e] transition-colors`}
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`${mutedColor} hover:text-[#c9969e] transition-colors`}
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-[#251218]/5">
            <div
              className="h-full bg-gradient-to-r from-[#c9969e] to-[#251218] transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>

        {/* Chapter Navigation Sidebar */}
        {showChapters && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowChapters(false)}>
            <div
              className={`absolute left-0 top-0 bottom-0 w-80 ${bgColor} shadow-2xl overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`text-2xl ${textColor}`}
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    Chapters
                  </h2>
                  <button onClick={() => setShowChapters(false)} className={mutedColor}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {EBOOK_CHAPTERS.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => goToChapter(index)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        index === currentChapterIndex
                          ? "bg-[#c9969e]/10 border border-[#c9969e]/20"
                          : "hover:bg-[#251218]/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {bookmarks.has(chapter.id) && (
                          <Bookmark className="w-4 h-4 text-[#c9969e] flex-shrink-0 mt-1" fill="currentColor" />
                        )}
                        <div className="flex-1">
                          <p
                            className={`text-sm ${mutedColor} mb-1`}
                            style={{ fontFamily: "Lora, serif" }}
                          >
                            {index === 0 ? "Dedication" : index === 1 ? "Introduction" : `Chapter ${index - 1}`}
                          </p>
                          <p
                            className={`${textColor} leading-snug`}
                            style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                          >
                            {chapter.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
            <div
              className={`absolute right-0 top-0 bottom-0 w-80 ${bgColor} shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`text-2xl ${textColor}`}
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    Settings
                  </h2>
                  <button onClick={() => setShowSettings(false)} className={mutedColor}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <label className={`block text-sm ${mutedColor} mb-3`} style={{ fontFamily: "Lora, serif" }}>
                      Font Size
                    </label>
                    <div className="flex items-center gap-4">
                      <Type className="w-4 h-4" />
                      <input
                        type="range"
                        min="14"
                        max="24"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="flex-1"
                      />
                      <Type className="w-6 h-6" />
                    </div>
                    <p className={`text-xs ${mutedColor} mt-2 text-center`}>{fontSize}px</p>
                  </div>

                  {/* Dark Mode */}
                  <div>
                    <label className={`block text-sm ${mutedColor} mb-3`} style={{ fontFamily: "Lora, serif" }}>
                      Reading Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsDarkMode(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                          !isDarkMode
                            ? "bg-[#c9969e]/20 text-[#c9969e] border border-[#c9969e]/30"
                            : "bg-[#251218]/5 text-[#251218]/50 hover:bg-[#251218]/10"
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span style={{ fontFamily: "Lora, serif" }}>Light</span>
                      </button>
                      <button
                        onClick={() => setIsDarkMode(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                          isDarkMode
                            ? "bg-[#c9969e]/20 text-[#c9969e] border border-[#c9969e]/30"
                            : "bg-[#251218]/5 text-[#251218]/50 hover:bg-[#251218]/10"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span style={{ fontFamily: "Lora, serif" }}>Dark</span>
                      </button>
                    </div>
                  </div>

                  {/* Reading Progress */}
                  <div>
                    <label className={`block text-sm ${mutedColor} mb-3`} style={{ fontFamily: "Lora, serif" }}>
                      Reading Progress
                    </label>
                    <div className="bg-[#251218]/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#c9969e] to-[#251218]"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                    <p className={`text-sm ${mutedColor} mt-2 text-center`}>
                      {readingProgress}% Complete · Chapter {currentChapterIndex + 1} of {totalChapters}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Reading Area */}
        <div className={`max-w-3xl mx-auto px-6 py-12 ${isFullscreen ? "min-h-screen" : ""}`}>
          <article>
            {/* Chapter Title */}
            <h1
              className={`text-4xl md:text-5xl ${textColor} mb-8 leading-tight`}
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              {currentChapter.title}
            </h1>

            {/* Chapter Content */}
            <div
              className={`prose prose-lg max-w-none ${textColor}`}
              style={{
                fontFamily: "Lora, serif",
                fontSize: `${fontSize}px`,
                lineHeight: 1.8,
                fontWeight: 300
              }}
            >
              {currentChapter.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-[#251218]/10">
            <button
              onClick={goToPrevChapter}
              disabled={currentChapterIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                currentChapterIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#251218]/5"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span style={{ fontFamily: "Lora, serif" }}>Previous</span>
            </button>

            <span className={`text-sm ${mutedColor}`} style={{ fontFamily: "Lora, serif" }}>
              {currentChapterIndex + 1} / {totalChapters}
            </span>

            <button
              onClick={goToNextChapter}
              disabled={currentChapterIndex === totalChapters - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                currentChapterIndex === totalChapters - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#251218]/5"
              }`}
            >
              <span style={{ fontFamily: "Lora, serif" }}>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
