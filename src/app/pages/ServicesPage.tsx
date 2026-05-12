import { Navigation } from "@/app/components/Navigation";
import { useNavigate } from "react-router";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { useCart } from "@/app/context/CartContext";
import { CTAFooter } from "@/app/components/CTAFooter";
import { MarqueeScroll } from "@/app/components/MarqueeScroll";

export function ServicesPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleDownloadEbook = () => {
    addItem({
      id: "gold-standard-ebook",
      name: "The Gold Standard: Building Beyond The Chair",
      price: 97,
      originalPrice: 147,
      type: "digital"
    });
    navigate("/checkout");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lora:wght@300;400;500;600&family=Montserrat:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        :root {
          --averra-cream: #fdf5f7;
          --averra-blush: #fcf3f5;
          --averra-dark: #251218;
          --averra-mauve: #c9969e;
          --averra-muted: #6b585d;
          --averra-border: rgba(37, 18, 24, 0.1);
        }

        .services-page {
          font-family: 'Montserrat', sans-serif;
          background: var(--averra-cream);
          color: var(--averra-dark);
          font-size: 15px;
          line-height: 1.7;
        }

        .pf { font-family: 'Playfair Display', serif; }
        .lr { font-family: 'Lora', serif; }
        .ms { font-family: 'Montserrat', sans-serif; }

        @keyframes ambientGlow {
          0%, 100% {
            opacity: 0.5;
            transform: scale3d(1, 1, 1); /* GPU accelerated */
          }
          50% {
            opacity: 0.75;
            transform: scale3d(1.05, 1.05, 1); /* GPU accelerated */
          }
        }

        @keyframes ambientGlowMobile {
          0%, 100% {
            opacity: 0.4;
            transform: scale3d(1, 1, 1); /* GPU accelerated */
          }
          50% {
            opacity: 0.65;
            transform: scale3d(1.03, 1.03, 1); /* GPU accelerated */
          }
        }

        @keyframes softFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0); /* GPU accelerated */
          }
          50% {
            transform: translate3d(0, -12px, 0); /* GPU accelerated */
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0); /* GPU accelerated */
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0); /* GPU accelerated */
          }
        }

        .ebook-glow {
          animation: ambientGlow 50s ease-in-out infinite;
        }

        .ebook-float {
          animation: softFloat 8s ease-in-out infinite;
          /* PERFORMANCE: GPU acceleration for smooth animation */
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }

        .pain-item {
          animation: fadeInUp 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .pain-item:nth-child(1) { animation-delay: 0.1s; }
        .pain-item:nth-child(2) { animation-delay: 0.2s; }
        .pain-item:nth-child(3) { animation-delay: 0.3s; }
        .pain-item:nth-child(4) { animation-delay: 0.4s; }
        .pain-item:nth-child(5) { animation-delay: 0.5s; }
        .pain-item:nth-child(6) { animation-delay: 0.6s; }

        /* Hero Section */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 86vh;
        }

        .hero-text {
          padding: 80px 60px 80px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--averra-cream);
        }

        .hero-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 24px;
        }

        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 68px);
          font-weight: 400;
          line-height: 1.08;
          color: var(--averra-dark);
          margin-bottom: 12px;
        }

        .hero-headline em {
          font-style: italic;
          color: var(--averra-mauve);
        }

        .hero-sub {
          font-size: 14px;
          color: var(--averra-muted);
          line-height: 1.8;
          max-width: 400px;
          margin-bottom: 40px;
        }

        .hero-sub strong {
          color: var(--averra-dark);
          font-weight: 600;
        }

        .hero-btns {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: var(--averra-dark);
          color: var(--averra-mauve);
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 16px 36px;
          border: none;
          cursor: pointer;
          transition: background 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-primary:hover {
          background: #3a232d;
        }

        .btn-outline {
          background: transparent;
          color: var(--averra-dark);
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 15px 36px;
          border: 1px solid var(--averra-dark);
          cursor: pointer;
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-outline:hover {
          background: var(--averra-dark);
          color: var(--averra-mauve);
        }

        .hero-image {
          position: relative;
          overflow: hidden;
          background: var(--averra-blush);
        }

        .hero-image-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(160deg, #3a232d 0%, #251218 40%, #1a0e12 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-monogram {
          font-family: 'Playfair Display', serif;
          font-size: 220px;
          font-weight: 300;
          color: rgba(201, 150, 158, 0.12);
          letter-spacing: -0.05em;
          user-select: none;
          line-height: 1;
        }

        .hero-badge {
          position: absolute;
          bottom: 40px;
          left: 40px;
          background: var(--averra-mauve);
          color: var(--averra-cream);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 10px 20px;
        }

        /* Pain Section */
        .pain-section {
          background: var(--averra-dark);
          padding: 80px;
        }

        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 32px;
        }

        .pain-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3.5vw, 46px);
          font-weight: 400;
          color: var(--averra-cream);
          line-height: 1.2;
          margin-bottom: 48px;
          max-width: 640px;
        }

        .pain-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-top: 0.5px solid rgba(253, 245, 247, 0.1);
        }

        .pain-item {
          padding: 28px 0;
          border-bottom: 0.5px solid rgba(253, 245, 247, 0.1);
          font-size: 15px;
          color: rgba(253, 245, 247, 0.85);
          line-height: 1.7;
        }

        .pain-item:nth-child(odd) {
          padding-right: 40px;
          border-right: 0.5px solid rgba(253, 245, 247, 0.1);
        }

        .pain-item:nth-child(even) {
          padding-left: 40px;
        }

        /* Ebook Feature */
        .ebook-feature {
          padding: 120px 80px;
          background: var(--averra-cream);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .ebook-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ebook-glow-layer {
          position: absolute;
          width: 600px;
          height: 800px;
          background: radial-gradient(
            circle,
            rgba(201, 150, 158, 0.4) 0%,
            rgba(201, 150, 158, 0.25) 30%,
            rgba(255, 220, 200, 0.15) 50%,
            transparent 75%
          );
          border-radius: 50%;
          filter: blur(80px);
        }

        .ebook-glow-secondary {
          position: absolute;
          width: 700px;
          height: 900px;
          background: radial-gradient(
            circle,
            rgba(255, 235, 220, 0.2) 0%,
            rgba(201, 150, 158, 0.15) 40%,
            transparent 70%
          );
          border-radius: 50%;
          filter: blur(100px);
          animation: ambientGlow 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .ebook-cover {
          position: relative;
          max-width: 460px;
          width: 100%;
          box-shadow:
            0 40px 80px -20px rgba(37, 18, 24, 0.2),
            0 20px 40px -20px rgba(201, 150, 158, 0.25);
          border-radius: 8px;
        }

        .ebook-content .section-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 3.5vw, 48px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--averra-dark);
          margin-bottom: 20px;
        }

        .section-body {
          font-size: 14px;
          color: var(--averra-muted);
          line-height: 1.85;
          margin-bottom: 32px;
        }

        .ebook-price-wrap {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 8px;
        }

        .price-sale {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          font-weight: 300;
          color: var(--averra-dark);
          line-height: 1;
        }

        .price-original {
          font-size: 24px;
          color: rgba(37, 18, 24, 0.25);
          text-decoration: line-through;
        }

        .price-note {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(37, 18, 24, 0.4);
          margin-bottom: 36px;
        }

        .cta-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .cta-secondary {
          padding-top: 24px;
          border-top: 0.5px solid var(--averra-border);
        }

        /* Chapters Section */
        .chapters-section {
          padding: 120px 80px;
          background: var(--averra-cream);
        }

        .chapters-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .chapters-list {
          max-width: 900px;
          margin: 0 auto;
        }

        .chapter-item {
          padding: 48px 0;
          border-bottom: 0.5px solid var(--averra-border);
        }

        .chapter-item:first-child {
          border-top: 0.5px solid var(--averra-border);
        }

        .chapter-number {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--averra-mauve);
          margin-bottom: 16px;
        }

        .chapter-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 400;
          line-height: 1.2;
          color: var(--averra-dark);
          margin-bottom: 12px;
        }

        .chapter-subtitle {
          font-family: 'Lora', serif;
          font-size: 14px;
          font-style: italic;
          color: var(--averra-muted);
          line-height: 1.6;
        }

        /* Before/After Section */
        .transformation-section {
          background: var(--averra-dark);
          padding: 100px 80px;
        }

        .transformation-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .transformation-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .transform-col-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .transform-col-title::before {
          content: '';
          width: 24px;
          height: 1px;
        }

        .before-title::before { background: rgba(201, 150, 158, 0.3); }
        .after-title::before { background: var(--averra-mauve); }
        .before-title { color: rgba(253, 245, 247, 0.4); }
        .after-title { color: var(--averra-mauve); }

        .transform-list {
          list-style: none;
          border-top: 0.5px solid rgba(253, 245, 247, 0.1);
        }

        .transform-item {
          padding: 16px 0;
          border-bottom: 0.5px solid rgba(253, 245, 247, 0.1);
          font-size: 13px;
          line-height: 1.7;
        }

        .before-list .transform-item {
          color: rgba(253, 245, 247, 0.5);
        }

        .after-list .transform-item {
          color: rgba(253, 245, 247, 0.85);
        }

        /* Built For You Section */
        .built-for-section {
          padding: 80px;
          background: var(--averra-blush);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .for-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }

        .for-item {
          background: var(--averra-cream);
          padding: 18px 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--averra-dark);
          border-left: 2px solid var(--averra-mauve);
        }

        /* Testimonials */
        .testimonials {
          background: var(--averra-dark);
          padding: 100px 80px;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }

        .review-card {
          background: rgba(253, 245, 247, 0.04);
          padding: 36px 30px;
          border-top: 2px solid var(--averra-mauve);
        }

        .review-text {
          font-size: 13px;
          color: rgba(253, 245, 247, 0.8);
          line-height: 1.85;
          margin-bottom: 24px;
          font-style: italic;
        }

        .review-name {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--averra-mauve);
        }

        .review-role {
          font-size: 11px;
          color: rgba(253, 245, 247, 0.4);
          margin-top: 2px;
        }

        .review-initial {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--averra-mauve);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--averra-cream);
          margin-bottom: 18px;
        }

        /* Founder/System Section */
        .founder {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 60vh;
        }

        .founder-image {
          background: linear-gradient(140deg, #251218 0%, #3a232d 60%, #251218 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          min-height: 480px;
        }

        .founder-monogram {
          font-family: 'Playfair Display', serif;
          font-size: 180px;
          font-weight: 300;
          color: rgba(201, 150, 158, 0.1);
          letter-spacing: -0.05em;
        }

        .founder-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--averra-mauve);
        }

        .founder-text {
          padding: 80px;
          background: var(--averra-cream);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* About CTA */
        .about-cta {
          padding: 100px 80px;
          background: var(--averra-blush);
          text-align: center;
        }

        /* Responsive */
        @media (max-width: 900px) {
          /* PERFORMANCE OPTIMIZATION: Keep visuals, optimize rendering */
          .ebook-glow-layer {
            animation: ambientGlowMobile 50s ease-in-out infinite;
            /* GPU acceleration for smooth performance */
            transform: translateZ(0);
            will-change: opacity, transform;
            backface-visibility: hidden;
          }
          .ebook-glow-secondary {
            animation: ambientGlowMobile 55s ease-in-out infinite;
            animation-delay: 3s;
            /* GPU acceleration */
            transform: translateZ(0);
            will-change: opacity, transform;
            backface-visibility: hidden;
          }

          /* Keep same button transitions, optimize with GPU */
          .btn-primary, .btn-outline {
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            transform: translateZ(0);
          }

          /* Keep same fade animations */
          .pain-item {
            animation: fadeInUp 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .hero-section { grid-template-columns: 1fr; }
          .hero-image { display: none; }
          .hero-text { padding: 60px 24px; }
          .hero-headline { font-size: clamp(32px, 8vw, 52px); }
          .hero-subtext { font-size: 14px; line-height: 1.75; }
          .pain-section { padding: 60px 24px; }
          .pain-headline { font-size: clamp(26px, 6vw, 40px); }
          .pain-list { grid-template-columns: 1fr; }
          .pain-item { font-size: 14px; padding: 24px 0; }
          .pain-item:nth-child(odd) { padding-right: 0; border-right: none; }
          .pain-item:nth-child(even) { padding-left: 0; }
          .built-for-section { grid-template-columns: 1fr; gap: 40px; padding: 60px 24px; }
          .service-item { padding: 32px 24px; }
          .ebook-feature { grid-template-columns: 1fr; gap: 48px; padding: 70px 24px; }
          .ebook-visual { order: -1; margin-bottom: 24px; }
          .ebook-glow-layer { width: 400px; height: 550px; filter: blur(60px); }
          .ebook-glow-secondary { width: 450px; height: 600px; filter: blur(80px); }
          .ebook-cover { max-width: 360px; }
          .ebook-content .section-headline { font-size: clamp(28px, 6vw, 42px); }
          .section-body { font-size: 13px; }
          .price-sale { font-size: 52px; }
          .price-original { font-size: 20px; }
          .chapters-section { padding: 70px 24px; }
          .chapters-header { margin-bottom: 60px; }
          .chapters-header .section-headline { font-size: clamp(28px, 6vw, 42px); }
          .chapter-item { padding: 36px 0; }
          .chapter-title { font-size: clamp(20px, 4vw, 28px); }
          .transformation-section { padding: 70px 24px; }
          .transformation-grid { grid-template-columns: 1fr; gap: 48px; }
          .testimonials { padding: 60px 24px; }
          .reviews-grid { grid-template-columns: 1fr; }
          .founder { grid-template-columns: 1fr; }
          .founder-image { min-height: 280px; }
          .founder-text { padding: 60px 24px; }
          .about-cta { padding: 70px 24px; }
        }

        @media (max-width: 600px) {
          /* PERFORMANCE: Keep visuals, add GPU acceleration */
          .ebook-glow-layer {
            animation: ambientGlowMobile 55s ease-in-out infinite;
          }
          .ebook-glow-secondary {
            animation: ambientGlowMobile 60s ease-in-out infinite;
            animation-delay: 4s;
          }

          .pain-item {
            animation: fadeInUp 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .btn-primary, .btn-outline {
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .hero-text { padding: 48px 20px; }
          .hero-label { font-size: 9px; margin-bottom: 20px; }
          .hero-headline { font-size: clamp(28px, 9vw, 40px); line-height: 1.12; margin-bottom: 20px; }
          .hero-subtext { font-size: 13px; line-height: 1.7; margin-bottom: 32px; }
          .hero-btns { flex-direction: column; gap: 12px; }
          .btn-primary, .btn-outline { width: 100%; padding: 16px 24px; font-size: 10px; }
          .pain-section { padding: 48px 20px; }
          .section-label { font-size: 9px; margin-bottom: 24px; }
          .pain-headline { font-size: clamp(24px, 7vw, 34px); line-height: 1.2; margin-bottom: 36px; }
          .pain-item { font-size: 13px; padding: 20px 0; line-height: 1.7; }
          .built-for-section { padding: 48px 20px; gap: 32px; }
          .built-for-section .section-headline { font-size: clamp(24px, 7vw, 34px); }
          .service-grid { gap: 16px; }
          .service-item { padding: 28px 20px; }
          .service-name { font-size: 16px; }
          .ebook-feature { padding: 56px 20px; gap: 40px; }
          .ebook-glow-layer { width: 320px; height: 450px; filter: blur(50px); }
          .ebook-glow-secondary { width: 350px; height: 480px; filter: blur(65px); }
          .ebook-cover { max-width: 280px; box-shadow: 0 30px 60px -15px rgba(37, 18, 24, 0.18), 0 15px 30px -15px rgba(201, 150, 158, 0.22); }
          .ebook-content .section-label { font-size: 9px; margin-bottom: 16px; }
          .ebook-content .section-headline { font-size: clamp(26px, 7vw, 36px); line-height: 1.18; margin-bottom: 16px; }
          .section-body { font-size: 12.5px; line-height: 1.8; margin-bottom: 28px; }
          .ebook-price-wrap { gap: 12px; margin-bottom: 6px; }
          .price-sale { font-size: 46px; }
          .price-original { font-size: 18px; }
          .price-note { font-size: 9px; margin-bottom: 32px; }
          .cta-group { gap: 10px; margin-bottom: 20px; }
          .btn-primary, .btn-outline { padding: 15px 20px; font-size: 10px; }
          .cta-secondary { padding-top: 20px; }
          .chapters-section { padding: 56px 20px; }
          .chapters-header { margin-bottom: 48px; }
          .chapters-header .section-label { font-size: 9px; }
          .chapters-header .section-headline { font-size: clamp(24px, 7vw, 34px); }
          .chapter-item { padding: 32px 0; }
          .chapter-number { font-size: 9px; margin-bottom: 14px; }
          .chapter-title { font-size: clamp(18px, 5vw, 24px); margin-bottom: 10px; }
          .chapter-desc { font-size: 12.5px; line-height: 1.75; }
          .transformation-section { padding: 56px 20px; }
          .transformation-section .section-headline { font-size: clamp(24px, 7vw, 34px); }
          .transformation-grid { gap: 40px; }
          .transform-card { padding: 36px 28px; }
          .transform-label { font-size: 9px; margin-bottom: 16px; }
          .transform-title { font-size: 20px; margin-bottom: 14px; }
          .transform-desc { font-size: 12.5px; line-height: 1.75; }
          .testimonials { padding: 48px 20px; }
          .testimonials .section-headline { font-size: clamp(24px, 7vw, 34px); }
          .review-card { padding: 36px 28px; }
          .review-text { font-size: 14px; line-height: 1.7; margin-bottom: 24px; }
          .review-author { font-size: 12px; }
          .founder { min-height: auto; }
          .founder-image { min-height: 320px; }
          .founder-text { padding: 48px 20px; }
          .founder-text .section-label { font-size: 9px; }
          .founder-text .section-headline { font-size: clamp(22px, 6vw, 32px); }
          .founder-text .section-body { font-size: 12.5px; line-height: 1.8; }
          .about-cta { padding: 56px 20px; }
          .about-cta .section-headline { font-size: clamp(24px, 7vw, 34px); }
        }
      `}</style>

      <div className="services-page">
        <Navigation />

        {/* Marquee */}
        <div style={{ background: '#c9969e', padding: '9px 0' }}>
          <MarqueeScroll disableOnMobile={false} duration={180}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fdf5f7' }}>Building Beyond The Chair</span>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fdf5f7' }}>The Gold Standard</span>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fdf5f7' }}>Business Philosophy For Beauty Professionals</span>
          </MarqueeScroll>
        </div>

        {/* Hero */}
        <section className="hero-section">
          <div className="hero-text">
            <p className="hero-eyebrow">AVERRA Services</p>
            <h1 className="hero-headline">You built something real.<br/><em>It just wasn't built to last.</em></h1>
            <p className="hero-sub">
              You didn't get into this industry to feel trapped. <strong>But somewhere between the early mornings, the back-to-back clients, the DMs you answer on your day off, and the bookings that never seem to be enough, the business stopped feeling like freedom.</strong>
            </p>
            <div className="hero-btns">
              <button onClick={() => navigate("/quiz-intro")} className="btn-primary">
                Take The Quiz
              </button>
              <button onClick={handleDownloadEbook} className="btn-outline">
                Get The Gold Standard
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-inner">
              <div className="hero-monogram">A</div>
            </div>
            <div className="hero-badge">If this is your life right now, keep reading</div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="pain-section">
          <p className="section-label">Sound Familiar?</p>
          <h2 className="pain-headline">If you're being honest, you've probably said this before…</h2>
          <ul className="pain-list">
            <li className="pain-item lr">
              I'm fully booked and still scared to take a day off
            </li>
            <li className="pain-item lr">
              I'm tired of every dollar I make requiring me to show up for it
            </li>
            <li className="pain-item lr">
              I haven't rested, really rested, in who knows how long
            </li>
            <li className="pain-item lr">
              I'm posting, grinding, showing up and one wrong move feels like it could destroy everything
            </li>
            <li className="pain-item lr">
              I know I'm worth more, I just don't know how to stop hustling for it
            </li>
            <li className="pain-item lr">
              I can't remember the last time I fully stopped thinking about work
            </li>
          </ul>
        </section>

        {/* The Gold Standard - Premium Ebook Feature */}
        <section className="ebook-feature">
          <div className="ebook-visual">
            <div className="ebook-glow-layer ebook-glow"></div>
            <div className="ebook-glow-secondary"></div>
            <img
              src="/ebook-cover.svg"
              alt="The Gold Standard eBook Cover"
              className="ebook-cover ebook-float"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="ebook-content">
            <p className="section-label">Building Beyond The Chair</p>
            <h2 className="section-headline">The Gold<br/>Standard</h2>

            <p className="section-body lr">
              You already know how to work hard. That was never the problem.
            </p>

            <p className="section-body lr">
              The problem is that you built a business that only works if you never stop. Where being fully booked still feels unsafe. Where exhaustion became normal. Where rest feels financially dangerous. Where the business depends entirely on you showing up, no matter what.
            </p>

            <p className="section-body lr">
              <strong>This is not burnout. This is the structure itself.</strong>
            </p>

            <p className="section-body lr">
              Most beauty professionals never realize they built a labor model, not a business. One that rewards constant availability, punishes boundaries, and makes freedom financially impossible.
            </p>

            <p className="section-body lr" style={{ fontSize: '15px', color: '#251218', fontStyle: 'italic' }}>
              Building Beyond The Chair means creating a business that can eventually grow beyond nonstop appointments with systems, positioning, leverage, and income opportunities that no longer require your constant physical presence.
            </p>

            <p className="section-body pf" style={{ fontSize: '18px', color: '#c9969e', fontWeight: 500, fontStyle: 'italic' }}>
              The Gold Standard is the roadmap for building it.
            </p>

            <div className="ebook-price-wrap">
              <span className="price-sale">$97</span>
              <span className="price-original">$147</span>
            </div>
            <p className="price-note">Founder Pricing · Limited Time</p>

            <div className="cta-group">
              <button onClick={handleDownloadEbook} className="btn-primary" style={{ width: '100%' }}>
                Download The Gold Standard
              </button>
            </div>
          </div>
        </section>

        {/* Chapters Section */}
        <section className="chapters-section">
          <div className="chapters-header">
            <p className="section-label" style={{ textAlign: 'center' }}>What's Inside</p>
            <h2 className="section-headline pf" style={{ textAlign: 'center', fontSize: 'clamp(30px, 3.5vw, 48px)', margin: '0 auto 16px', maxWidth: '600px' }}>
              Nine Chapters
            </h2>
            <p className="section-body lr" style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
              The complete roadmap for understanding why the business feels this way and what it takes to build beyond it.
            </p>
          </div>

          <div className="chapters-list">
            <div className="chapter-item">
              <p className="chapter-number">Chapter One</p>
              <h3 className="chapter-title">The Addiction To Being Needed</h3>
              <p className="chapter-subtitle">Why your nervous system learned to depend on urgency</p>
            </div>

            <div className="chapter-item">
              <p className="chapter-number">Chapter Two</p>
              <h3 className="chapter-title">The Emotional Weight Nobody Sees</h3>
              <p className="chapter-subtitle">What it actually costs to care for people this way</p>
            </div>

            <div className="chapter-item">
              <p className="chapter-number">Chapter Three</p>
              <h3 className="chapter-title">Why The Business Still Feels Empty Even When You're Successful</h3>
              <p className="chapter-subtitle">The structural problem that your work ethic cannot solve</p>
            </div>

            <div className="chapter-item">
              <p className="chapter-number">Chapter Four</p>
              <h3 className="chapter-title">What Happens If Nothing Changes</h3>
              <p className="chapter-subtitle">The future that is already forming</p>
            </div>

            <div className="chapter-item">
              <p className="chapter-number">Chapter Five</p>
              <h3 className="chapter-title">The Fear Of Becoming Replaceable</h3>
              <p className="chapter-subtitle">What's really underneath the resistance to change</p>
            </div>

            <div className="chapter-item">
              <p className="chapter-number">Chapter Six</p>
              <h3 className="chapter-title">Who You Become If Nothing Changes And Who You Become If It Does</h3>
              <p className="chapter-subtitle">Two futures. One choice.</p>
            </div>

            <div className="chapter-item">
              <p className="chapter-number">Chapter Seven</p>
              <h3 className="chapter-title">Building Beyond The Chair</h3>
              <p className="chapter-subtitle">What your business can actually become</p>
            </div>

            <div className="chapter-item">
              <p className="chapter-number">Chapter Eight</p>
              <h3 className="chapter-title">The Businesses Clients Trust Most</h3>
              <p className="chapter-subtitle">The psychology of client perception and premium positioning</p>
            </div>

            <div className="chapter-item">
              <p className="chapter-number">Chapter Nine</p>
              <h3 className="chapter-title">Building The Business That Finally Sets You Free</h3>
              <p className="chapter-subtitle">The operational blueprint, step by step, season by season</p>
            </div>
          </div>
        </section>

        {/* Transformation Section */}
        <section className="transformation-section">
          <div className="transformation-header">
            <p className="section-label" style={{ textAlign: 'center' }}>Transformation</p>
            <h2 className="section-headline pf" style={{ color: '#fdf5f7', textAlign: 'center', fontSize: 'clamp(28px, 3.5vw, 46px)', margin: '0 auto', maxWidth: '640px' }}>
              What changes when you finally understand the structure
            </h2>
          </div>

          <div className="transformation-grid">
            <div>
              <p className="transform-col-title before-title">Before</p>
              <ul className="transform-list before-list">
                <li className="transform-item lr">Income disappears the moment you stop working</li>
                <li className="transform-item lr">Rest feels financially dangerous</li>
                <li className="transform-item lr">The business depends entirely on your physical availability</li>
                <li className="transform-item lr">Growth only creates more appointments</li>
                <li className="transform-item lr">Exhaustion becomes normalized as part of success</li>
              </ul>
            </div>

            <div>
              <p className="transform-col-title after-title">After</p>
              <ul className="transform-list after-list">
                <li className="transform-item lr">Income opportunities exist beyond constant appointments</li>
                <li className="transform-item lr">The business can eventually function with less emotional pressure</li>
                <li className="transform-item lr">Growth creates leverage instead of only creating more labor</li>
                <li className="transform-item lr">Systems replace dependency on nonstop availability</li>
                <li className="transform-item lr">Sustainability becomes the foundation instead of self-sacrifice</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Built For You Section */}
        <section className="built-for-section">
          <div>
            <p className="section-label">Built For You</p>
            <h2 className="section-headline pf">If your business depends on clients booking your time, this is for you.</h2>
            <p className="section-body">
              Whether you specialize in lashes, brows, nails, hair, facials, makeup, skincare, waxing, injections, or another beauty service entirely, eventually the pressure starts feeling the same.
            </p>
            <p className="section-body">
              The business depends on you showing up constantly. The schedule never fully stops. And no matter how booked you become, the pressure somehow still follows you home.
            </p>
            <p className="section-body" style={{ fontWeight: 600, color: '#251218' }}>
              AVERRA was built for beauty professionals who are tired of feeling like the business only works when they are constantly available to hold it together.
            </p>
          </div>
          <div className="for-grid">
            <div className="for-item">Lashes</div>
            <div className="for-item">Brows</div>
            <div className="for-item">Nails</div>
            <div className="for-item">Makeup</div>
            <div className="for-item">Hair</div>
            <div className="for-item">Facials</div>
            <div className="for-item">Skincare</div>
            <div className="for-item">Waxing</div>
            <div className="for-item">Injections</div>
            <div className="for-item">And more</div>
          </div>
        </section>

        {/* Client Reviews */}
        <section className="testimonials">
          <div className="testimonials-header">
            <p className="section-label" style={{ textAlign: 'center' }}>Client Results</p>
            <h2 className="section-headline pf" style={{ color: '#fdf5f7', textAlign: 'center', fontSize: 'clamp(28px, 3.5vw, 46px)', margin: '0 auto 16px', maxWidth: '700px' }}>
              These shifts happened when the business finally stopped depending on nonstop survival mode.
            </h2>
          </div>
          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-initial">J</div>
              <p className="review-text lr">
                "Before AVERRA, I thought being exhausted was just part of owning a beauty business. I was fully booked but still constantly anxious. The biggest shift wasn't just my pricing. It was finally realizing my business needed structure, not more hustle."
              </p>
              <p className="review-name">Jade M.</p>
              <p className="review-role">Lash Artist · AVERRA Client</p>
            </div>
            <div className="review-card">
              <div className="review-initial">C</div>
              <p className="review-text lr">
                "I was constantly posting, constantly working, constantly trying to keep momentum going. AVERRA helped me realize the problem wasn't my effort. My entire business was built around me never stopping. That changed everything."
              </p>
              <p className="review-name">Camille R.</p>
              <p className="review-role">Makeup Artist · AVERRA Client</p>
            </div>
            <div className="review-card">
              <div className="review-initial">K</div>
              <p className="review-text lr">
                "For the first time, I understood why rest made me feel guilty. My business had trained me to feel unsafe anytime things slowed down. AVERRA helped me start building something that finally felt sustainable instead of emotionally exhausting."
              </p>
              <p className="review-name">Kezia T.</p>
              <p className="review-role">Nail Artist · AVERRA Client</p>
            </div>
            <div className="review-card">
              <div className="review-initial">S</div>
              <p className="review-text lr">
                "I thought I needed more discipline. What I actually needed was a better structure. AVERRA helped me stop operating in constant reaction mode and finally start building with intention instead of survival."
              </p>
              <p className="review-name">Simone A.</p>
              <p className="review-role">Esthetician · AVERRA Client</p>
            </div>
            <div className="review-card">
              <div className="review-initial">B</div>
              <p className="review-text lr">
                "My business looked successful from the outside, but behind the scenes I was overwhelmed all the time. AVERRA helped me realize how much pressure I had normalized. Everything feels clearer now, including the direction I'm building toward."
              </p>
              <p className="review-name">Brianna H.</p>
              <p className="review-role">Hair Stylist · AVERRA Client</p>
            </div>
            <div className="review-card">
              <div className="review-initial">M</div>
              <p className="review-text lr">
                "I finally stopped feeling like every dollar depended on me physically running myself into the ground. That mindset shift alone changed how I approached my business completely."
              </p>
              <p className="review-name">Maya L.</p>
              <p className="review-role">Brow Artist · AVERRA Client</p>
            </div>
          </div>
        </section>

        {/* The System Behind AVERRA */}
        <section className="founder">
          <div className="founder-image">
            <div className="founder-monogram">A</div>
            <div className="founder-accent"></div>
          </div>
          <div className="founder-text">
            <p className="section-label">The System Behind AVERRA</p>
            <h2 className="section-headline pf">I have been exactly where you are.</h2>
            <p className="section-body">
              Building constantly. Posting constantly. Trying to stay visible. Trying to stay booked. Trying to keep momentum going while quietly feeling exhausted underneath all of it.
            </p>
            <p className="section-body">
              And for a long time, I thought the answer was just working harder.
            </p>
            <p className="section-body">
              What eventually changed everything was realizing the problem was not ambition, discipline, or talent. It was the structure the business was built on.
            </p>
            <p className="section-body">
              Most beauty professionals build businesses that depend entirely on constant availability to survive. More appointments become the solution to every problem, until eventually the business starts depending on exhaustion to keep growing.
            </p>
            <p className="section-body">
              AVERRA was built to help beauty professionals finally understand why the business feels this heavy and how to begin building differently.
            </p>
            <p className="section-body">
              Not through fake motivation. Not through hustle culture. Through structure, positioning, clarity, and building a business that can eventually grow beyond nonstop labor.
            </p>
            <p className="section-body" style={{ fontStyle: 'italic', color: '#251218', fontWeight: 600 }}>
              Real clarity. Real structure. Real sustainability.
            </p>
            <button onClick={handleDownloadEbook} className="btn-primary">
              Start The Process
            </button>
          </div>
        </section>

        {/* About CTA */}
        <section className="about-cta">
          <p className="section-label" style={{ textAlign: 'center' }}>The Philosophy Behind AVERRA</p>
          <h2 className="section-headline pf" style={{ textAlign: 'center', fontSize: 'clamp(30px, 3.5vw, 48px)', margin: '0 auto 16px', maxWidth: '600px' }}>
            Built for beauty professionals ready to grow beyond nonstop labor
          </h2>
          <p className="section-body" style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto 40px' }}>
            Learn more about why AVERRA was built and the approach behind helping beauty professionals create businesses that eventually support their lives instead of consuming them.
          </p>
          <button onClick={() => navigate("/about")} className="btn-primary">
            Learn More About AVERRA
          </button>
        </section>

        <CTAFooter />
      </div>
    </>
  );
}
