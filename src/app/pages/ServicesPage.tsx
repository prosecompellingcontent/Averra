import { useEffect, useMemo } from "react";
import { useCart } from "@/app/context/CartContext";

function ensureFontLink(id: string, href: string) {
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  type?: "service" | "digital";
  priceId?: string | null;
  productId?: string | null;
};

export function HomePage() {
  useEffect(() => {
    ensureFontLink(
      "averra-fonts",
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
    );
  }, []);

  const GET_STARTED = "https://averraaistudio.com/brand-intake";
  const ABOUT_PROCESS = "/about";

  const cart = useCart() as any;

  const addToCart = (item: CartItem) => {
    const payload: CartItem = { ...item, quantity: 1 };

    const fn =
      cart?.addItem ||
      cart?.addToCart ||
      cart?.addToCartItem ||
      cart?.add ||
      null;

    if (typeof fn === "function") {
      fn(payload);
      return;
    }

    console.error(
      "CartContext is missing an add method (expected addItem/addToCart/addToCartItem/add)."
    );
  };

  const products = useMemo(() => {
    const digital: CartItem[] = [
      {
        id: "digital-map-pack",
        name: "The Map Pack",
        price: 30,
        type: "digital",
        priceId: "price_1T6jvhKLeJj1g28UvIxFbI3O",
      },
      {
        id: "digital-base-bundle",
        name: "The Base Bundle",
        price: 30,
        type: "digital",
        priceId: "price_1T6jvrKLeJj1g28URaMIEaL3",
      },
      {
        id: "digital-cuticle-collection",
        name: "The Cuticle Collection",
        price: 30,
        type: "digital",
        priceId: "price_1T6jvyKLeJj1g28UVyqmrr5U",
      },
      {
        id: "digital-you-glow-girl",
        name: "You Glow Girl Bundle",
        price: 30,
        type: "digital",
        priceId: "price_1T6jw5KLeJj1g28UcpqJcnvL",
      },
      {
        id: "digital-fresh-out-the-chair",
        name: "Fresh Out The Chair",
        price: 30,
        type: "digital",
        priceId: "price_1TCQF9KLeJj1g28Ui7ESZUAF",
      },
      {
        id: "digital-lash-collection",
        name: "The Lash Collection",
        price: 30,
        type: "digital",
        priceId: "price_1TCQGHKLeJj1g28UJqHVf7wl",
      },
    ];

    const services: CartItem[] = [
      {
        id: "service-brand-perception-audit",
        name: "Brand Perception Audit",
        price: 75,
        type: "service",
        priceId: null,
        productId: "prod_U4tiz9ZLbviGbl",
      },
      {
        id: "service-brand-expansion-audit",
        name: "Brand Expansion Audit",
        price: 75,
        type: "service",
        priceId: null,
        productId: "prod_U4tiVhQytxMHG9",
      },
    ];

    return { digital, services };
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #fdf5f7;
          --dark: #251218;
          --accent: #c9969e;

          --warm-white: var(--bg);
          --cream: #fbf0f3;
          --charcoal: var(--dark);
          --muted: rgba(37, 18, 24, 0.62);
          --border: rgba(37, 18, 24, 0.12);
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Lora', serif;
          background: var(--warm-white);
          color: var(--charcoal);
          font-size: 15px;
          line-height: 1.7;
          overflow-x: hidden;
        }

        .announcement {
          background: var(--charcoal);
          color: rgba(253,245,247,0.88);
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 10px 20px;
          font-family: 'Montserrat', sans-serif;
        }

        nav {
          background: var(--warm-white);
          border-bottom: 0.5px solid var(--border);
          padding: 18px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--charcoal);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
          font-family: 'Montserrat', sans-serif;
        }

        .nav-links a {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-links a:hover { color: var(--charcoal); }

        .nav-cta {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: var(--charcoal);
          color: var(--warm-white);
          border: none;
          padding: 10px 24px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
          font-family: 'Montserrat', sans-serif;
        }

        .nav-cta:hover { background: rgba(37,18,24,0.9); }

        .ticker-wrap {
          background: var(--accent);
          overflow: hidden;
          white-space: nowrap;
          padding: 9px 0;
        }

        .ticker-inner {
          display: inline-flex;
          animation: ticker 30s linear infinite;
        }

        .ticker-item {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--warm-white);
          padding: 0 28px;
          font-family: 'Montserrat', sans-serif;
        }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 88vh;
        }

        .hero-text {
          padding: 80px 60px 80px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--warm-white);
        }

        .hero-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 24px;
          font-family: 'Montserrat', sans-serif;
        }

        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 68px);
          font-weight: 500;
          line-height: 1.08;
          color: var(--charcoal);
          margin-bottom: 12px;
        }

        .hero-headline em {
          font-style: italic;
          color: var(--accent);
        }

        .hero-sub {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.8;
          max-width: 460px;
          margin-bottom: 40px;
        }

        .hero-sub strong { color: var(--charcoal); font-weight: 600; }

        .hero-btns {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-family: 'Montserrat', sans-serif;
        }

        .btn-primary {
          background: var(--charcoal);
          color: var(--warm-white);
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 16px 36px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
        }

        .btn-primary:hover { background: rgba(37,18,24,0.9); }

        .btn-outline {
          background: transparent;
          color: var(--charcoal);
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 15px 36px;
          border: 1px solid var(--charcoal);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn-outline:hover { background: var(--charcoal); color: var(--warm-white); }

        .hero-image {
          position: relative;
          overflow: hidden;
          background: var(--cream);
        }

        .hero-image-inner {
          width: 100%;
          height: 100%;
          position: relative;
          background: var(--charcoal);
        }

        .hero-image-inner::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(37,18,24,0.2) 0%, rgba(37,18,24,0.72) 70%, rgba(37,18,24,0.84) 100%);
          pointer-events: none;
        }

        .hero-image-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .hero-badge {
          position: absolute;
          bottom: 40px;
          left: 40px;
          background: var(--accent);
          color: var(--warm-white);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 10px 20px;
          font-family: 'Montserrat', sans-serif;
          z-index: 2;
        }

        .pain {
          background: var(--charcoal);
          padding: 80px;
        }

        .pain-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 32px;
          font-family: 'Montserrat', sans-serif;
        }

        .pain-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3.5vw, 46px);
          font-weight: 500;
          color: var(--warm-white);
          line-height: 1.2;
          margin-bottom: 48px;
          max-width: 680px;
        }

        .pain-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-top: 0.5px solid rgba(253,245,247,0.14);
          font-family: 'Lora', serif;
        }

        .pain-item {
          padding: 24px 0;
          border-bottom: 0.5px solid rgba(253,245,247,0.14);
          font-size: 14px;
          color: rgba(253,245,247,0.78);
          line-height: 1.6;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .pain-item:nth-child(odd) { padding-right: 40px; border-right: 0.5px solid rgba(253,245,247,0.14); }
        .pain-item:nth-child(even) { padding-left: 40px; }

        .pain-bullet {
          color: var(--accent);
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .pain-cta {
          margin-top: 48px;
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          font-style: italic;
          color: rgba(201,150,158,0.95);
        }

        .for-section {
          padding: 80px;
          background: var(--cream);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 20px;
          font-family: 'Montserrat', sans-serif;
        }

        .section-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 3.5vw, 48px);
          font-weight: 500;
          line-height: 1.15;
          color: var(--charcoal);
          margin-bottom: 20px;
        }

        .section-body {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.85;
          margin-bottom: 32px;
        }

        .for-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }

        .for-item {
          background: var(--warm-white);
          padding: 18px 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal);
          border-left: 2px solid var(--accent);
          font-family: 'Montserrat', sans-serif;
        }

        .founder {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 60vh;
        }

        .founder-image {
          position: relative;
          overflow: hidden;
          min-height: 480px;
          background: var(--charcoal);
        }

        .founder-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(140deg, rgba(37,18,24,0.12) 0%, rgba(37,18,24,0.58) 60%, rgba(37,18,24,0.76) 100%);
          pointer-events: none;
        }

        .founder-image-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .founder-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--accent);
          z-index: 2;
        }

        .founder-text {
          padding: 80px;
          background: var(--warm-white);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .pillars {
          padding: 100px 80px;
          background: var(--warm-white);
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          margin-top: 64px;
        }

        .pillar {
          background: var(--cream);
          padding: 36px 28px;
        }

        .pillar-num {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 500;
          color: rgba(201,150,158,0.22);
          line-height: 1;
          margin-bottom: 12px;
        }

        .pillar-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal);
          margin-bottom: 10px;
          font-family: 'Montserrat', sans-serif;
        }

        .pillar-body {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.8;
          font-family: 'Lora', serif;
        }

        .system {
          padding: 100px 80px;
          background: var(--warm-white);
        }

        .system-header {
          text-align: center;
          margin-bottom: 72px;
        }

        .system-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }

        .step-card {
          background: var(--cream);
          padding: 48px 36px;
          position: relative;
        }

        .step-number {
          font-family: 'Playfair Display', serif;
          font-size: 72px;
          font-weight: 500;
          color: rgba(201,150,158,0.22);
          line-height: 1;
          margin-bottom: 8px;
        }

        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: var(--charcoal);
          margin-bottom: 6px;
        }

        .step-sub {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
          font-family: 'Montserrat', sans-serif;
        }

        .step-body {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.8;
        }

        .results-marquee {
          background: var(--accent);
          padding: 18px 0;
          overflow: hidden;
          white-space: nowrap;
        }

        .results-inner {
          display: inline-flex;
          animation: ticker 20s linear infinite;
        }

        .result-item {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-style: italic;
          color: var(--warm-white);
          padding: 0 48px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .result-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          flex-shrink: 0;
        }

        .testimonials {
          background: var(--charcoal);
          padding: 100px 80px;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .testimonials-header .section-headline {
          color: var(--warm-white);
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }

        .review-card {
          background: rgba(253,245,247,0.05);
          padding: 36px 30px;
          border-top: 2px solid var(--accent);
        }

        .review-text {
          font-size: 13px;
          color: rgba(253,245,247,0.82);
          line-height: 1.85;
          margin-bottom: 24px;
          font-style: italic;
          font-family: 'Lora', serif;
        }

        .review-name {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(201,150,158,0.95);
          font-family: 'Montserrat', sans-serif;
        }

        .review-role {
          font-size: 11px;
          color: rgba(253,245,247,0.45);
          margin-top: 2px;
          font-family: 'Montserrat', sans-serif;
        }

        .review-initial {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--warm-white);
          margin-bottom: 18px;
          font-family: 'Montserrat', sans-serif;
        }

        .services {
          padding: 100px 80px;
          background: var(--cream);
        }

        .services-header {
          text-align: center;
          margin-bottom: 72px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }

        .product-card {
          background: var(--warm-white);
          padding: 36px 30px;
          position: relative;
          transition: transform 0.2s;
        }

        .product-card:hover { transform: translateY(-4px); }

        .product-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 12px;
          font-family: 'Montserrat', sans-serif;
        }

        .product-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: var(--charcoal);
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .product-desc {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 24px;
        }

        .product-pricing {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 20px;
          font-family: 'Montserrat', sans-serif;
        }

        .price-sale {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: var(--charcoal);
        }

        .price-original {
          font-size: 14px;
          color: var(--muted);
          text-decoration: line-through;
        }

        .product-includes {
          list-style: none;
          margin-bottom: 28px;
          font-family: 'Montserrat', sans-serif;
        }

        .product-includes li {
          font-size: 11px;
          color: var(--muted);
          padding: 6px 0;
          border-bottom: 0.5px solid var(--border);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .product-includes li::before {
          content: '';
          width: 4px;
          height: 4px;
          background: var(--accent);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .btn-add {
          width: 100%;
          background: var(--charcoal);
          color: var(--warm-white);
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 14px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: block;
          text-align: center;
          transition: background 0.2s;
        }

        .btn-add:hover { background: rgba(37,18,24,0.9); }

        .flagship {
          padding: 120px 80px;
          background: var(--charcoal);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .flagship-left .section-headline { color: var(--warm-white); }
        .flagship-left .section-label { color: var(--accent); }
        .flagship-left .section-body { color: rgba(253,245,247,0.68); }

        .flagship-price {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          font-weight: 500;
          color: rgba(201,150,158,0.95);
          line-height: 1;
          margin-bottom: 8px;
        }

        .flagship-price-note {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(253,245,247,0.45);
          margin-bottom: 36px;
          font-family: 'Montserrat', sans-serif;
        }

        .flagship-modules {
          list-style: none;
          border-top: 0.5px solid rgba(253,245,247,0.14);
          font-family: 'Lora', serif;
        }

        .flagship-module {
          padding: 16px 0;
          border-bottom: 0.5px solid rgba(253,245,247,0.14);
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .module-num {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: var(--accent);
          flex-shrink: 0;
          width: 28px;
        }

        .module-text {
          font-size: 12px;
          color: rgba(253,245,247,0.78);
          line-height: 1.7;
        }

        .module-text strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--warm-white);
          margin-bottom: 2px;
          font-family: 'Montserrat', sans-serif;
        }

        .quiz-cta {
          padding: 100px 80px;
          background: rgba(201,150,158,0.22);
          text-align: center;
        }

        .quiz-cta .section-headline {
          max-width: 600px;
          margin: 0 auto 12px;
        }

        .quiz-cta .section-body {
          max-width: 480px;
          margin: 0 auto 40px;
        }

        footer {
          background: var(--charcoal);
          padding: 60px 80px 40px;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
          padding-bottom: 60px;
          border-bottom: 0.5px solid rgba(253,245,247,0.12);
        }

        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(253,245,247,0.9);
          margin-bottom: 12px;
        }

        .footer-tagline {
          font-size: 11px;
          color: rgba(253,245,247,0.5);
          line-height: 1.7;
          font-family: 'Montserrat', sans-serif;
        }

        .footer-col-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(253,245,247,0.45);
          margin-bottom: 20px;
          font-family: 'Montserrat', sans-serif;
        }

        .footer-links { list-style: none; }
        .footer-links li { margin-bottom: 10px; }

        .footer-links a {
          font-size: 12px;
          color: rgba(253,245,247,0.65);
          text-decoration: none;
          transition: color 0.2s;
          font-family: 'Montserrat', sans-serif;
        }

        .footer-links a:hover { color: rgba(201,150,158,0.95); }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(253,245,247,0.4);
          font-family: 'Montserrat', sans-serif;
        }

        @media (max-width: 900px) {
          nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .hero { grid-template-columns: 1fr; }
          .hero-image { display: none; }
          .hero-text { padding: 60px 24px; }
          .pain { padding: 60px 24px; }
          .pain-list { grid-template-columns: 1fr; }
          .pain-item:nth-child(odd) { padding-right: 0; border-right: none; }
          .pain-item:nth-child(even) { padding-left: 0; }
          .for-section { grid-template-columns: 1fr; gap: 40px; padding: 60px 24px; }
          .founder { grid-template-columns: 1fr; }
          .founder-image { min-height: 260px; }
          .founder-text { padding: 60px 24px; }
          .pillars { padding: 60px 24px; }
          .pillars-grid { grid-template-columns: 1fr 1fr; }
          .system { padding: 60px 24px; }
          .system-steps { grid-template-columns: 1fr; gap: 2px; }
          .testimonials { padding: 60px 24px; }
          .reviews-grid { grid-template-columns: 1fr; }
          .services { padding: 60px 24px; }
          .products-grid { grid-template-columns: 1fr; }
          .flagship { grid-template-columns: 1fr; gap: 48px; padding: 60px 24px; }
          .quiz-cta { padding: 60px 24px; }
          footer { padding: 60px 24px 40px; }
          .footer-top { grid-template-columns: 1fr; gap: 40px; }
          .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="announcement">
        Founding Member Pricing · Limited Time Only · Up to 50% Off · Availability Is Closing
      </div>

      <nav>
        <a href="/" className="nav-logo">
          Averra
        </a>

        <ul className="nav-links">
          <li>
            <a href={ABOUT_PROCESS}>The Process</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#digitals">Digital Products</a>
          </li>
          <li>
            <a href="#flagship">Brand Alignment</a>
          </li>
        </ul>

        <a href={GET_STARTED} className="nav-cta">
          Get Started
        </a>
      </nav>

      <div className="ticker-wrap">
        <div className="ticker-inner">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="ticker-item">
              Founding Members Only · Launch Pricing Up To 50% Off · Limited Time Only ·
            </span>
          ))}
        </div>
      </div>

      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Brand Alignment System</p>

          <h1 className="hero-headline">
            Your brand should pull its weight
            <br />
            <em>the same way you do.</em>
          </h1>

          <p className="hero-sub">
            Talent is everywhere. What's rare is a presence built on{" "}
            <strong>clear direction.</strong>
            <br />
            <br />
            If your brand isn't communicating your level at first glance, clients pause, pricing gets questioned,
            and your work blends into a crowded market.
          </p>

          <div className="hero-btns">
            <a href={GET_STARTED} className="btn-primary">
              Get Started
            </a>
            <a href={ABOUT_PROCESS} className="btn-outline">
              The Process
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-inner">
            <img
              src="/services-hero.png"
              alt="AVERRA Services Hero"
              className="hero-image-img"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="hero-badge">Clarity Through Alignment</div>
        </div>
      </section>

      <section className="pain">
        <p className="pain-label">Sound Familiar?</p>

        <h2 className="pain-headline">
          If you're being real, you've probably thought something like this…
        </h2>

        <ul className="pain-list">
          <li className="pain-item">
            <span className="pain-bullet">•</span>
            "I'm showing up consistently but bookings aren't moving"
          </li>
          <li className="pain-item">
            <span className="pain-bullet">•</span>
            "My content gets attention, but not appointments"
          </li>
          <li className="pain-item">
            <span className="pain-bullet">•</span>
            "I keep adjusting prices just to stay full"
          </li>
          <li className="pain-item">
            <span className="pain-bullet">•</span>
            "My visuals don't match the standard of my work"
          </li>
          <li className="pain-item">
            <span className="pain-bullet">•</span>
            "Other pros are booked out. I don't get it"
          </li>
          <li className="pain-item">
            <span className="pain-bullet">•</span>
            "I can't get my brand to read premium"
          </li>
        </ul>

        <p className="pain-cta">
          The AVERRA Brand Alignment System exists to correct exactly this.
        </p>
      </section>

      <section className="for-section">
        <div>
          <p className="section-label">Built For You</p>

          <h2 className="section-headline">
            If clients book you, your brand is part of the service.
          </h2>

          <p className="section-body">
            Lashes, brows, nails, hair, facials, makeup, skincare, waxing, injections. If you rely on clients selecting you,
            your visual identity is doing more work than you think. Perception, pricing, loyalty, and growth start
            before the first message.
          </p>

          <p className="section-body">
            If you're a beauty provider building toward a higher level, this system applies.
          </p>
        </div>

        <div className="for-grid">
          {[
            "Lashes",
            "Brows",
            "Nails",
            "Makeup",
            "Hair",
            "Facials",
            "Skincare",
            "Waxing",
            "Injections",
            "And more",
          ].map((x) => (
            <div key={x} className="for-item">
              {x}
            </div>
          ))}
        </div>
      </section>

      <section className="founder">
        <div className="founder-image">
          <img
            src="/meet-the-ceo-2.png"
            alt="The System Behind AVERRA"
            className="founder-image-img"
            loading="lazy"
            decoding="async"
          />
          <div className="founder-accent" />
        </div>

        <div className="founder-text">
          <p className="section-label">The System Behind AVERRA</p>

          <h2 className="section-headline">Built from lived experience.</h2>

          <p className="section-body">
            I've been in the stage where you're doing strong work, posting often, and still watching clients choose
            someone else, not because your skill wasn't there, but because your brand wasn't translating it.
          </p>

          <p className="section-body">
            Once I stopped guessing and built a clear system, the brand became consistent, pricing made sense, and
            the right clients found it naturally. AVERRA packages that into a structured process you can apply
            without drifting.
          </p>

          <p className="section-body" style={{ fontStyle: "italic", color: "#251218" }}>
            Clear direction. Aligned presence. Results that hold.
          </p>

          <a href={GET_STARTED} className="btn-primary">
            Start The Process
          </a>
        </div>
      </section>

      <section className="pillars" id="system">
        <div style={{ textAlign: "center" }}>
          <p className="section-label" style={{ display: "block" }}>
            The Industry Standard
          </p>

          <h2 className="section-headline" style={{ maxWidth: 600, margin: "0 auto 16px" }}>
            When any of these drift,
            <br />
            your value gets diluted.
          </h2>

          <p className="section-body" style={{ maxWidth: 520, margin: "0 auto" }}>
            The system is built around four core signals. If one is misaligned, the entire brand reads lower,
            even when the work is excellent.
          </p>
        </div>

        <div className="pillars-grid">
          {[
            {
              num: "01",
              title: "Perception",
              body: "What your brand communicates in the first two seconds before anyone reads a caption.",
            },
            {
              num: "02",
              title: "Translation",
              body: "How clearly your value comes through, whether clients get it immediately or keep scrolling.",
            },
            {
              num: "03",
              title: "Visual Clarity",
              body: "Whether your visuals agree with each other, or send mixed signals about level and pricing.",
            },
            {
              num: "04",
              title: "Consistency",
              body: "How reliably your brand holds its standard, even as you grow, post more, and evolve.",
            },
          ].map((p) => (
            <div key={p.num} className="pillar">
              <div className="pillar-num">{p.num}</div>
              <div className="pillar-title">{p.title}</div>
              <p className="pillar-body">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="system" style={{ background: "var(--cream)" }}>
        <div className="system-header">
          <p className="section-label" style={{ display: "block" }}>
            The System
          </p>

          <h2 className="section-headline">Three Stage Process</h2>

          <p className="section-body" style={{ maxWidth: 480, margin: "0 auto" }}>
            Everything you publish should read clearly. The AVERRA process keeps the message consistent.
          </p>
        </div>

        <div className="system-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <p className="step-sub">Stage One</p>
            <h3 className="step-title">Interpretation</h3>
            <p className="step-body">
              We define your identity and intention first, so what you create has a clear direction, not a vibe
              you're trying to keep up with.
            </p>
          </div>

          <div className="step-card" style={{ background: "var(--charcoal)" }}>
            <div className="step-number" style={{ color: "rgba(201,150,158,0.25)" }}>
              2
            </div>
            <p className="step-sub" style={{ color: "rgba(253,245,247,0.85)" }}>
              Stage Two
            </p>
            <h3 className="step-title" style={{ color: "var(--warm-white)" }}>
              Alignment
            </h3>
            <p className="step-body" style={{ color: "rgba(253,245,247,0.70)" }}>
              We correct the mixed signals across your visuals so the brand reads as one standard across every touch
              point.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <p className="step-sub">Stage Three</p>
            <h3 className="step-title">Stabilization</h3>
            <p className="step-body">
              We build a structured system so your brand stays consistent as you grow. No drift, no guesswork, no
              starting over.
            </p>
          </div>
        </div>
      </section>

      <div className="results-marquee">
        <div className="results-inner">
          {Array.from({ length: 2 }).flatMap((_, i) => [
            <span key={`r-${i}-1`} className="result-item">
              Clarity that converts<span className="result-dot" />
            </span>,
            <span key={`r-${i}-2`} className="result-item">
              Brands that hold their standard<span className="result-dot" />
            </span>,
            <span key={`r-${i}-3`} className="result-item">
              Visuals that match the level of the work<span className="result-dot" />
            </span>,
            <span key={`r-${i}-4`} className="result-item">
              Identity that scales<span className="result-dot" />
            </span>,
          ])}
        </div>
      </div>

      <section className="testimonials">
        <div className="testimonials-header">
          <p className="section-label" style={{ display: "block", textAlign: "center" }}>
            Client Results
          </p>

          <h2
            className="section-headline"
            style={{ color: "var(--warm-white)", textAlign: "center", maxWidth: 560, margin: "0 auto" }}
          >
            These shifts aren't luck. They're what happens when the brand reads clearly.
          </h2>
        </div>

        <div className="reviews-grid">
          {[
            {
              initial: "J",
              text:
                "“After the alignment work, I raised my prices and bookings didn’t drop. They improved. People came in already understanding the value.”",
              name: "Jade M.",
              role: "Lash Artist · AVERRA Client",
            },
            {
              initial: "C",
              text:
                "“My work was strong, but my feed didn’t show it. Once my brand was aligned, clients started calling it luxury and booking like it.”",
              name: "Camille R.",
              role: "Makeup Artist · AVERRA Client",
            },
            {
              initial: "K",
              text:
                "“The Brand Perception Audit showed exactly where my visuals were undercutting pricing. Fixing it changed the conversations immediately.”",
              name: "Kezia T.",
              role: "Nail Artist · AVERRA Client",
            },
            {
              initial: "S",
              text:
                "“I finally got a system. Every post feels like the same brand now. That consistency changed loyalty and how clients talk about me.”",
              name: "Simone A.",
              role: "Esthetician · AVERRA Client",
            },
            {
              initial: "B",
              text:
                "“I stopped blending in. My brand reads elevated, and now people tag me as the standard in my city.”",
              name: "Brianna H.",
              role: "Hair Stylist · AVERRA Client",
            },
            {
              initial: "M",
              text:
                "“The Brand Expansion Audit helped me scale without my brand cracking. Everything stayed aligned as I grew.”",
              name: "Maya L.",
              role: "Brow Artist · AVERRA Client",
            },
          ].map((r) => (
            <div key={r.name} className="review-card">
              <div className="review-initial">{r.initial}</div>
              <p className="review-text">{r.text}</p>
              <p className="review-name">{r.name}</p>
              <p className="review-role">{r.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="services" id="services">
        <div className="services-header">
          <p className="section-label" style={{ display: "block" }}>
            Add On Services
          </p>

          <h2 className="section-headline">Focused Brand Audits</h2>

          <p className="section-body" style={{ maxWidth: 520, margin: "0 auto" }}>
            Targeted evaluations for specific brand problems, standalone or layered into your larger alignment work.
          </p>
        </div>

        <div className="products-grid" style={{ gridTemplateColumns: "1fr 1fr", maxWidth: 860, margin: "0 auto" }}>
          {products.services.map((p) => (
            <div key={p.id} className="product-card">
              <p className="product-label">Brand Audit</p>
              <h3 className="product-name">{p.name}</h3>

              <p className="product-desc">
                {p.name === "Brand Perception Audit"
                  ? "A focused review of how your brand reads right now and where it's quietly lowering perceived value."
                  : "A focused consult on scaling your brand without losing consistency or diluting your identity as you grow."}
              </p>

              <div className="product-pricing">
                <span className="price-sale">$75</span>
                <span className="price-original">$100</span>
              </div>

              <ul className="product-includes">
                {p.name === "Brand Perception Audit" ? (
                  <>
                    <li>First glance value signals</li>
                    <li>Consistency and clarity review</li>
                    <li>What your visuals imply</li>
                    <li>Direct fixes to apply</li>
                  </>
                ) : (
                  <>
                    <li>Where drift shows up as you scale</li>
                    <li>What to standardize now</li>
                    <li>How to keep the brand controlled</li>
                    <li>A system that holds under growth</li>
                  </>
                )}
              </ul>

              <button
                type="button"
                className="btn-add"
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="services" id="digitals" style={{ background: "var(--warm-white)" }}>
        <div className="services-header">
          <p className="section-label" style={{ display: "block" }}>
            Digital Products
          </p>

          <h2 className="section-headline">Brand Ready Visuals</h2>

          <p className="section-body" style={{ maxWidth: 520, margin: "0 auto" }}>
            Instant access. No revisions. Ready to post. (Commercial use included.)
          </p>
        </div>

        <div className="products-grid">
          {products.digital.map((p) => (
            <div key={p.id} className="product-card">
              <p className="product-label">Digital Pack</p>
              <h3 className="product-name">{p.name}</h3>

              <p className="product-desc">
                {p.name === "The Lash Collection"
                  ? "Three lash focused visuals built for promos, reminders, and retention content."
                  : p.name === "The Map Pack"
                  ? "Three brow visuals designed for mapping, structure, and precision forward promos."
                  : p.name === "The Base Bundle"
                  ? "Three elevated makeup visuals made for launches, promos, and polished brand presence."
                  : p.name === "Fresh Out The Chair"
                  ? "Three hair visuals showcasing shine, detail, and the finished result clients book for."
                  : p.name === "The Cuticle Collection"
                  ? "Three manicure visuals highlighting structure, clean detail, and luxury level finish."
                  : "Three esthetic visuals designed for facials, promos, memberships, and skincare features."}
              </p>

              <div className="product-pricing">
                <span className="price-sale">$30</span>
                <span className="price-original">$50</span>
              </div>

              <ul className="product-includes">
                <li>3 high resolution visuals</li>
                <li>Commercial use license</li>
                <li>Instant download</li>
                <li>No edits or customization</li>
              </ul>

              <button
                type="button"
                className="btn-add"
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "var(--muted)",
            marginTop: 40,
            letterSpacing: "0.06em",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          All digital products include commercial use rights · Files delivered instantly after purchase · No edits, swaps,
          or personalization included
        </p>
      </section>

      <section className="flagship" id="flagship">
        <div className="flagship-left">
          <p className="section-label">The Complete System</p>

          <h2 className="section-headline">AVERRA Brand Alignment</h2>

          <p className="section-body">
            A full alignment system built to make your brand read at the level you're operating, so the right clients
            recognize it, trust it, and pay accordingly.
          </p>

          <div className="flagship-price">$250</div>
          <p className="flagship-price-note">Founding Member Pricing · Was $500</p>

          <a href={GET_STARTED} className="btn-primary" style={{ display: "inline-block" }}>
            Get Started
          </a>
        </div>

        <div>
          <ul className="flagship-modules">
            <li className="flagship-module">
              <span className="module-num">01</span>
              <div className="module-text">
                <strong>Interpretation · Brand Direction</strong>
                We set the intention and identity first so your presence stays clear across everything you publish.
              </div>
            </li>
            <li className="flagship-module">
              <span className="module-num">02</span>
              <div className="module-text">
                <strong>Perception · First Glance Audit</strong>
                We identify and correct the visual cues that signal a lower level than the work deserves.
              </div>
            </li>
            <li className="flagship-module">
              <span className="module-num">03</span>
              <div className="module-text">
                <strong>Translation · Message Clarity</strong>
                We sharpen what's being communicated so clients don't hesitate. They understand and book.
              </div>
            </li>
            <li className="flagship-module">
              <span className="module-num">04</span>
              <div className="module-text">
                <strong>Alignment · Visual Unification</strong>
                We remove mixed signals and ensure every element supports the same level.
              </div>
            </li>
            <li className="flagship-module">
              <span className="module-num">05</span>
              <div className="module-text">
                <strong>Stabilization · Custom Visual System</strong>
                We build the structure that keeps you consistent as you scale, without relying on motivation.
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="quiz-cta">
        <p className="section-label" style={{ display: "block" }}>
          Exclusive Offer · Limited Time
        </p>

        <h2 className="section-headline">Want to see how your brand reads right now?</h2>

        <p className="section-body">
          Take the brand quiz to get your style direction and next steps in minutes.
        </p>

        <a href="#" className="btn-primary">
          Start Brand Quiz
        </a>
      </section>

      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-logo">Averra</div>
            <p className="footer-tagline">
              Clarity Through Alignment.
              <br />
              A brand system for beauty professionals building toward a higher standard.
            </p>
          </div>

          <div>
            <p className="footer-col-title">Navigation</p>
            <ul className="footer-links">
              <li>
                <a href={ABOUT_PROCESS}>The Process</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#digitals">Digital Products</a>
              </li>
              <li>
                <a href="#flagship">Brand Alignment</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Policies</p>
            <ul className="footer-links">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Refund Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 AVERRA. All rights reserved.</span>
          <span>Clarity Through Alignment</span>
        </div>
      </footer>
    </>
  );
}
