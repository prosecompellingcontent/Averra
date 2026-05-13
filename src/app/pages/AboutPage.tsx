import { Navigation } from "@/app/components/Navigation";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/app/context/CartContext";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function AboutPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // LUXURY TIMING: Higher threshold = less sensitive, more breathing room
    // Mobile and desktop use SAME conservative threshold for calm, weighted reveals
    const threshold = 0.25; // Increased from 0.08-0.15 to 0.25 for luxury pacing

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // CRITICAL: Unobserve after first trigger to prevent re-animation on scroll
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px' // Delay trigger until element is well into viewport
      }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .exp-item, .pillar');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="about-page">
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
          --averra-border: rgba(37, 18, 24, 0.1);
          --serif: 'Playfair Display', serif;
          --serif-alt: 'Lora', serif;
          --sans: 'Montserrat', sans-serif;
        }

        html { scroll-behavior: smooth; }

        .about-page {
          background: var(--averra-dark);
          color: var(--averra-cream);
          font-family: var(--sans);
          font-weight: 300;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .about-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 4rem 8rem;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(201,150,158,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 80% at 20% 70%, rgba(201,150,158,0.05) 0%, transparent 50%),
            linear-gradient(160deg, #1a0e12 0%, #251218 40%, #2f1c23 100%);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }

        .hero-line {
          position: absolute;
          top: 0; left: 4rem;
          width: 1px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(201,150,158,0.2) 30%, rgba(201,150,158,0.1) 70%, transparent);
        }

        .hero-content {
          position: relative;
          max-width: 820px;
        }

        .hero-eyebrow {
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeUp 1s 0.3s forwards;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 40px;
          height: 1px;
          background: var(--averra-mauve);
        }

        .hero-headline {
          font-family: var(--serif);
          font-size: clamp(3.5rem, 7vw, 6.5rem);
          font-weight: 300;
          line-height: 1.05;
          color: var(--averra-cream);
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeUp 1.2s 0.5s forwards;
        }
        .hero-headline em {
          font-style: italic;
          color: var(--averra-mauve);
        }

        .hero-sub {
          font-size: 0.85rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: var(--averra-muted);
          line-height: 1.8;
          max-width: 480px;
          opacity: 0;
          animation: fadeUp 1s 0.8s forwards;
          margin-bottom: 3rem;
        }

        .hero-scroll {
          opacity: 0;
          animation: fadeUp 1s 1.2s forwards;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--averra-mauve);
        }
        .scroll-line {
          width: 40px;
          height: 1px;
          background: var(--averra-mauve);
          animation: scrollPulse 2s 2s infinite;
        }

        /* ── STATEMENT BREAK ── */
        .statement-break {
          background: var(--averra-cream);
          padding: 8rem 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .statement-break::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,150,158,0.12) 0%, transparent 70%);
        }
        .statement-text {
          font-family: var(--serif);
          font-size: clamp(2rem, 4.5vw, 4rem);
          font-weight: 300;
          line-height: 1.2;
          color: var(--averra-dark);
          text-align: center;
          max-width: 800px;
          position: relative;
        }
        .statement-text em {
          font-style: italic;
          color: var(--averra-mauve);
        }

        /* ── NARRATIVE ── */
        .narrative {
          background: var(--averra-dark);
          padding: 8rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .narrative-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: start;
        }
        .narrative-label {
          font-size: 0.62rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .narrative-label::before {
          content: '';
          display: block;
          width: 30px;
          height: 1px;
          background: var(--averra-mauve);
        }
        .narrative-heading {
          font-family: var(--serif);
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 300;
          line-height: 1.2;
          color: var(--averra-cream);
          margin-bottom: 2rem;
        }
        .narrative-body {
          font-family: var(--serif-alt);
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 2;
          color: var(--averra-muted);
          margin-bottom: 1.5rem;
        }

        /* ── EXPERIENCE LIST ── */
        .experience-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-top: 3rem;
        }
        .exp-item {
          padding: 2rem 0;
          border-bottom: 1px solid rgba(201,150,158,0.1);
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 1.5rem;
          align-items: start;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s, transform 0.6s;
        }
        .exp-item.visible { opacity: 1; transform: none; }
        .exp-num {
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--averra-mauve);
          padding-top: 0.2rem;
          font-weight: 400;
        }
        .exp-body {
          font-family: var(--serif);
          font-size: 1.15rem;
          font-weight: 300;
          line-height: 1.6;
          color: var(--averra-blush);
        }

        /* ── PULL QUOTE ── */
        .pull-quote {
          background: #2f1c23;
          padding: 10rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .pull-quote::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, transparent, var(--averra-mauve));
        }
        .pull-quote::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 80px;
          background: linear-gradient(to top, transparent, var(--averra-mauve));
        }
        .pull-quote-text {
          font-family: var(--serif);
          font-size: clamp(2.2rem, 5vw, 4.5rem);
          font-weight: 300;
          font-style: italic;
          line-height: 1.2;
          color: var(--averra-cream);
          max-width: 900px;
          margin: 0 auto;
        }
        .pull-quote-text span {
          display: block;
          font-style: normal;
          font-size: clamp(1rem, 2vw, 1.5rem);
          color: var(--averra-mauve);
          margin-top: 2rem;
          letter-spacing: 0.08em;
        }

        /* ── MARQUEE ── */
        .marquee-section {
          background: var(--averra-cream);
          padding: 3rem 0;
          overflow: hidden;
          position: relative;
        }
        .marquee-track {
          display: flex;
          gap: 10rem; /* Massive spacing for luxury feel */
          animation: none !important;
          width: max-content;
          transform: translate3d(0,0,0); /* GPU acceleration */
          will-change: transform;
          padding: 0 3rem;
        }
        .marquee-item {
          font-family: var(--serif);
          font-size: 1.8rem;
          font-weight: 300;
          font-style: italic;
          color: var(--averra-dark);
          white-space: nowrap;
          opacity: 0.7;
        }
        .marquee-dot {
          color: var(--averra-mauve);
          font-style: normal;
        }
        @keyframes marquee {
          from {
            transform: translate3d(0,0,0);
          }
          to {
            transform: translate3d(-50%,0,0);
          }
        }

        @media (max-width: 900px) {
          .marquee-track {
            gap: 6rem; /* Still generous spacing on mobile */
          }
        }


        /* ── FOUNDER ── */
        .founder {
          background: var(--averra-dark);
          padding: 0;
          overflow: hidden;
        }
        .founder-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 90vh;
        }
        .founder-visual {
          position: relative;
          background: #2f1c23;
          overflow: hidden;
          min-height: 600px;
        }
        .founder-visual {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .founder-portrait-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .founder-portrait {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 3rem;
          background: rgba(37,18,24,0.75);
        }
        .founder-name-overlay {
          position: relative;
          z-index: 2;
        }
        .founder-name {
          font-family: var(--serif);
          font-size: 2.5rem;
          font-weight: 300;
          color: var(--averra-cream);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .founder-title {
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--averra-mauve);
        }

        .founder-content {
          padding: 7rem 5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .founder-label {
          font-size: 0.62rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .founder-label::before {
          content: '';
          display: block;
          width: 30px;
          height: 1px;
          background: var(--averra-mauve);
        }
        .founder-headline {
          font-family: var(--serif);
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 300;
          color: var(--averra-cream);
          line-height: 1.3;
          margin-bottom: 2.5rem;
        }
        .founder-text {
          font-family: var(--serif-alt);
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 2;
          color: var(--averra-muted);
          margin-bottom: 1.2rem;
        }
        .founder-certs {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(201,150,158,0.15);
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .cert-tag {
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          padding: 0.4rem 0.9rem;
          border: 1px solid rgba(201,150,158,0.3);
        }

        /* ── WHAT AVERRA ── */
        .what-averra {
          background: var(--averra-dark);
          padding: 8rem 4rem;
        }
        .what-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 6rem;
          gap: 4rem;
        }
        .section-header-text { flex: 1; }
        .section-num {
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          color: var(--averra-mauve);
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .section-big-title {
          font-family: var(--serif);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          color: var(--averra-cream);
          line-height: 1.1;
        }
        .section-big-title em { font-style: italic; color: var(--averra-mauve); }
        .section-desc {
          font-family: var(--serif-alt);
          font-size: 0.82rem;
          font-weight: 300;
          line-height: 2;
          color: var(--averra-muted);
          max-width: 360px;
          text-align: right;
        }

        .pillars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid rgba(201,150,158,0.15);
        }
        .pillar {
          padding: 2.5rem 2rem;
          border-right: 1px solid rgba(201,150,158,0.15);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s, transform 0.7s;
        }
        .pillar:last-child { border-right: none; }
        .pillar.visible { opacity: 1; transform: none; }
        .pillar::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--averra-mauve);
          transform: scaleX(0);
          transition: transform 0.4s;
          transform-origin: left;
        }
        .pillar:hover::before { transform: scaleX(1); }
        .pillar-num {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: var(--averra-mauve);
          margin-bottom: 1.5rem;
          font-weight: 400;
        }
        .pillar-title {
          font-family: var(--serif);
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--averra-cream);
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .pillar-text {
          font-family: var(--serif-alt);
          font-size: 0.78rem;
          font-weight: 300;
          line-height: 1.9;
          color: var(--averra-muted);
        }

        /* ── CLOSING ── */
        .closing {
          background: var(--averra-cream);
          padding: 10rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .closing::before {
          content: '"';
          position: absolute;
          top: -2rem; left: 50%;
          transform: translateX(-50%);
          font-family: var(--serif);
          font-size: 20rem;
          color: rgba(201,150,158,0.07);
          line-height: 1;
          pointer-events: none;
        }
        .closing-inner { position: relative; max-width: 800px; margin: 0 auto; }
        .closing-eyebrow {
          font-size: 0.62rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 3rem;
        }
        .closing-headline {
          font-family: var(--serif);
          font-size: clamp(2rem, 4.5vw, 3.8rem);
          font-weight: 300;
          line-height: 1.3;
          color: var(--averra-dark);
          margin-bottom: 3rem;
        }
        .closing-headline em { font-style: italic; color: var(--averra-mauve); }
        .closing-body {
          font-family: var(--serif-alt);
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 2;
          color: #4a3842;
          margin-bottom: 1.2rem;
        }
        .cta-row {
          margin-top: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .cta-btn {
          display: inline-block;
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--averra-dark);
          text-decoration: none;
          padding: 1.1rem 2.5rem;
          border: 1px solid var(--averra-mauve);
          background: transparent;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
          position: relative;
          overflow: hidden;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--averra-mauve);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s;
          z-index: 0;
        }
        .cta-btn:hover::before { transform: scaleX(1); }
        .cta-btn:hover { color: var(--averra-cream); }
        .cta-btn span { position: relative; z-index: 1; }
        .cta-text {
          font-size: 0.75rem;
          color: var(--averra-muted);
          letter-spacing: 0.05em;
        }

        .gold-divider {
          width: 60px;
          height: 1px;
          background: var(--averra-mauve);
          margin: 3rem auto;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* LUXURY TIMING: Slow, weighted, cinematic reveals */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 2.8s cubic-bezier(0.16, 1, 0.3, 1), transform 2.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible { opacity: 1; transform: none; }

        .reveal-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 2.8s cubic-bezier(0.16, 1, 0.3, 1), transform 2.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-left.visible { opacity: 1; transform: none; }

        .reveal-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 2.8s cubic-bezier(0.16, 1, 0.3, 1), transform 2.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-right.visible { opacity: 1; transform: none; }

        /* Longer delays for breathing room */
        .delay-1 { transition-delay: 0.3s; }
        .delay-2 { transition-delay: 0.6s; }
        .delay-3 { transition-delay: 0.9s; }
        .delay-4 { transition-delay: 1.2s; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          /* PERFORMANCE: Keep visuals, optimize with GPU acceleration */
          .reveal {
            transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1);
            transform: translateZ(0); /* GPU acceleration */
            will-change: opacity, transform;
          }
          .reveal-left, .reveal-right {
            transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1);
            transform: translateZ(0);
            will-change: opacity, transform;
          }
          .exp-item {
            transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
            transform: translateZ(0);
          }
          .pillar {
            transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
            transform: translateZ(0);
          }
          .delay-1 { transition-delay: 0.3s; }
          .delay-2 { transition-delay: 0.6s; }
          .delay-3 { transition-delay: 0.9s; }
          .delay-4 { transition-delay: 1.2s; }

          /* Keep smooth button transitions */
          .cta-btn { transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
          .cta-btn::before { transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
          .pillar::before { transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); }

          .about-hero { padding: 0 1.5rem 4rem; min-height: 90vh; }
          .hero-headline { font-size: clamp(2.8rem, 9vw, 4.5rem); }
          .hero-sub { font-size: 0.82rem; }
          .statement-break { padding: 5rem 1.5rem; }
          .statement-text { font-size: clamp(1.6rem, 6vw, 3rem); }
          .narrative { padding: 5rem 1.5rem; }
          .narrative-inner { grid-template-columns: 1fr; gap: 3rem; }
          .narrative-heading { font-size: clamp(1.6rem, 5vw, 2.5rem); }
          .narrative-body { font-size: 0.85rem; }
          .exp-body { font-size: 1.05rem; }
          .pull-quote { padding: 6rem 1.5rem; }
          .pull-quote-text { font-size: clamp(1.8rem, 6vw, 3.5rem); }
          .founder-inner { grid-template-columns: 1fr; }
          .founder-visual { min-height: 450px; }
          .founder-content { padding: 4rem 1.5rem; }
          .founder-headline { font-size: clamp(1.5rem, 4vw, 2.2rem); }
          .founder-text { font-size: 0.82rem; }
          .what-averra { padding: 5rem 1.5rem; }
          .section-big-title { font-size: clamp(2rem, 6vw, 3.5rem); }
          .pillars { grid-template-columns: 1fr 1fr; }
          .pillar:nth-child(2) { border-right: none; }
          .pillar:nth-child(3) { border-right: 1px solid rgba(201,150,158,0.15); }
          .pillar { padding: 2rem 1.5rem; }
          .section-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .section-desc { text-align: left; max-width: 100%; }
          .closing { padding: 6rem 1.5rem; }
          .closing-headline { font-size: clamp(1.6rem, 6vw, 3rem); }
        }
        @media (max-width: 600px) {
          /* PERFORMANCE: Keep same luxury timing with GPU acceleration */
          .reveal {
            transition: opacity 2.2s cubic-bezier(0.16, 1, 0.3, 1), transform 2.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .reveal-left, .reveal-right {
            transition: opacity 2.2s cubic-bezier(0.16, 1, 0.3, 1), transform 2.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .exp-item {
            transition: opacity 3.9s cubic-bezier(0.16, 1, 0.3, 1), transform 3.9s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .pillar {
            transition: opacity 4s cubic-bezier(0.16, 1, 0.3, 1), transform 4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .about-hero { padding: 0 1.2rem 3rem; min-height: 85vh; }
          .hero-eyebrow { font-size: 0.6rem; margin-bottom: 1.8rem; }
          .hero-headline { font-size: clamp(2.2rem, 10vw, 3.2rem); line-height: 1.08; margin-bottom: 1.8rem; }
          .hero-sub { font-size: 0.78rem; line-height: 1.7; max-width: 100%; margin-bottom: 2.5rem; }
          .hero-scroll { font-size: 0.62rem; }
          .statement-break { padding: 4rem 1.2rem; }
          .statement-text { font-size: clamp(1.4rem, 7vw, 2.2rem); line-height: 1.25; }
          .narrative { padding: 4rem 1.2rem; }
          .narrative-label { font-size: 0.6rem; margin-bottom: 2rem; }
          .narrative-heading { font-size: clamp(1.4rem, 6vw, 2rem); margin-bottom: 1.5rem; }
          .narrative-body { font-size: 0.82rem; line-height: 1.9; margin-bottom: 1.3rem; }
          .experience-list { padding-top: 2.5rem; gap: 0; }
          .exp-item { padding: 1.8rem 0; gap: 1.2rem; }
          .exp-body { font-size: 1rem; line-height: 1.55; }
          .pull-quote { padding: 5rem 1.2rem; }
          .pull-quote::before, .pull-quote::after { height: 60px; }
          .pull-quote-text { font-size: clamp(1.5rem, 7vw, 2.5rem); }
          .pull-quote-text span { font-size: clamp(0.85rem, 3vw, 1.2rem); margin-top: 1.5rem; }
          .founder-visual { min-height: 380px; }
          .founder-portrait-letter { font-size: 10rem; }
          .founder-name { font-size: 2rem; }
          .founder-title { font-size: 0.62rem; }
          .founder-content { padding: 3rem 1.2rem; }
          .founder-label { font-size: 0.6rem; margin-bottom: 2rem; }
          .founder-headline { font-size: clamp(1.3rem, 5vw, 1.8rem); margin-bottom: 2rem; }
          .founder-text { font-size: 0.8rem; line-height: 1.9; margin-bottom: 1rem; }
          .founder-certs { margin-top: 2.5rem; padding-top: 1.8rem; gap: 0.8rem; }
          .cert-tag { font-size: 0.6rem; padding: 0.35rem 0.8rem; }
          .what-averra { padding: 4rem 1.2rem; }
          .section-num { font-size: 0.58rem; margin-bottom: 0.8rem; }
          .section-big-title { font-size: clamp(1.8rem, 7vw, 2.8rem); }
          .section-desc { font-size: 0.8rem; line-height: 1.9; }
          .section-header { margin-bottom: 4rem; gap: 1.5rem; }
          .pillars { grid-template-columns: 1fr; }
          .pillar { border-right: none; border-bottom: 1px solid rgba(201,150,158,0.15); padding: 2rem 1.2rem; }
          .pillar:last-child { border-bottom: none; }
          .pillar-num { font-size: 0.56rem; margin-bottom: 1.2rem; }
          .pillar-title { font-size: 1.3rem; margin-bottom: 0.8rem; }
          .pillar-text { font-size: 0.76rem; line-height: 1.85; }
          .closing { padding: 5rem 1.2rem; }
          .closing::before { font-size: 15rem; top: -1.5rem; }
          .closing-eyebrow { font-size: 0.6rem; margin-bottom: 2.5rem; }
          .closing-headline { font-size: clamp(1.5rem, 7vw, 2.5rem); margin-bottom: 2.5rem; }
          .closing-body { font-size: 0.82rem; line-height: 1.9; margin-bottom: 1rem; }
          .cta-row { flex-direction: column; gap: 1rem; margin-top: 3rem; }
          .cta-btn { font-size: 0.65rem; padding: 1rem 2rem; width: 100%; text-align: center; }
          .cta-text { font-size: 0.72rem; }
          .gold-divider { width: 50px; margin: 2.5rem auto; }
        }
      `}</style>

      {/* HERO */}
      <section className="about-hero">
        <div className="hero-bg"></div>
        <div className="hero-grain"></div>
        <div className="hero-line"></div>
        <div className="hero-content">
          <p className="hero-eyebrow">About AVERRA</p>
          <h1 className="hero-headline">
            Building businesses<br/>that can eventually<br/><em>support your life.</em>
          </h1>
          <p className="hero-sub">
            Not consume all of it.
          </p>
          <div className="hero-scroll">
            <div className="scroll-line"></div>
            Scroll to explore
          </div>
        </div>
      </section>

      {/* STATEMENT BREAK 1 */}
      <div className="statement-break">
        <p className="statement-text reveal">
          You built this business with your hands,<br/>
          your time, and years of learning<br/>
          how to be good at what you do.<br/><br/>
          <em>Nobody warned you the business itself<br/>would eventually become the exhausting part.</em>
        </p>
      </div>

      {/* NARRATIVE SECTION 1 */}
      <section className="narrative">
        <div className="narrative-inner">
          <div>
            <div className="narrative-label reveal">The Pattern</div>
            <h2 className="narrative-heading reveal delay-1">
              At first, being fully booked felt exciting.
            </h2>
            <p className="narrative-body reveal delay-2">
              Then your days started revolving around cancellations, reschedules, last minute messages, and trying to fit more hours into a schedule that already feels full.
            </p>
            <p className="narrative-body reveal delay-3">
              The business keeps moving. But only if you do.
            </p>
            <p className="narrative-body reveal delay-4">
              That is the part most beauty professionals were never taught how to fix. Not the service. Not the artistry. The structure behind the business itself.
            </p>
          </div>
          <div className="experience-list reveal-right">
            <div className="exp-item" style={{ transitionDelay: '0s' }}>
              <div className="exp-num">01</div>
              <div className="exp-body">You were taught how to perfect the service. Not how to build beyond it.</div>
            </div>
            <div className="exp-item" style={{ transitionDelay: '0.1s' }}>
              <div className="exp-num">02</div>
              <div className="exp-body">The stylist who was fully booked and still financially stressed.</div>
            </div>
            <div className="exp-item" style={{ transitionDelay: '0.2s' }}>
              <div className="exp-num">03</div>
              <div className="exp-body">The lash artist answering messages late at night because silence felt expensive.</div>
            </div>
            <div className="exp-item" style={{ transitionDelay: '0.3s' }}>
              <div className="exp-num">04</div>
              <div className="exp-body">The esthetician who kept calling the exhaustion "dedication" because everyone around her looked tired too.</div>
            </div>
            <div className="exp-item" style={{ transitionDelay: '0.4s' }}>
              <div className="exp-num">05</div>
              <div className="exp-body">The talent was never the issue. The structure was.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC PULL QUOTE 1 */}
      <div className="pull-quote">
        <p className="pull-quote-text reveal">
          Most providers are not lazy.<br/>They are trapped inside<br/>labor dependent business models.
          <span>— A pattern impossible to ignore</span>
        </p>
      </div>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          <span className="marquee-item">Structure <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Positioning <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Systems <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Expansion <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Freedom <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Strategy <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Scalable Growth <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Financial Freedom <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Structure <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Positioning <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Systems <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Expansion <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Freedom <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Strategy <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Scalable Growth <span className="marquee-dot">·</span></span>
          <span className="marquee-item">Financial Freedom <span className="marquee-dot">·</span></span>
        </div>
      </div>

      {/* FOUNDER SECTION */}
      <section className="founder">
        <div className="founder-inner">
          <div className="founder-visual">
            <img
              src="/meet-the-ceo.png"
              alt="Jayla Smith - Founder"
              className="founder-portrait-image"
            />
            <div className="founder-portrait">
              <div className="founder-name-overlay">
                <h3 className="founder-name">Jayla Smith</h3>
                <p className="founder-title">Founder &amp; CEO, AVERRA</p>
              </div>
            </div>
          </div>
          <div className="founder-content">
            <div className="founder-label reveal-right">Meet The Founder</div>
            <h2 className="founder-headline reveal-right delay-1">
              She did not build AVERRA<br/>from the outside looking in.
            </h2>
            <p className="founder-text reveal-right delay-2">
              Jayla Smith is the Founder of AVERRA, a self made entrepreneur, investor, and business strategist focused on helping beauty professionals build businesses that can grow beyond nonstop labor.
            </p>
            <p className="founder-text reveal-right delay-3">
              She grew up inside salon and spa environments watching beauty professionals work long hours to build something for themselves while quietly carrying the pressure of keeping the entire business running every day. Her stepmother owned a salon. Her father handled the business operations and bookkeeping.
            </p>
            <p className="founder-text reveal-right delay-4">
              From a young age, she was exposed to both sides of the industry at the same time: the artistry and the structure behind keeping a business alive.
            </p>
            <p className="founder-text reveal-right delay-4">
              She worked inside beauty businesses herself, performed services, studied client behavior, and later worked in beauty school admissions where she saw firsthand how many providers entered the industry passionate about beauty but unprepared for the business realities waiting for them afterward.
            </p>
            <div className="founder-certs reveal-right delay-4">
              <span className="cert-tag">Digital Marketing</span>
              <span className="cert-tag">Brand Strategy</span>
              <span className="cert-tag">Consumer Psychology</span>
              <span className="cert-tag">Ecommerce</span>
              <span className="cert-tag">Analytics</span>
              <span className="cert-tag">Media Communication</span>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE 2 */}
      <div className="pull-quote" style={{ background: '#2f1c23' }}>
        <p className="pull-quote-text reveal">
          Talented providers were becoming<br/>fully booked while still<br/>financially overwhelmed.
          <span>The gap nobody was filling</span>
        </p>
      </div>

      {/* WHAT AVERRA IS */}
      <section className="what-averra">
        <div className="what-inner">
          <div className="section-header">
            <div className="section-header-text reveal-left">
              <p className="section-num">What AVERRA actually is</p>
              <h2 className="section-big-title">
                A business growth system.<br/><em>Not another course.</em>
              </h2>
            </div>
            <p className="section-desc reveal-right">
              AVERRA is built specifically for beauty professionals ready to grow beyond nonstop appointments, overbooking, and income tied only to working more hours.
            </p>
          </div>
          <div className="pillars">
            <div className="pillar" style={{ transitionDelay: '0s' }}>
              <p className="pillar-num">01</p>
              <h3 className="pillar-title">Structure</h3>
              <p className="pillar-text">Business architecture designed for longevity, not just tomorrow's bookings.</p>
            </div>
            <div className="pillar" style={{ transitionDelay: '0.12s' }}>
              <p className="pillar-num">02</p>
              <h3 className="pillar-title">Positioning</h3>
              <p className="pillar-text">How perception shapes what clients pay, and who they trust before they ever book.</p>
            </div>
            <div className="pillar" style={{ transitionDelay: '0.24s' }}>
              <p className="pillar-num">03</p>
              <h3 className="pillar-title">Systems</h3>
              <p className="pillar-text">Replacing your physical presence with processes that work even when you don't.</p>
            </div>
            <div className="pillar" style={{ transitionDelay: '0.36s' }}>
              <p className="pillar-num">04</p>
              <h3 className="pillar-title">Expansion</h3>
              <p className="pillar-text">Income that can grow beyond the chair, the hour, and your physical availability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING MANIFESTO */}
      <section className="closing">
        <div className="closing-inner">
          <p className="closing-eyebrow reveal">The goal was never just to stay booked</p>
          <div className="gold-divider reveal"></div>
          <h2 className="closing-headline reveal delay-1">
            Your artistry is irreplaceable.<br/><em>Your burnout is not.</em>
          </h2>
          <p className="closing-body reveal delay-2">
            Your clients matter. Constant exhaustion should not be the requirement for keeping them.
          </p>
          <p className="closing-body reveal delay-3">
            The goal is financial freedom, stronger structure, scalable growth, and building something that can eventually outgrow the chair itself.
          </p>
          <p className="closing-body reveal delay-3">
            Your business should eventually support your life. Not consume all of it.
          </p>
          <p className="closing-body reveal delay-4">
            If you have been looking for a smarter way to grow without feeling like you need to work every hour to keep the business moving, you are exactly where you need to be.
          </p>
          <div className="cta-row reveal delay-4">
            <button
              onClick={() => {
                addItem({
                  id: "gold-standard-ebook",
                  name: "The Gold Standard: Building Beyond The Chair",
                  price: 97,
                  originalPrice: 147,
                  type: "digital"
                });
                navigate("/checkout");
              }}
              className="cta-btn"
            >
              <span>Get The Gold Standard</span>
            </button>
            <span className="cta-text">or</span>
            <button onClick={() => navigate("/services")} className="cta-btn">
              <span>Explore What AVERRA Offers</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div style={{ paddingBottom: '4rem' }}></div>
    </div>
  );
}
