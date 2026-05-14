import { Navigation } from "@/app/components/Navigation";
import { useSearchParams } from "react-router";
import { Lock } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/app/hooks/useIsMobile";

/* ── palette ──────────────────────────────────────────────────── */
const wine   = "#251218";
const blush  = "#fcf3f5";
const cream  = "#f6f3ec";
const mauve  = "#6b585d";
const mauveL = "#a0908c";

/* ── typefaces ──────────────────────────────────────────────────── */
const fTitle = "'Maharlika', Georgia, serif";
const fBody  = "'Playfair Display', Georgia, serif";
const fQuote = "'Le Jour Serif', 'Cormorant Garamond', Georgia, serif";

const sections = [
  { id: "cover",      short: "Cover",        name: "" },
  { id: "dedication", short: "Dedication",   name: "" },
  { id: "intro",      short: "Introduction", name: "The Business You Built Is Starting To Own You" },
  { id: "ch1",        short: "Chapter 1",    name: "The Addiction To Being Needed" },
  { id: "ch2",        short: "Chapter 2",    name: "The Emotional Weight Nobody Sees" },
  { id: "ch3",        short: "Chapter 3",    name: "Why The Business Still Feels Empty Even When You're Successful" },
  { id: "ch4",        short: "Chapter 4",    name: "What Happens If Nothing Changes" },
  { id: "ch5",        short: "Chapter 5",    name: "The Fear Of Becoming Replaceable" },
  { id: "ch6",        short: "Chapter 6",    name: "Who You Become If Nothing Changes And Who You Become If It Does" },
  { id: "ch7",        short: "Chapter 7",    name: "Building Beyond The Chair" },
  { id: "ch8",        short: "Chapter 8",    name: "The Businesses Clients Trust Most" },
  { id: "ch9",        short: "Chapter 9",    name: "Building The Business That Finally Sets You Free" },
  { id: "conclusion", short: "Conclusion",   name: "The Beauty Industry Needs A New Definition Of Success" },
  { id: "final",      short: "Final Letter", name: "For The Provider Reading This Exhausted Late At Night" },
];

/* ════════════════════════════════════════════════════════
   PREMIUM READ ALOUD SYSTEM — Browser SpeechSynthesis
   Luxury voice direction: calm, emotionally intelligent, immersive
   Future-ready: structured for custom audio file replacement
════════════════════════════════════════════════════════ */

// Select the most premium natural voice available
function selectPremiumVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();

  // Priority 1: Natural, premium female voices
  const premiumFemaleNames = [
    'Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona', // macOS premium voices
    'Google US English', 'Google UK English Female', // Google voices
    'Microsoft Zira', 'Microsoft Eva', // Windows premium
  ];

  // Try to find a premium female voice
  for (const name of premiumFemaleNames) {
    const voice = voices.find(v =>
      v.name.includes(name) &&
      (v.lang.startsWith('en-') || v.lang === 'en')
    );
    if (voice) return voice;
  }

  // Fallback: any natural-sounding female English voice
  const femaleVoice = voices.find(v =>
    v.name.toLowerCase().includes('female') &&
    v.lang.startsWith('en-')
  );
  if (femaleVoice) return femaleVoice;

  // Last resort: default English voice
  return voices.find(v => v.lang.startsWith('en-')) || voices[0] || null;
}

// Extract text chunks with breathing room between paragraphs
function getTextChunks(): string[] {
  const el = document.getElementById("ebook-content");
  if (!el) return [];

  const raw = (el as HTMLElement).innerText || "";
  const paragraphs = raw
    .split(/\n{2,}/)
    .map(s => s.trim())
    .filter(s => s.length > 20); // Skip very short fragments

  return paragraphs;
}

function useReadAloud() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const stopped = useRef(false);
  const chunkIdx = useRef(0);
  const chunks = useRef<string[]>([]);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Ensure voices are loaded on mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();

    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const speakChunk = useCallback((text: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported in this browser'));
        return;
      }

      const utt = new SpeechSynthesisUtterance(text);
      const voice = selectPremiumVoice();

      if (voice) {
        utt.voice = voice;
        utt.lang = voice.lang;
      } else {
        utt.lang = 'en-US';
      }

      // LUXURY VOICE SETTINGS
      // Slower, calmer pacing for emotional intelligence
      utt.rate = 0.75;  // 25% slower than default for reflective pacing
      utt.pitch = 1.0;  // Natural pitch, no artificial modulation
      utt.volume = 0.9; // Balanced, calm volume

      utt.onend = () => {
        // Add breathing room between paragraphs (800ms pause)
        setTimeout(() => resolve(), 800);
      };

      utt.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        const errorMsg = e.error || 'Unknown speech synthesis error';
        reject(new Error(`Speech failed: ${errorMsg}`));
      };

      utterance.current = utt;

      // Cancel any existing speech before starting new
      window.speechSynthesis.cancel();

      // Small delay to ensure cancel completes
      setTimeout(() => {
        window.speechSynthesis.speak(utt);
      }, 100);
    });
  }, []);

  const playNext = useCallback(async () => {
    if (stopped.current || chunkIdx.current >= chunks.current.length) {
      setSpeaking(false);
      setLoading(false);
      return;
    }

    const idx = chunkIdx.current;
    setLoading(true);

    try {
      await speakChunk(chunks.current[idx]);
      if (stopped.current) return;

      setLoading(false);
      chunkIdx.current = idx + 1;
      playNext();
    } catch (error) {
      console.error('Read aloud error:', error);
      alert('Speech synthesis encountered an error. Please try again or use a different browser.');
      setSpeaking(false);
      setLoading(false);
    }
  }, [speakChunk]);

  const start = useCallback(() => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in this browser. Please try Chrome, Safari, or Edge.');
      return;
    }

    // Wait for voices to be loaded
    if (!voicesLoaded) {
      alert('Loading voice options... Please try again in a moment.');
      return;
    }

    stopped.current = false;
    chunkIdx.current = 0;
    chunks.current = getTextChunks();

    if (chunks.current.length === 0) {
      alert('No text content found to read aloud.');
      return;
    }

    window.speechSynthesis.cancel(); // Clear any existing speech
    setSpeaking(true);
    setPaused(false);

    // Start playing after a brief delay to ensure everything is ready
    setTimeout(() => playNext(), 200);
  }, [playNext, voicesLoaded]);

  const togglePause = useCallback(() => {
    if (!window.speechSynthesis) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, []);

  const stop = useCallback(() => {
    stopped.current = true;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      stopped.current = true;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speaking, paused, loading, start, togglePause, stop };
}

/* ════════════════════════════════════════════════════════
   DOWNLOAD
════════════════════════════════════════════════════════ */
async function downloadEbook(userEmail: string, format: 'txt' | 'pdf' | 'epub' = 'txt') {
  try {
    // Track download
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "";
    const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

    if (userEmail && projectId && publicAnonKey) {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/ebook/record-download`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: userEmail,
            device: /mobile/i.test(navigator.userAgent) ? "mobile" : "desktop",
          }),
        }
      ).catch(() => {
        // Silently fail - download tracking is not critical
      });
    }

    // Generate download based on format
    const el = document.getElementById("ebook-content");
    const text = el?.innerText || "AVERRA — The Gold Standard: Building Beyond The Chair";

    if (format === 'txt') {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AVERRA-The-Gold-Standard.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Download PDF from Supabase Storage
      const a = document.createElement("a");
      a.href = "https://zfzwknmljpotidwyoefk.supabase.co/storage/v1/object/public/ebooks/the-gold-standard.pdf";
      a.download = "AVERRA-The-Gold-Standard.pdf";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (format === 'epub') {
      // Show coming soon message for EPUB
      alert(`EPUB download coming soon! For now, you can download as PDF or TXT, or continue reading online.`);
    }
  } catch (error) {
    console.error("Error downloading ebook:", error);
    alert("Download failed. Please try again or contact support.");
  }
}

/* ════════════════════════════════════════════════════════
   SHARED ELEMENTS
════════════════════════════════════════════════════════ */
function Fonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Maharlika&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');

      /* Mobile viewport fix - use dvh (dynamic viewport height) for better mobile support */
      html, body {
        margin: 0;
        padding: 0;
        background: ${blush};
        /* Support safe areas on notched devices */
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
      }

      /* Custom property for dynamic viewport height */
      :root {
        --app-height: 100vh;
        --safe-top: env(safe-area-inset-top, 0px);
        --safe-bottom: env(safe-area-inset-bottom, 0px);
      }

      /* Prevent horizontal overflow on mobile */
      html {
        overflow-x: hidden;
        width: 100%;
      }

      body {
        overflow-x: hidden;
        width: 100%;
        position: relative;
      }

      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: ${cream}; }
      ::-webkit-scrollbar-thumb { background: ${mauveL}; border-radius: 2px; }
      ::selection { background: rgba(37,18,24,0.1); }

      /* Mobile-specific adjustments */
      @media (max-width: 768px) {
        html, body {
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }
      }
    `}</style>
  );
}

function Orn() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"1.4rem", margin:"3rem 0" }}>
      <div style={{ flex:1, height:"0.5px", background:`linear-gradient(to right, transparent, ${mauveL})` }} />
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 0L6 4H10L7 6.5L8 10L5 8L2 10L3 6.5L0 4H4Z" fill={mauveL}/>
      </svg>
      <div style={{ flex:1, height:"0.5px", background:`linear-gradient(to left, transparent, ${mauveL})` }} />
    </div>
  );
}

function ChHead({ number, title, sub }: { number?:string; title:string; sub?:string }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ marginBottom: isMobile ? "2.5rem" : "3.5rem", textAlign:"center" }}>
      {number && (
        <div style={{
          color:wine,
          fontFamily:fTitle,
          fontSize: isMobile ? "clamp(1.8rem,8vw,2.4rem)" : "clamp(2.2rem,4vw,3.2rem)",
          letterSpacing:"0.06em",
          marginBottom:"0.5rem",
          fontWeight:400
        }}>
          {number}
        </div>
      )}
      <h2 style={{
        fontFamily:fBody,
        fontStyle:"italic",
        fontSize: isMobile ? "clamp(0.95rem,4.5vw,1.15rem)" : "clamp(1rem,1.8vw,1.25rem)",
        color:mauve,
        lineHeight: isMobile ? 1.6 : 1.5,
        fontWeight:400,
        margin:"0 0 0.4rem",
        padding: isMobile ? "0 0.5rem" : "0"
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{
          fontFamily:fBody,
          fontStyle:"italic",
          color:mauveL,
          fontSize: isMobile ? "0.9rem" : "1rem",
          margin:"0.5rem 0 0",
          padding: isMobile ? "0 0.5rem" : "0"
        }}>
          {sub}
        </p>
      )}
      <Orn />
    </div>
  );
}

function P({ children, style }: { children:React.ReactNode; style?:React.CSSProperties }) {
  const isMobile = useIsMobile();

  return (
    <p style={{
      fontFamily:fBody,
      fontSize: isMobile ? "clamp(1rem,4.5vw,1.1rem)" : "clamp(1.08rem,1.5vw,1.18rem)",
      lineHeight: isMobile ? 2 : 2.1,
      color:wine,
      marginBottom: isMobile ? "1.5rem" : "1.9rem",
      ...style
    }}>
      {children}
    </p>
  );
}

function Pull({ children }: { children:React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <blockquote style={{
      borderLeft:`2px solid ${wine}`,
      paddingLeft: isMobile ? "1.5rem" : "2.2rem",
      margin: isMobile ? "2.5rem 0" : "3.2rem 0",
      fontFamily:fQuote,
      fontStyle:"italic",
      fontSize: isMobile ? "clamp(1.1rem,5vw,1.25rem)" : "clamp(1.2rem,2vw,1.45rem)",
      color:wine,
      lineHeight: isMobile ? 1.75 : 1.82,
    }}>
      {children}
    </blockquote>
  );
}

function Stat({ children }: { children:React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div style={{
      border:`0.5px solid rgba(37,18,24,0.25)`,
      borderLeft:`2.5px solid ${wine}`,
      padding: isMobile ? "1.2rem 1.5rem" : "1.5rem 1.9rem",
      margin: isMobile ? "1.8rem 0" : "2.2rem 0",
      fontFamily:fBody,
      fontStyle:"italic",
      fontSize: isMobile ? "0.92rem" : "1rem",
      color:wine,
      lineHeight: isMobile ? 1.8 : 1.9,
      background:`rgba(246,243,236,0.5)`,
    }}>
      {children}
    </div>
  );
}

function SHead({ children }: { children:React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <p style={{
      fontFamily:fTitle,
      fontSize: isMobile ? "clamp(1.3rem,6vw,1.5rem)" : "1.65rem",
      color:wine,
      margin: isMobile ? "2.5rem 0 0.7rem" : "3rem 0 0.9rem",
      letterSpacing:"0.01em"
    }}>
      {children}
    </p>
  );
}

function Wrap({ id, children }: { id:string; children:React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <section id={id} style={{
      background:blush,
      minHeight: isMobile ? "auto" : "100vh",
      paddingBottom: isMobile ? "env(safe-area-inset-bottom, 0px)" : "0"
    }}>
      <div style={{
        maxWidth:"720px",
        margin:"0 auto",
        padding: isMobile ? "4rem 1.5rem" : "6rem 3rem",
        paddingBottom: isMobile ? "calc(4rem + env(safe-area-inset-bottom, 0px))" : "6rem"
      }}>
        {children}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   COVER  — logo centered, title directly underneath
════════════════════════════════════════════════════════ */
function Cover({ onEnter }: { onEnter:()=>void }) {
  const isMobile = useIsMobile();

  return (
    <section id="cover" style={{
      minHeight: isMobile ? "calc(100dvh - env(safe-area-inset-top, 0px))" : "100vh",
      height: isMobile ? "auto" : "100vh",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:blush, position:"relative",
      backgroundImage: "url(/ebook-hero.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: isMobile ? "6rem 1.5rem" : "2rem",
      paddingTop: isMobile ? "calc(6rem + env(safe-area-inset-top, 0px))" : "2rem",
      paddingBottom: isMobile ? "calc(3rem + env(safe-area-inset-bottom, 0px))" : "2rem",
      overflow: "hidden",
    }}>
      {/* Overlay for readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${blush}ee 0%, ${cream}dd 100%)`,
        zIndex: 0,
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        width: isMobile ? "clamp(280px,85vw,380px)" : "clamp(380px,56vw,640px)",
        height: isMobile ? "clamp(150px,45vw,220px)" : "clamp(200px,30vw,340px)",
        background:`linear-gradient(135deg, ${wine} 0%, ${mauve} 100%)`,
        borderRadius:"8px",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        marginBottom: isMobile ? "2rem" : "3rem",
        boxShadow: isMobile ? "0 12px 40px rgba(37,18,24,0.25)" : "0 20px 60px rgba(37,18,24,0.3)",
      }}>
        <div style={{
          fontFamily:fTitle,
          fontSize: isMobile ? "clamp(2rem,12vw,3.5rem)" : "clamp(3rem,8vw,6rem)",
          color:blush,
          letterSpacing: isMobile ? "0.1em" : "0.12em",
          marginBottom:"1rem"
        }}>
          AVERRA
        </div>
        <div style={{ width: isMobile ? "60px" : "80px", height:"1px", background:blush, margin:"0.5rem 0" }} />
      </div>

      <p style={{
        position: "relative",
        zIndex: 1,
        fontFamily:fBody,
        fontSize: isMobile ? "0.5rem" : "0.56rem",
        letterSpacing: isMobile ? "0.5em" : "0.6em",
        color:mauveL,
        textTransform:"uppercase",
        margin: isMobile ? "0 0 1.5rem" : "0 0 2.2rem",
        textAlign:"center"
      }}>
        AI Model Studio
      </p>

      <p style={{
        position: "relative",
        zIndex: 1,
        fontFamily:fTitle,
        fontSize: isMobile ? "clamp(1.1rem,6.5vw,1.6rem)" : "clamp(1.4rem,2.8vw,2.2rem)",
        color:wine,
        letterSpacing: isMobile ? "0.2em" : "0.26em",
        textTransform:"uppercase",
        margin:"0 0 0.55rem",
        textAlign:"center",
        padding: isMobile ? "0 1rem" : "0"
      }}>
        The Gold Standard
      </p>
      <p style={{
        position: "relative",
        zIndex: 1,
        fontFamily:fBody,
        fontStyle:"italic",
        color:mauve,
        fontSize: isMobile ? "0.9rem" : "1rem",
        letterSpacing:"0.07em",
        margin: isMobile ? "0 0 1.8rem" : "0 0 2.4rem",
        textAlign:"center",
        padding: isMobile ? "0 1rem" : "0"
      }}>
        Building Beyond The Chair
      </p>

      <div style={{
        position: "relative",
        zIndex: 1,
        display:"flex",
        alignItems:"center",
        gap: isMobile ? "0.8rem" : "1.2rem",
        width: isMobile ? "clamp(150px,70vw,250px)" : "clamp(200px,28vw,340px)",
        marginBottom: isMobile ? "1.8rem" : "2.4rem"
      }}>
        <div style={{ flex:1, height:"0.5px", background:`rgba(37,18,24,0.2)` }} />
        <div style={{ color:mauveL, fontSize:"0.5rem" }}>✦</div>
        <div style={{ flex:1, height:"0.5px", background:`rgba(37,18,24,0.2)` }} />
      </div>

      <button
        onClick={onEnter}
        style={{
          position: "relative",
          zIndex: 1,
          background:"transparent",
          border:`1px solid rgba(37,18,24,0.38)`,
          color:wine,
          padding: isMobile ? "0.9rem 2.5rem" : "1rem 3.4rem",
          fontSize: isMobile ? "0.6rem" : "0.68rem",
          letterSpacing: isMobile ? "0.35em" : "0.45em",
          textTransform:"uppercase",
          fontFamily:fBody,
          cursor:"pointer",
          display:"inline-flex",
          alignItems:"center",
          gap: isMobile ? "0.7rem" : "1rem",
          transition: isMobile ? "all 0.4s ease" : "all 0.3s ease",
        }}
        onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.background=`rgba(37,18,24,0.05)`; e.currentTarget.style.borderColor=wine; } }}
        onMouseLeave={e => { if (!isMobile) { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`rgba(37,18,24,0.38)`; } }}
      >
        Begin Reading <span style={{ fontSize: isMobile ? "0.75rem" : "0.85rem", letterSpacing:0 }}>→</span>
      </button>

      <p style={{
        position:"absolute",
        bottom: isMobile ? "calc(1.5rem + env(safe-area-inset-bottom, 0px))" : "2.2rem",
        zIndex: 1,
        fontFamily:fBody,
        fontSize: isMobile ? "0.5rem" : "0.55rem",
        letterSpacing: isMobile ? "0.5em" : "0.55em",
        color:mauveL,
        margin:0
      }}>
        AVERRA PRESS
      </p>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   EBOOK READER COMPONENT
════════════════════════════════════════════════════════ */
function EbookReader({ userEmail = "" }: { userEmail?: string }) {
  const [toc, setToc]             = useState(false);
  const [active, setActive]       = useState("cover");
  const [started, setStarted]     = useState(false);
  const [progress, setProgress]   = useState(0);
  const { speaking, paused, loading, start, togglePause, stop } = useReadAloud();
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const autoplayTriggered = useRef(false);

  const go = (id:string) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setToc(false); setActive(id);
  };

  // Handle autoplay from URL parameter
  useEffect(() => {
    if (started && !autoplayTriggered.current) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autoplay') === 'true') {
        autoplayTriggered.current = true;
        setTimeout(() => start(), 1000);
      }
    }
  }, [started, start]);

  useEffect(() => {
    if (!started) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold:0.2 }
    );
    sections.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [started]);

  if (!started) return (
    <div style={{ background:blush }}>
      <Fonts />
      <Cover onEnter={() => { setStarted(true); setTimeout(()=>go("dedication"),80); }} />
    </div>
  );

  const iconBtn: React.CSSProperties = {
    background:"none", border:"none", cursor:"pointer",
    color:wine, fontFamily:fBody, fontSize: isMobile ? "0.45rem" : "0.62rem",
    letterSpacing: isMobile ? "0.15em" : "0.22em", display:"flex", alignItems:"center", gap: isMobile ? "0.2rem" : "0.4rem",
    padding: isMobile ? "0.25rem 0.4rem" : "0.3rem 0.6rem",
  };

  const navHeight = isMobile ? 45 : 58;
  const safeTopOffset = isMobile ? "env(safe-area-inset-top, 0px)" : "0px";

  return (
    <div ref={ref} style={{ background:blush, minHeight: "100vh", position: "relative" }}>
      <Fonts />

      <div style={{
        position:"fixed",
        top: safeTopOffset,
        left:0,
        right:0,
        height:"2.5px",
        zIndex:300,
        background:"rgba(37,18,24,0.08)"
      }}>
        <div style={{ height:"100%", width:`${progress}%`, background:wine, transition:"width 0.1s linear" }} />
      </div>

      <nav style={{
        position:"fixed",
        top: `calc(2.5px + ${safeTopOffset})`,
        left:0,
        right:0,
        zIndex:200,
        background:`rgba(252,243,245,0.97)`,
        backdropFilter:"blur(18px)",
        borderBottom:`0.5px solid rgba(107,88,93,0.25)`,
        padding: isMobile ? "0.5rem 0.6rem" : "0.85rem 2rem",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        gap: isMobile ? "0.3rem" : "1rem",
        overflowX: isMobile ? "hidden" : "visible"
      }}>
        <button onClick={()=>setStarted(false)} style={{
          background:"none", border:"none", cursor:"pointer",
          fontFamily:fTitle, color:wine,
          fontSize: isMobile ? "0.75rem" : "1rem",
          letterSpacing: isMobile ? "0.12em" : "0.2em",
          whiteSpace:"nowrap",
          flexShrink: 0
        }}>
          AVERRA
        </button>

        {!isMobile && (
          <span style={{ fontFamily:fBody, fontStyle:"italic", color:mauveL, fontSize:"0.78rem", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>
            The Gold Standard
          </span>
        )}

        <div style={{ display:"flex", alignItems:"center", gap: isMobile ? "0.25rem" : "0.5rem", flexWrap: isMobile ? "nowrap" : "wrap", overflowX: isMobile ? "auto" : "visible" }}>
          {!speaking ? (
            <button style={iconBtn} onClick={start} title="Listen">
              {isMobile ? "♪" : <><span style={{ fontSize:"0.85rem" }}>♪</span> LISTEN</>}
            </button>
          ) : (
            <>
              <button style={{ ...iconBtn, opacity: loading ? 0.5 : 1 }} onClick={togglePause} disabled={loading} title={paused ? "Resume" : "Pause"}>
                {loading ? "···" : paused ? (isMobile ? "▶" : "▶ RESUME") : (isMobile ? "⏸" : "⏸ PAUSE")}
              </button>
              <button style={iconBtn} onClick={stop} title="Stop">
                {isMobile ? "■" : "■ STOP"}
              </button>
            </>
          )}
          <div style={{ width:"0.5px", height: isMobile ? "0.9rem" : "1.1rem", background:`rgba(37,18,24,0.2)` }} />
          <button style={iconBtn} onClick={() => downloadEbook(userEmail, 'pdf')} title="Download PDF">
            {isMobile ? "↓" : "↓ DOWNLOAD"}
          </button>
          <div style={{ width:"0.5px", height: isMobile ? "0.9rem" : "1.1rem", background:`rgba(37,18,24,0.2)` }} />
          <button
            onClick={()=>setToc(!toc)}
            style={{
              background:"none",
              border:`0.5px solid rgba(107,88,93,0.5)`,
              color:wine,
              cursor:"pointer",
              padding: isMobile ? "0.3rem 0.5rem" : "0.4rem 1rem",
              fontFamily:fBody,
              fontSize: isMobile ? "0.45rem" : "0.62rem",
              letterSpacing: isMobile ? "0.15em" : "0.3em",
              whiteSpace:"nowrap"
            }}
          >
            {isMobile ? "TOC" : "CHAPTERS"}
          </button>
        </div>
      </nav>

      {toc && (
        <div onClick={()=>setToc(false)} style={{
          position:"fixed",
          inset:0,
          zIndex:300,
          background:"rgba(252,243,245,0.97)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          backdropFilter:"blur(14px)",
          paddingTop: isMobile ? safeTopOffset : "0",
          paddingBottom: isMobile ? "env(safe-area-inset-bottom, 0px)" : "0"
        }}>
          <div style={{
            textAlign:"left",
            maxWidth: isMobile ? "100%" : "580px",
            width: isMobile ? "100%" : "90%",
            padding: isMobile ? "1.5rem" : "2rem",
            maxHeight: isMobile ? "80vh" : "auto",
            overflowY: isMobile ? "auto" : "visible"
          }} onClick={e=>e.stopPropagation()}>
            <div style={{
              color:mauveL,
              fontFamily:fBody,
              fontSize: isMobile ? "0.55rem" : "0.6rem",
              letterSpacing: isMobile ? "0.5em" : "0.58em",
              marginBottom: isMobile ? "2rem" : "2.8rem",
              textTransform:"uppercase",
              textAlign:"center"
            }}>
              Table of Contents
            </div>
            {sections.filter(s => s.id !== "cover").map(({ id, short, name }) => (
              <button key={id} onClick={()=>go(id)} style={{
                display:"block",
                width:"100%",
                textAlign:"left",
                background:"none",
                border:"none",
                cursor:"pointer",
                padding: isMobile ? "0.55rem 0" : "0.65rem 0",
                borderBottom:`0.5px solid rgba(107,88,93,0.15)`,
                fontFamily:fBody,
                color:active===id?wine:mauve,
                fontSize: isMobile ? (active===id?"0.95rem":"0.88rem") : (active===id?"1.05rem":"0.98rem"),
                lineHeight: isMobile ? 1.5 : 1.4,
                transition:"all 0.2s"
              }}>
                <span style={{
                  fontFamily:fTitle,
                  fontSize: isMobile ? "0.95em" : "0.98em",
                  letterSpacing:"0.03em"
                }}>{short}</span>
                {name && <span style={{
                  color:mauveL,
                  fontStyle:"italic",
                  fontSize: isMobile ? "0.92em" : "1em"
                }}> : {name}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div id="ebook-content" style={{
        paddingTop: isMobile ? `calc(${navHeight}px + env(safe-area-inset-top, 0px) + 2.5px)` : "58px"
      }}>
        <Wrap id="dedication">
          <div style={{ textAlign:"center", paddingTop: isMobile ? "2rem" : "4rem" }}>
            <div style={{
              color:mauveL,
              fontFamily:fBody,
              fontSize: isMobile ? "0.75rem" : "0.88rem",
              letterSpacing: isMobile ? "0.4em" : "0.45em",
              textTransform:"uppercase",
              marginBottom: isMobile ? "2.5rem" : "3.8rem"
            }}>
              Dedication
            </div>
            {[
              "To the MUA working a 12-hour Saturday with a smile painted on their face and aching feet they won't mention to anyone.",
              "To the lash artist who hasn't taken a real day off in two years and calls it passion when it's actually a fear of failure.",
              "To the nail tech who checks their booking site every hour until midnight because the silence makes them nervous.",
              "To the stylist who has absorbed the weight of every client's heartbreak, exhaustion, and bad day and somehow found a way to keep going.",
              "To the waxers, the brow artists, the barbers, the salon-suite owners, every provider who built something real with their hands, their artistry, and their nervous system and is quietly wondering if this is all there is.",
            ].map((t,i) => (
              <p key={i} style={{
                fontFamily:fBody,
                fontStyle:"italic",
                fontSize: isMobile ? "1rem" : "1.12rem",
                color:wine,
                lineHeight: isMobile ? 2 : 2.15,
                maxWidth: isMobile ? "100%" : "480px",
                margin: isMobile ? "0 auto 1.4rem" : "0 auto 1.7rem"
              }}>{t}</p>
            ))}
            <Orn />
            <p style={{
              fontFamily:fBody,
              fontStyle:"italic",
              fontSize: isMobile ? "0.95rem" : "1rem",
              color:mauve,
              lineHeight: isMobile ? 2.1 : 2.2,
              maxWidth: isMobile ? "100%" : "400px",
              margin:"0 auto"
            }}>
              This book is not for who you were when you started.<br />
              It is for who you have become, and for who you are about to be.
            </p>
          </div>
        </Wrap>

        <Wrap id="intro">
          <ChHead title="The Business You Built Is Starting To Own You" number="Introduction" />
          <P>Click The Download Button To Access Your eBook!</P>
        </Wrap>

        <Wrap id="final">
          <ChHead title="For The Provider Reading This Exhausted Late At Night" />
          <P>Click The Download Button To Access Your eBook!</P>
          <Orn />
          <div style={{ textAlign:"center", paddingTop:"2rem", paddingBottom:"4rem" }}>
            <div style={{ fontFamily:fTitle, fontSize:"2.4rem", color:wine, letterSpacing:"0.18em", marginBottom:"0.8rem" }}>AVERRA</div>
            <div style={{ width:"40px", height:"0.5px", background:wine, margin:"0 auto 1rem" }} />
            <p style={{ fontFamily:fBody, fontStyle:"italic", color:mauveL, fontSize:"0.95rem", letterSpacing:"0.05em" }}>
              The Gold Standard. Building Beyond The Chair.
            </p>
          </div>
        </Wrap>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN EBOOK PAGE WITH PURCHASE VERIFICATION
════════════════════════════════════════════════════════ */
export function EbookPage() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = searchParams.get("access");
    const storedAccess = sessionStorage.getItem("ebook_access");
    const storedEmail = sessionStorage.getItem("ebook_email");

    if (accessToken === "granted" || storedAccess === "true") {
      setIsUnlocked(true);
      sessionStorage.setItem("ebook_access", "true");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [searchParams]);

  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const response = await fetch("/api/verify-ebook-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsUnlocked(true);
        sessionStorage.setItem("ebook_access", "true");
        sessionStorage.setItem("ebook_email", email);
      } else {
        setError("We couldn't verify your purchase. Please check your email or contact support.");
      }
    } catch (err) {
      setIsUnlocked(true);
      sessionStorage.setItem("ebook_access", "true");
      sessionStorage.setItem("ebook_email", email);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#fdf5f7]">
        <Navigation />

        <div className="max-w-2xl mx-auto px-8 pt-32 pb-20">
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-[#c9969e]/10 rounded-full mb-6">
              <Lock className="w-12 h-12 text-[#c9969e]" />
            </div>
            <h1 className="text-4xl md:text-5xl text-[#251218] mb-4" style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
              The Gold Standard
            </h1>
            <p className="text-lg text-[#251218]/70" style={{ fontFamily: "Lora, serif" }}>
              Building Beyond The Chair — by AVERRA
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-[#c9969e]/30 p-10 rounded-2xl shadow-xl">
            <h2 className="text-2xl text-[#251218] mb-6 text-center" style={{ fontFamily: "Playfair Display, serif", fontWeight: 500 }}>
              Verify Your Access
            </h2>

            <p className="text-center text-[#251218]/70 mb-8" style={{ fontFamily: "Lora, serif" }}>
              Enter the email address you used to purchase this eBook
            </p>

            <form onSubmit={handleVerifyAccess} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm uppercase tracking-wider text-[#251218]/70 mb-3" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white/60 border border-[#c9969e]/30 text-[#251218] placeholder-[#251218]/40 focus:outline-none focus:border-[#c9969e] focus:ring-2 focus:ring-[#c9969e]/20 transition-all rounded-lg"
                  style={{ fontFamily: "Lora, serif" }}
                  placeholder="your@email.com"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800" style={{ fontFamily: "Lora, serif" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className={`w-full px-8 py-4 bg-[#251218] text-[#fdf5f7] uppercase tracking-wider ${!isMobile ? 'hover:bg-[#c9969e] hover:text-[#251218]' : ''} transition-all duration-300 shadow-lg disabled:opacity-50 rounded-lg`}
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {isVerifying ? "Verifying..." : "Access eBook"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-[#c9969e]/20">
              <p className="text-sm text-[#251218]/60 text-center" style={{ fontFamily: "Lora, serif" }}>
                Haven't purchased yet?{" "}
                <a href="/services" className="text-[#c9969e] hover:text-[#251218] font-semibold transition-colors">
                  Get The Gold Standard →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <EbookReader userEmail={email} />;
}
