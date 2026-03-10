"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  BarChart3,
  Cpu,
  Globe,
  Command,
  Plus,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "Step 01",
      title: "Connect & Secure",
      description:
        "Initialize your secure SolVault with hardware-level encryption and custom access policies.",
      icon: <Shield />,
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border-emerald-100">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">
                Multi-Sig Enabled
              </p>
              <p className="text-xs text-emerald-600">
                Enterprise grade security
              </p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border-gray-100">
            <code className="text-xs text-gray-500 font-mono">
              await vault.initialize({"{"}
              <br /> &nbsp; owner: "7x...9a",
              <br /> &nbsp; threshold: 2
              <br /> {"}"});
            </code>
          </div>
        </div>
      ),
    },
    {
      id: "Step 02",
      title: "Deploy Agent Team",
      description:
        "Our AI agents monitor liquidity, handle batch transfers, and optimize yield across the Solana ecosystem.",
      icon: <Cpu />,
      content: (
        <div className="relative h-full flex flex-col justify-center">
          <div className="agent-card p-6 rounded-3xl text-white shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-white-opacity-10 rounded-full flex items-center justify-center border-white-opacity-20">
                  <Command size={18} />
                </div>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-6 bg-white-opacity-5 rounded-full border-white-opacity-10 flex items-center justify-center"
                    style={{
                      top: 24 + Math.sin(i * 1.047) * 40,
                      left: 24 + Math.cos(i * 1.047) * 40,
                    }}
                  >
                    <Plus size={10} className="text-white-opacity-40" />
                  </div>
                ))}
              </div>
            </div>
            <h4 className="text-center font-bold text-lg mb-1">
              Deploy Your Agent Team
            </h4>
            <p className="text-center text-xs text-white-opacity-40">
              Writers, designers, marketers, devs — all AI. No hiring needed.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "Step 03",
      title: "Scale With Confidence",
      description:
        "Auto-scale your operations as your project grows. Full visibility into every transaction and agent action.",
      icon: <BarChart3 />,
      content: (
        <div className="p-6 bg-white border-gray-100 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Globe size={16} />
            </div>
            <p className="text-sm font-bold text-black">Scaling Global</p>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${30 + i * 20}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="h-full bg-emerald-400"
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Real-time performance metrics
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-group">
          <div className="logo-icon">
            <Zap size={24} />
          </div>
          <span className="logo-text">SOLVAULT</span>
        </div>
        <div className="nav-links">
          <Link href="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <a href="#" className="nav-link">
            Docs
          </a>
          <Link href="/dashboard" className="premium-btn py-2 px-6">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            Automate Solana <br />
            <span className="shimmer-text">With AI Precision</span>
          </h1>
          <p className="hero-subtitle">
            The intelligent vault system for power users. Secure your assets,
            run autonomous agent teams, and scale your operations.
          </p>
          <div className="hero-buttons">
            <Link href="/dashboard" className="premium-btn py-4 px-10 text-lg">
              Get Started <ArrowRight size={20} />
            </Link>
            <button className="premium-btn secondary py-4 px-10 text-lg">
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <div className="works-container shadow-2xl">
          {/* Left Column */}
          <div className="works-left">
            <h2 className="works-title">
              How SolVault <br /> works?
            </h2>
            <p className="works-description">
              By 2030,{" "}
              <span className="font-bold text-black">1-person unicorns</span>{" "}
              will be the new reality. We're building the stack to make that{" "}
              <span className="font-bold text-black">happen—today.</span>
            </p>

            <div className="step-buttons">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`step-btn ${activeStep === index ? "active" : "inactive"}`}
                >
                  <span className="step-id">{step.id}</span>
                  <div
                    className={`step-arrow-container ${activeStep === index ? "active" : ""}`}
                  >
                    <ArrowRight size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="works-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="dynamic-content-wrapper"
              >
                <div className="content-header">
                  <h3 className="content-title">{steps[activeStep].title}</h3>
                  <p className="content-description">
                    {steps[activeStep].description}
                  </p>
                </div>

                <div className="content-body">{steps[activeStep].content}</div>
              </motion.div>
            </AnimatePresence>
            <div className="glow-overlay" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-logo">
            <Zap size={20} />
            <span>SOLVAULT</span>
          </div>
          <div className="footer-links">
            <a href="#">Twitter</a>
            <a href="#">Discord</a>
            <a href="#">GitHub</a>
          </div>
          <div className="footer-copy">© 2026 SolVault Labs.</div>
        </div>
      </footer>

      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background-color: var(--background);
          color: white;
          overflow-x: hidden;
        }

        /* Navbar */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          max-width: 1280px;
          margin: 0 auto;
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background-color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.025em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: white;
        }

        /* Hero */
        .hero-section {
          padding: 5rem 2rem 8rem;
          max-width: 1280px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          margin-bottom: 2rem;
          line-height: 1.1;
          letter-spacing: -0.05em;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 42rem;
          margin: 0 auto 2.5rem;
          line-height: 1.6;
          font-weight: 300;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        /* How it works */
        .how-it-works-section {
          padding: 5rem 2rem;
          max-width: 1280px;
          margin: 0 auto;
        }

        .works-container {
          background-color: white;
          border-radius: 48px;
          padding: 3rem;
          display: flex;
          flex-direction: row; /* Desktop direct flex */
          gap: 4rem;
          overflow: hidden;
          min-height: 600px;
        }

        .works-left {
          flex: 1;
          max-width: 45%;
        }

        .works-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          color: #0a0a0b;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .works-description {
          color: #6b7280;
          font-size: 1.125rem;
          margin-bottom: 3rem;
          max-width: 24rem;
          line-height: 1.6;
        }

        .step-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .step-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-radius: 1.5rem;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .step-btn.active {
          background-color: #0a0a0b;
          color: white;
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .step-btn.inactive {
          background-color: #f3f4f6;
          color: #0a0a0b;
        }

        .step-btn.inactive:hover {
          background-color: #e5e7eb;
        }

        .step-id {
          font-weight: 700;
          font-size: 1.125rem;
        }

        .step-arrow-container {
          transition: transform 0.3s ease;
        }

        .step-arrow-container.active {
          transform: rotate(0);
        }

        .step-arrow-container:not(.active) {
          transform: rotate(-45deg);
          opacity: 0.3;
        }

        .works-right {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          border-radius: 32px;
          padding: 2rem;
        }

        .dynamic-content-wrapper {
          width: 100%;
          max-width: 24rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .content-header {
          margin-bottom: 2rem;
        }

        .content-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: black;
          margin-bottom: 0.5rem;
          font-family: var(--font-outfit);
        }

        .content-description {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .content-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }

        /* Footer */
        .footer-section {
          padding: 5rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 5rem;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.5;
          font-weight: 700;
        }

        .footer-links {
          display: flex;
          gap: 3rem;
          font-size: 0.875rem;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: white;
        }

        .footer-copy {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Shared Utility Simulations */
        .flex {
          display: flex;
        }
        .flex-col {
          flex-direction: column;
        }
        .gap-3 {
          gap: 0.75rem;
        }
        .gap-4 {
          gap: 1rem;
        }
        .p-4 {
          padding: 1rem;
        }
        .p-6 {
          padding: 1.5rem;
        }
        .bg-emerald-50 {
          background-color: #ecfdf5;
        }
        .bg-emerald-500 {
          background-color: #10b981;
        }
        .bg-emerald-400 {
          background-color: #34d399;
        }
        .bg-gray-50 {
          background-color: #f9fafb;
        }
        .bg-gray-100 {
          background-color: #f3f4f6;
        }
        .rounded-2xl {
          border-radius: 1rem;
        }
        .rounded-xl {
          border-radius: 0.75rem;
        }
        .rounded-3xl {
          border-radius: 1.5rem;
        }
        .border-emerald-100 {
          border: 1px solid #d1fae5;
        }
        .border-gray-100 {
          border: 1px solid #f3f4f6;
        }
        .text-emerald-900 {
          color: #064e3b;
        }
        .text-emerald-600 {
          color: #059669;
        }
        .text-white {
          color: white;
        }
        .text-black {
          color: black;
        }
        .text-mono {
          font-family: monospace;
        }
        .font-bold {
          font-weight: 700;
        }
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .agent-card {
          background-color: #0a0a0b;
        }
        .white-opacity-10 {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .white-opacity-5 {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .white-opacity-40 {
          color: rgba(255, 255, 255, 0.4);
        }
        .border-white-opacity-20 {
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .border-white-opacity-10 {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glow-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(20, 241, 149, 0.05),
            transparent
          );
          filter: blur(100px);
          z-index: -1;
        }

        @media (max-width: 900px) {
          .works-container {
            flex-direction: column;
            padding: 1.5rem;
          }
          .works-left {
            max-width: 100%;
          }
          .footer-container {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 3rem 1.5rem;
          }
          .hero-title {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
