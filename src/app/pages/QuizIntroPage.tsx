import { Navigation } from "@/app/components/Navigation";
import { useNavigate } from "react-router";

export function QuizIntroPage() {
  const navigate = useNavigate();


  return (
    <div className="quiz-intro-page">
      <Navigation />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:wght@300;400;500;600&family=Montserrat:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --averra-cream: #fdf5f7;
          --averra-blush: #fcf3f5;
          --averra-dark: #251218;
          --averra-mauve: #c9969e;
          --averra-muted: #6b585d;
          --serif: 'Playfair Display', serif;
          --serif-alt: 'Lora', serif;
          --sans: 'Montserrat', sans-serif;
        }

        html { scroll-behavior: smooth; }

        .quiz-intro-page {
          background: var(--averra-dark);
          color: var(--averra-cream);
          font-family: var(--sans);
          font-weight: 300;
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* ── HERO ── */
        .quiz-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,150,158,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 30% 70%, rgba(201,150,158,0.04) 0%, transparent 50%),
            linear-gradient(160deg, #1a0e12 0%, #251218 50%, #2f1c23 100%);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }

        .hero-ambient-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(201,150,158,0.08) 0%, transparent 70%);
          opacity: 0;
          animation: ambientPulse 50s ease-in-out infinite;
        }

        .hero-content {
          position: relative;
          max-width: 720px;
          text-align: center;
        }

        .hero-label {
          font-size: 0.62rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 3rem;
          opacity: 0;
          animation: fadeUp 2.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }

        .hero-headline {
          font-family: var(--serif);
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--averra-cream);
          margin-bottom: 3rem;
          opacity: 0;
          animation: fadeUp 2.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }

        .hero-subtext {
          font-family: var(--serif-alt);
          font-size: 1rem;
          font-weight: 300;
          line-height: 2;
          color: var(--averra-muted);
          opacity: 0;
          animation: fadeUp 2.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
        }

        .hero-subtext p {
          margin-bottom: 1.5rem;
        }

        .hero-subtext p:last-child {
          margin-top: 2rem;
          color: var(--averra-mauve);
          font-style: italic;
        }

        /* ── QUIZ INFO SECTION ── */
        .quiz-info-section {
          background: var(--averra-dark);
          padding: 6rem 4rem 10rem;
          position: relative;
        }

        .quiz-info-block {
          max-width: 580px;
          margin: 0 auto;
          text-align: center;
        }

        .info-time {
          font-size: 0.62rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 3.5rem;
          font-family: var(--sans);
          font-weight: 400;
        }

        .info-discover-title {
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 2.5rem;
          font-family: var(--sans);
          font-weight: 400;
        }

        .info-discover-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 4rem;
          text-align: left;
        }

        .discover-item {
          font-family: var(--serif-alt);
          font-size: 0.92rem;
          font-weight: 300;
          line-height: 1.8;
          color: var(--averra-cream);
          padding-left: 1.8rem;
          position: relative;
        }

        .discover-item::before {
          content: '—';
          position: absolute;
          left: 0;
          color: var(--averra-mauve);
        }

        .info-buttons {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          align-items: center;
        }

        .info-primary-btn {
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--averra-cream);
          background: linear-gradient(135deg, rgba(201,150,158,0.2) 0%, rgba(201,150,158,0.12) 100%);
          border: 1px solid rgba(201,150,158,0.35);
          padding: 1.3rem 3rem;
          cursor: pointer;
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: var(--sans);
          font-weight: 400;
        }

        .info-primary-btn:hover {
          border-color: var(--averra-mauve);
          background: linear-gradient(135deg, rgba(201,150,158,0.28) 0%, rgba(201,150,158,0.18) 100%);
        }

        .info-secondary-btn {
          font-size: 0.68rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--averra-muted);
          background: transparent;
          border: none;
          padding: 0.8rem 1.5rem;
          cursor: pointer;
          transition: color 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: var(--sans);
          font-weight: 300;
        }

        .info-secondary-btn:hover {
          color: var(--averra-mauve);
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }

        @keyframes ambientPulse {
          0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes ambientPulseMobile {
          0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          /* PERFORMANCE: Keep glow visual with GPU acceleration */
          .hero-ambient-glow {
            animation: ambientPulseMobile 50s ease-in-out infinite;
            transform: translateZ(0); /* GPU acceleration */
            will-change: opacity, transform;
            backface-visibility: hidden;
          }

          /* Keep smooth animations with optimization */
          .hero-label {
            animation: fadeUp 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          }
          .hero-headline {
            animation: fadeUp 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
          }
          .hero-subtext {
            animation: fadeUp 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
          }

          /* Keep luxury button transitions */
          .info-primary-btn {
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .info-secondary-btn {
            transition: color 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .quiz-hero { padding: 5rem 1.5rem; min-height: auto; }
          .hero-headline { font-size: clamp(2.2rem, 9vw, 3.5rem); }
          .hero-subtext { font-size: 0.95rem; line-height: 1.9; }
          .quiz-info-section { padding: 5rem 1.5rem 8rem; }
          .info-time { font-size: 0.6rem; margin-bottom: 3rem; }
          .info-discover-title { font-size: 0.65rem; margin-bottom: 2.2rem; }
          .info-discover-list { gap: 1.4rem; margin-bottom: 3.5rem; }
          .discover-item { font-size: 0.9rem; }
          .info-primary-btn { padding: 1.2rem 2.5rem; font-size: 0.65rem; }
          .info-secondary-btn { font-size: 0.65rem; }
        }

        @media (max-width: 600px) {
          /* PERFORMANCE: Keep visuals with GPU optimization */
          .hero-ambient-glow {
            animation: ambientPulseMobile 55s ease-in-out infinite;
          }

          /* Keep luxury animations */
          .hero-label {
            animation: fadeUp 2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          }
          .hero-headline {
            animation: fadeUp 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
          }
          .hero-subtext {
            animation: fadeUp 2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
          }

          .info-primary-btn {
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .quiz-hero { padding: 4rem 1.2rem; }
          .hero-label { font-size: 0.58rem; margin-bottom: 2rem; }
          .hero-headline { font-size: clamp(2rem, 10vw, 2.8rem); line-height: 1.15; margin-bottom: 2rem; }
          .hero-subtext { font-size: 0.9rem; line-height: 1.85; }
          .hero-subtext p { margin-bottom: 1.2rem; }
          .quiz-info-section { padding: 4rem 1.2rem 6rem; }
          .quiz-info-block { max-width: 100%; }
          .info-time { font-size: 0.58rem; margin-bottom: 2.8rem; }
          .info-discover-title { font-size: 0.62rem; margin-bottom: 2rem; }
          .info-discover-list { gap: 1.3rem; margin-bottom: 3.2rem; }
          .discover-item { font-size: 0.88rem; line-height: 1.75; padding-left: 1.6rem; }
          .info-buttons { gap: 1rem; width: 100%; }
          .info-primary-btn { padding: 1.15rem 2rem; font-size: 0.62rem; width: 100%; }
          .info-secondary-btn { font-size: 0.62rem; padding: 0.8rem 1.2rem; }
        }
      `}</style>

      {/* HERO */}
      <section className="quiz-hero">
        <div className="hero-bg"></div>
        <div className="hero-grain"></div>
        <div className="hero-ambient-glow"></div>
        <div className="hero-content">
          <p className="hero-label">The AVERRA Quiz</p>
          <h1 className="hero-headline">
            Your business was never supposed to feel this heavy.
          </h1>
          <div className="hero-subtext">
            <p>Most beauty professionals are not failing because they are lazy or untalented.</p>
            <p>They built businesses that still depend entirely on them being available all the time.</p>
            <p>The pressure slowly becomes normal. The exhaustion becomes routine. And eventually the business starts depending on your burnout to keep moving.</p>
            <p>This quiz was built to show you why.</p>
          </div>
        </div>
      </section>

      {/* QUIZ INFO */}
      <section className="quiz-info-section">
        <div className="quiz-info-block">
          <p className="info-time">Estimated Time: 2 Minutes</p>

          <p className="info-discover-title">You'll Discover:</p>

          <div className="info-discover-list">
            <div className="discover-item">What pattern is keeping your business emotionally exhausting</div>
            <div className="discover-item">Why being fully booked still feels stressful</div>
            <div className="discover-item">What your current business structure is actually costing you</div>
            <div className="discover-item">What needs to change for the business to finally feel sustainable</div>
          </div>

          <div className="info-buttons">
            <button
              className="info-primary-btn"
              onClick={() => navigate("/quiz")}
            >
              Begin The Quiz
            </button>
            <button
              className="info-secondary-btn"
              onClick={() => navigate("/about")}
            >
              Learn More About AVERRA
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
