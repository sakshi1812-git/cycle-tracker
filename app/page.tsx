"use client";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const parallaxX = (mousePos.x - (typeof window !== "undefined" ? window.innerWidth / 2 : 0)) / 60;
  const parallaxY = (mousePos.y - (typeof window !== "undefined" ? window.innerHeight / 2 : 0)) / 60;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --rose: #e8627a;
          --rose-light: #f5a0b0;
          --rose-pale: #fdf0f2;
          --plum: #7c3d6b;
          --plum-light: #b87aad;
          --cream: #fef9f5;
          --charcoal: #1e1a1d;
          --warm-gray: #8a7f86;
          --gold: #d4a853;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--charcoal);
          overflow-x: hidden;
          cursor: none;
        }

        .cursor {
          position: fixed;
          width: 12px;
          height: 12px;
          background: var(--rose);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease;
          mix-blend-mode: multiply;
        }

        .cursor-ring {
          position: fixed;
          width: 40px;
          height: 40px;
          border: 1.5px solid var(--rose-light);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: all 0.15s ease;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 24px 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(254, 249, 245, 0.85);
          border-bottom: 1px solid rgba(232, 98, 122, 0.1);
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--charcoal);
          letter-spacing: 0.02em;
          text-decoration: none;
        }

        .nav-logo span { color: var(--rose); }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 40px;
          list-style: none;
        }

        .nav-links a {
          font-size: 13px;
          font-weight: 400;
          color: var(--warm-gray);
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        .nav-links a:hover { color: var(--rose); }

        .nav-cta {
          background: var(--charcoal);
          color: var(--cream) !important;
          padding: 12px 28px !important;
          border-radius: 100px;
          transition: all 0.3s ease !important;
        }

        .nav-cta:hover {
          background: var(--rose) !important;
          color: white !important;
          transform: translateY(-1px);
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 60px 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(232, 98, 122, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 20% 70%, rgba(124, 61, 107, 0.06) 0%, transparent 70%);
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(232, 98, 122, 0.15), transparent);
          top: -100px;
          right: -100px;
          animation: float1 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(124, 61, 107, 0.12), transparent);
          bottom: -50px;
          left: 200px;
          animation: float2 10s ease-in-out infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.05); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(0.95); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 32px;
          padding: 8px 16px;
          background: rgba(232, 98, 122, 0.08);
          border-radius: 100px;
          border: 1px solid rgba(232, 98, 122, 0.2);
          animation: fadeUp 0.8s ease forwards;
          opacity: 0;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          background: var(--rose);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(56px, 7vw, 96px);
          font-weight: 300;
          line-height: 1.0;
          color: var(--charcoal);
          margin-bottom: 28px;
          animation: fadeUp 0.8s ease 0.15s forwards;
          opacity: 0;
        }

        .hero-title em {
          font-style: italic;
          color: var(--rose);
        }

        .hero-title .outline {
          -webkit-text-stroke: 1.5px var(--charcoal);
          color: transparent;
        }

        .hero-subtitle {
          font-size: 17px;
          font-weight: 300;
          line-height: 1.8;
          color: var(--warm-gray);
          max-width: 480px;
          margin-bottom: 48px;
          animation: fadeUp 0.8s ease 0.3s forwards;
          opacity: 0;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          animation: fadeUp 0.8s ease 0.45s forwards;
          opacity: 0;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--rose);
          color: white;
          padding: 18px 40px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 32px rgba(232, 98, 122, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 16px 48px rgba(232, 98, 122, 0.4);
          background: #d4536c;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--charcoal);
          font-size: 14px;
          font-weight: 400;
          text-decoration: none;
          padding: 18px 24px;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
        }

        .btn-ghost:hover { color: var(--rose); gap: 14px; }

        .btn-arrow {
          width: 20px;
          height: 20px;
          border: 1.5px solid currentColor;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          transition: transform 0.3s ease;
        }

        .btn-ghost:hover .btn-arrow { transform: translateX(3px); }

        /* HERO VISUAL */
        .hero-visual {
          position: absolute;
          right: 60px;
          top: 50%;
          transform: translateY(-50%);
          width: 480px;
          animation: fadeIn 1.2s ease 0.5s forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-50%) translateX(30px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }

        .phone-mockup {
          width: 260px;
          height: 520px;
          background: white;
          border-radius: 40px;
          box-shadow:
            0 40px 80px rgba(30, 26, 29, 0.12),
            0 0 0 8px rgba(30, 26, 29, 0.04),
            inset 0 0 0 1px rgba(255, 255, 255, 0.8);
          overflow: hidden;
          position: relative;
          margin: 0 auto;
        }

        .phone-notch {
          width: 100px;
          height: 28px;
          background: var(--charcoal);
          border-radius: 0 0 20px 20px;
          margin: 0 auto 16px;
        }

        .phone-screen {
          padding: 0 20px;
        }

        .phone-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .phone-header h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: var(--charcoal);
          font-weight: 600;
        }

        .phone-header p {
          font-size: 11px;
          color: var(--warm-gray);
          margin-top: 2px;
        }

        .cycle-ring {
          width: 140px;
          height: 140px;
          margin: 0 auto 20px;
          position: relative;
        }

        .cycle-ring svg {
          transform: rotate(-90deg);
        }

        .cycle-ring-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .cycle-ring-text .day-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 600;
          color: var(--charcoal);
          line-height: 1;
        }

        .cycle-ring-text .day-label {
          font-size: 10px;
          color: var(--warm-gray);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .mini-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }

        .mini-card {
          background: var(--rose-pale);
          border-radius: 16px;
          padding: 12px;
        }

        .mini-card-icon { font-size: 18px; margin-bottom: 4px; }

        .mini-card-label {
          font-size: 9px;
          color: var(--warm-gray);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .mini-card-value {
          font-size: 13px;
          font-weight: 500;
          color: var(--charcoal);
          margin-top: 2px;
        }

        .symptom-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag {
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 100px;
          background: rgba(232, 98, 122, 0.1);
          color: var(--rose);
          font-weight: 500;
        }

        /* FLOATING CARDS */
        .floating-card {
          position: absolute;
          background: white;
          border-radius: 20px;
          padding: 16px 20px;
          box-shadow: 0 20px 60px rgba(30, 26, 29, 0.1);
          border: 1px solid rgba(232, 98, 122, 0.1);
        }

        .float-card-1 {
          top: 60px;
          right: -20px;
          animation: floatCard1 4s ease-in-out infinite;
        }

        .float-card-2 {
          bottom: 100px;
          left: -30px;
          animation: floatCard2 5s ease-in-out infinite 1s;
        }

        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(10px) rotate(-3deg); }
        }

        .float-card-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .float-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .float-icon-rose { background: rgba(232, 98, 122, 0.1); }
        .float-icon-purple { background: rgba(124, 61, 107, 0.1); }

        .float-text-label {
          font-size: 10px;
          color: var(--warm-gray);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .float-text-value {
          font-size: 14px;
          font-weight: 500;
          color: var(--charcoal);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* STATS STRIP */
        .stats-strip {
          padding: 60px;
          background: var(--charcoal);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }

        .stat-item {
          padding: 40px;
          border-right: 1px solid rgba(255,255,255,0.08);
          text-align: center;
          transition: background 0.3s ease;
        }

        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(255,255,255,0.03); }

        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 56px;
          font-weight: 300;
          color: white;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-num span { color: var(--rose); }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* FEATURES */
        .features {
          padding: 120px 60px;
          position: relative;
        }

        .section-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 300;
          color: var(--charcoal);
          margin-bottom: 16px;
          line-height: 1.1;
        }

        .section-title em { font-style: italic; color: var(--rose); }

        .section-sub {
          font-size: 16px;
          color: var(--warm-gray);
          font-weight: 300;
          max-width: 480px;
          line-height: 1.7;
          margin-bottom: 72px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: rgba(30, 26, 29, 0.06);
          border-radius: 24px;
          overflow: hidden;
        }

        .feature-card {
          background: var(--cream);
          padding: 48px 40px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(232, 98, 122, 0.04), rgba(124, 61, 107, 0.04));
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .feature-card:hover { transform: scale(1.01); z-index: 2; }
        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(232, 98, 122, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 24px;
          transition: transform 0.3s ease;
        }

        .feature-card:hover .feature-icon { transform: scale(1.1) rotate(-5deg); }

        .feature-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 14px;
          color: var(--warm-gray);
          line-height: 1.7;
          font-weight: 300;
        }

        /* TESTIMONIAL / QUOTE SECTION */
        .quote-section {
          padding: 120px 60px;
          background: linear-gradient(135deg, rgba(232, 98, 122, 0.05), rgba(124, 61, 107, 0.05));
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 200px;
          color: rgba(232, 98, 122, 0.08);
          line-height: 0.8;
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          user-select: none;
        }

        .quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 300;
          font-style: italic;
          color: var(--charcoal);
          max-width: 800px;
          margin: 0 auto 40px;
          line-height: 1.4;
          position: relative;
          z-index: 1;
        }

        .quote-text em { color: var(--rose); font-style: normal; }

        /* HOW IT WORKS */
        .how-section {
          padding: 120px 60px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          margin-top: 72px;
          position: relative;
        }

        .steps-grid::before {
          content: '';
          position: absolute;
          top: 28px;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--rose-light), transparent);
        }

        .step {
          text-align: center;
          position: relative;
        }

        .step-num {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--rose-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--rose);
          margin: 0 auto 24px;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .step:hover .step-num {
          background: var(--rose);
          color: white;
          border-color: var(--rose);
          transform: scale(1.1);
        }

        .step h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 10px;
        }

        .step p {
          font-size: 13px;
          color: var(--warm-gray);
          line-height: 1.7;
        }

        /* CTA SECTION */
        .cta-section {
          margin: 0 60px 120px;
          border-radius: 32px;
          background: var(--charcoal);
          padding: 100px 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
          overflow: hidden;
          position: relative;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232, 98, 122, 0.15), transparent);
          right: -100px;
          top: -100px;
        }

        .cta-section::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124, 61, 107, 0.1), transparent);
          left: 200px;
          bottom: -100px;
        }

        .cta-content { position: relative; z-index: 1; }

        .cta-eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rose-light);
          margin-bottom: 16px;
        }

        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 300;
          color: white;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .cta-title em { font-style: italic; color: var(--rose); }

        .cta-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.5);
          font-weight: 300;
          max-width: 380px;
          line-height: 1.7;
        }

        .cta-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: flex-end;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .btn-white {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: white;
          color: var(--charcoal);
          padding: 18px 40px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-white:hover {
          background: var(--rose);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(232, 98, 122, 0.4);
        }

        .cta-note {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          text-align: center;
        }

        /* FOOTER */
        footer {
          padding: 60px;
          border-top: 1px solid rgba(30, 26, 29, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--charcoal);
        }

        .footer-logo span { color: var(--rose); }

        .footer-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }

        .footer-links a {
          font-size: 12px;
          color: var(--warm-gray);
          text-decoration: none;
          letter-spacing: 0.06em;
          transition: color 0.3s;
        }

        .footer-links a:hover { color: var(--rose); }

        .footer-copy {
          font-size: 12px;
          color: rgba(30, 26, 29, 0.3);
        }

        /* SCROLL ANIMATIONS */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .hero-visual { display: none; }
          .features-grid { grid-template-columns: 1fr 1fr; }
          .steps-grid { grid-template-columns: 1fr 1fr; }
          .stats-strip { grid-template-columns: 1fr 1fr; }
          .cta-section { flex-direction: column; text-align: center; }
          .cta-actions { align-items: center; }
          nav { padding: 20px 30px; }
          .hero { padding: 100px 30px 60px; }
          .features, .how-section, .quote-section { padding: 80px 30px; }
          .cta-section { margin: 0 30px 80px; padding: 60px 40px; }
          footer { padding: 40px 30px; flex-direction: column; gap: 24px; text-align: center; }
          .stats-strip { padding: 0; }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
        }
      `}</style>

      {/* Custom cursor */}
      <div className="cursor" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="cursor-ring" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">Cycle<span>.</span></a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#help">Find Help</a></li>
          <li><a href="/sign-up" className="nav-cta">Get started</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" />
        <div className="hero-orb orb-1" style={{ transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)` }} />
        <div className="hero-orb orb-2" style={{ transform: `translate(${-parallaxX * 0.3}px, ${-parallaxY * 0.3}px)` }} />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="eyebrow-dot" />
            Women's Health Tracker
          </div>
          <h1 className="hero-title">
            Track your<br />
            <em>cycle,</em> own your<br />
            <span className="outline">health.</span>
          </h1>
          <p className="hero-subtitle">
            A beautiful, private space to understand your body — log cycles, track symptoms, predict periods, and find care when you need it most.
          </p>
          <div className="hero-actions">
            <a href="/sign-up" className="btn-primary">
              Start tracking free
              <span>→</span>
            </a>
            <a href="/sign-in" className="btn-ghost">
              Sign in
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="hero-visual" style={{ transform: `translateY(calc(-50% + ${parallaxY * 0.8}px)) translateX(${-parallaxX * 0.5}px)` }}>
          <div style={{ position: 'relative' }}>
            {/* Floating card 1 */}
            <div className="floating-card float-card-1">
              <div className="float-card-content">
                <div className="float-icon float-icon-rose">📅</div>
                <div>
                  <div className="float-text-label">Next period</div>
                  <div className="float-text-value">In 14 days</div>
                </div>
              </div>
            </div>

            <div className="phone-mockup">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-header">
                  <h3>Cycle Tracker 🌸</h3>
                  <p>Day 14 of your cycle</p>
                </div>

                <div className="cycle-ring">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="58" fill="none" stroke="#fce4ec" strokeWidth="10" />
                    <circle
                      cx="70" cy="70" r="58"
                      fill="none"
                      stroke="url(#grad)"
                      strokeWidth="10"
                      strokeDasharray={`${(14 / 28) * 364} 364`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#e8627a" />
                        <stop offset="100%" stopColor="#b87aad" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="cycle-ring-text">
                    <div className="day-num">14</div>
                    <div className="day-label">Day</div>
                  </div>
                </div>

                <div className="mini-cards">
                  <div className="mini-card">
                    <div className="mini-card-icon">🌙</div>
                    <div className="mini-card-label">Flow</div>
                    <div className="mini-card-value">Medium</div>
                  </div>
                  <div className="mini-card">
                    <div className="mini-card-icon">💗</div>
                    <div className="mini-card-label">Mood</div>
                    <div className="mini-card-value">Calm</div>
                  </div>
                </div>

                <div className="symptom-tags">
                  <div className="tag">Cramps</div>
                  <div className="tag">Fatigue</div>
                  <div className="tag">Bloating</div>
                </div>
              </div>
            </div>

            {/* Floating card 2 */}
            <div className="floating-card float-card-2">
              <div className="float-card-content">
                <div className="float-icon float-icon-purple">🩺</div>
                <div>
                  <div className="float-text-label">Nearest clinic</div>
                  <div className="float-text-value">0.8 miles away</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        {[
          { num: "28", suffix: "d", label: "Average cycle tracked" },
          { num: "5", suffix: "+", label: "Core features" },
          { num: "100", suffix: "%", label: "Private & secure" },
          { num: "Free", suffix: "", label: "To get started" },
        ].map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-num">{s.num}<span>{s.suffix}</span></div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-eyebrow">Everything you need</div>
        <h2 className="section-title">Built for your <em>body,</em><br />designed for your life.</h2>
        <p className="section-sub">Every feature is thoughtfully crafted to help you understand your cycle and take control of your health.</p>

        <div className="features-grid">
          {[
            { icon: "🌙", title: "Cycle Logging", desc: "Log your period with start date, end date, flow level, and length. Build a complete picture of your cycle over time." },
            { icon: "📅", title: "Period Predictions", desc: "Our algorithm learns your cycle pattern and predicts your next period so you're always prepared." },
            { icon: "🗓️", title: "Visual Calendar", desc: "See your entire cycle history and future predictions on a beautiful interactive calendar." },
            { icon: "💊", title: "Symptom Tracker", desc: "Log cramps, bloating, mood swings and more. Understand patterns in your symptoms over time." },
            { icon: "✏️", title: "Personal Notes", desc: "Add private notes to any day or cycle. Your thoughts, your space — completely confidential." },
            { icon: "🩺", title: "Find Help", desc: "Instantly find gynecologists, women's health clinics, and Planned Parenthood locations near you." },
          ].map((f, i) => (
            <div className="feature-card reveal" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <div className="quote-section">
        <div className="quote-mark">"</div>
        <p className="quote-text">
          Your health is not a mystery.<br />
          With the right tools, your body becomes<br />
          <em>something you truly understand.</em>
        </p>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-eyebrow">Simple by design</div>
        <h2 className="section-title">Up and running<br />in <em>minutes.</em></h2>

        <div className="steps-grid">
          {[
            { num: "01", title: "Create your account", desc: "Sign up in seconds with your email or Google. No credit card needed." },
            { num: "02", title: "Log your first cycle", desc: "Add your start date, flow level, and any symptoms you're experiencing." },
            { num: "03", title: "See your predictions", desc: "Instantly see your predicted next period and cycle day on the dashboard." },
            { num: "04", title: "Track over time", desc: "The more you log, the smarter your predictions become. Your health, understood." },
          ].map((s, i) => (
            <div className="step reveal" key={i}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section" id="help">
        <div className="cta-content">
          <div className="cta-eyebrow">Start today — it's free</div>
          <h2 className="cta-title">Your cycle.<br />Your data.<br /><em>Your power.</em></h2>
          <p className="cta-sub">Join and start understanding your body better. It takes less than two minutes to get started.</p>
        </div>
        <div className="cta-actions">
          <a href="/sign-up" className="btn-white">
            🌸 Create free account
          </a>
          <div className="cta-note">No credit card · Private by default · Free forever</div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Cycle<span>.</span></div>
        <ul className="footer-links">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/cycles">Cycles</a></li>
          <li><a href="/symptoms">Symptoms</a></li>
          <li><a href="/resources">Find Help</a></li>
          <li><a href="/sign-in">Sign in</a></li>
        </ul>
        <div className="footer-copy">© 2026 Cycle Tracker · Built by Sakshi Kangane</div>
      </footer>

      <script dangerouslySetInnerHTML={{__html: `
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('visible'), i * 80);
            }
          });
        }, { threshold: 0.1 });
        reveals.forEach(el => observer.observe(el));
      `}} />
    </>
  );
}
