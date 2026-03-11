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
  Terminal,
  Database,
  Fingerprint,
  Activity,
  Boxes,
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
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
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
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <code className="text-xs text-gray-500 font-mono leading-relaxed">
              await vault.initialize({"{"}
              <br />
              &nbsp; owner: "7x...9a",
              <br />
              &nbsp; threshold: 2<br />
              {"}"});
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
          <div className="bg-[#0a0a0b] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-primary uppercase font-black text-xs">
                  <span className="animate-pulse flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> AI
                  </span>
                </div>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-6 bg-white/5 rounded-full border border-white/10 flex items-center justify-center"
                    style={{
                      top: 28 + Math.sin(i * 1.047) * 45,
                      left: 28 + Math.cos(i * 1.047) * 45,
                    }}
                  >
                    <Plus size={10} className="text-white/40" />
                  </div>
                ))}
              </div>
            </div>
            <h4 className="text-center font-bold text-xl mb-2 tracking-tight">
              Autonomous Yield Agent
            </h4>
            <div className="flex justify-center gap-1">
              <div className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] rounded border border-primary/20 font-black uppercase">
                Active
              </div>
              <div className="px-2 py-0.5 bg-white/5 text-white/40 text-[8px] rounded border border-white/10 font-black uppercase">
                Scanning
              </div>
            </div>
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
        <div className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
              <Globe size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-black leading-none">
                Global Scaling
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                Cross-chain potential
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${30 + i * 20}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="h-full bg-primary"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center text-[10px]">
            <span className="text-gray-400 font-bold uppercase tracking-widest">
              Growth Rate
            </span>
            <span className="text-emerald-500 font-black">+124.5%</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-8 max-w-[1400px] mx-auto sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 bg-primary rounded-[14px] flex items-center justify-center text-black shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all group-hover:scale-110">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter">SOLVAULT</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-white/50 hover:text-white transition-colors tracking-wide uppercase"
          >
            Dashboard
          </Link>
          <Link
            href="/docs"
            className="text-sm font-bold text-white/50 hover:text-white transition-colors tracking-wide uppercase"
          >
            Docs
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-black hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[900px] relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            v2.0 Beta is live
          </div>

          <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.9] tracking-[-0.06em] mb-8 uppercase">
            Automate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary/40 bg-[length:200%_auto] animate-shimmer">
              Solana
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/40 font-medium max-w-[600px] mx-auto leading-relaxed mb-12 tracking-tight">
            The high-fidelity vault system for power users.{" "}
            <br className="hidden md:block" />
            Secure assets, run agents, and scale operations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group px-12 py-5 bg-primary text-black font-black text-lg rounded-[24px] flex items-center gap-3 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(20,241,149,0.3)] transition-all active:scale-95"
            >
              Get Started
              <ArrowRight
                size={22}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <button className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black text-lg rounded-[24px] hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Floating Icons background simulation */}
        <div className="hidden lg:block absolute inset-0 -z-20 pointer-events-none opacity-20">
          <Zap className="absolute top-[20%] left-[15%] text-primary size-24 rotate-12 blur-sm" />
          <Shield className="absolute bottom-[20%] right-[10%] text-white size-32 -rotate-12 blur-[1px]" />
          <Cpu className="absolute top-[40%] right-[20%] text-primary/40 size-20 rotate-45 blur-md" />
        </div>
      </section>

      {/* Features Grid Section (Bento Style) */}
      <section className="px-6 py-24 md:py-40 max-w-[1300px] mx-auto">
        <div className="flex flex-col items-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 text-center">
            One platform. <br className="md:hidden" />
            <span className="text-primary">Infinite Power.</span>
          </h2>
          <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl text-center leading-relaxed">
            A comprehensive suite of tools built for the next generation of
            Solana power users and autonomous agent teams.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 auto-rows-[240px] md:auto-rows-[280px]">
          {/* Main Card: Solana Core */}
          <div className="col-span-12 md:col-span-8 bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden group hover:bg-white/[0.07] transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-primary/20 transition-all" />
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Database size={24} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight">
                  Solana Core Engine
                </h3>
                <p className="text-white/50 text-base leading-relaxed">
                  High-fidelity integration with System Program. Handle native
                  SOL transfers, account initialization, and cluster-wide state
                  management with ease.
                </p>
                <div className="flex flex-wrap gap-2 pt-4">
                  {["100% Native", "High Speed", "Open Source"].map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Abstract Visual for Core Engine */}
              <div className="hidden lg:flex absolute bottom-8 right-12 w-64 h-32 bg-white/5 rounded-3xl border border-white/10 p-4 backdrop-blur-md -rotate-2 flex-col gap-2">
                <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-full w-1/2 bg-primary"
                  />
                </div>
                <div className="text-[10px] font-mono text-white/30 truncate">
                  PENDING_TX: 5mK8...3xQ
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 bg-white/5 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Identity & Security */}
          <div className="col-span-12 md:col-span-4 bg-[#0a0a0b] border border-white/10 rounded-[40px] p-8 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mb-16 blur-3xl" />
            <div className="h-full flex flex-col items-center text-center justify-center">
              <div className="w-20 h-20 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Fingerprint size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 tracking-tighter">
                Identity & Vaults
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Secure multi-sig policies and hardware-grade encryption.
              </p>
            </div>
          </div>

          {/* Card 3: Token Forge */}
          <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col group hover:border-primary/30 transition-all">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 mb-6 group-hover:text-primary transition-colors">
              <Boxes size={24} />
            </div>
            <h3 className="text-xl font-bold uppercase mb-4 tracking-tighter">
              SPL Token Forge
            </h3>
            <p className="text-white/40 text-sm mb-8">
              Launch and manage SPL tokens. Automated ATA creation and balance
              monitoring.
            </p>
            <div className="mt-auto grid grid-cols-6 gap-1 h-8 items-end">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-primary/20 rounded-t-sm"
                  style={{ height: `${30 + i * 12}%` }}
                />
              ))}
            </div>
          </div>

          {/* Card 4: Realtime Engine */}
          <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col group hover:border-primary/30 transition-all">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 mb-6 group-hover:text-primary transition-colors">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold uppercase mb-4 tracking-tighter">
              Live Monitor
            </h3>
            <p className="text-white/40 text-sm">
              Real-time transaction tracking and instant status updates via
              WebSocket.
            </p>
            <div className="mt-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest">
                System Operational
              </span>
            </div>
          </div>

          {/* Card 5: API Section */}
          <div className="col-span-12 md:col-span-4 bg-black border border-white/10 rounded-[40px] p-8 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:text-primary transition-colors">
              <Terminal size={24} />
            </div>
            <h3 className="text-xl font-bold uppercase mb-4 tracking-tighter">
              Dev-First API
            </h3>
            <p className="text-white/40 text-sm mb-6">
              Instant ready-to-use Restful APIs for all Solana operations.
            </p>
            <div className="mt-auto space-y-2 font-mono text-[9px] text-white/20">
              <div className="flex gap-2">
                <span className="text-primary font-bold">POST</span>
                <span>/api/v1/send-sol</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary font-bold">POST</span>
                <span>/api/v1/mint-token</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 py-24 md:py-40 max-w-[1300px] mx-auto">
        <div className="bg-white rounded-[64px] p-8 md:p-16 flex flex-col lg:flex-row gap-16 lg:gap-24 overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white to-gray-50 -z-10" />

          {/* Left Column */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-5xl md:text-7xl font-black text-black leading-[0.9] tracking-tighter mb-8 uppercase">
              How <br className="hidden md:block" />
              <span className="text-emerald-500">SolVault</span>
              <br />
              works?
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium mb-12 max-w-md leading-relaxed tracking-tight">
              By 2030,{" "}
              <span className="text-black font-black">1-person unicorns</span>{" "}
              will be the new reality. We&apos;re building the infrastructure to
              make that{" "}
              <span className="text-black font-black underline decoration-emerald-500 decoration-4">
                happen today.
              </span>
            </p>

            <div className="flex flex-col gap-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`
                    group flex justify-between items-center p-6 md:p-8 rounded-[32px] transition-all duration-500 text-left
                    ${
                      activeStep === index
                        ? "bg-black text-white scale-[1.02] shadow-2xl"
                        : "bg-gray-100/50 text-black hover:bg-gray-100"
                    }
                  `}
                >
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeStep === index ? "text-primary/70" : "text-gray-400"}`}
                    >
                      {step.id}
                    </span>
                    <span className="text-xl md:text-2xl font-black tracking-tight uppercase">
                      {step.title}
                    </span>
                  </div>
                  <div
                    className={`
                    w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-700
                    ${activeStep === index ? "bg-white/10 text-primary rotate-0" : "bg-white text-gray-300 -rotate-45 opacity-0 md:opacity-100"}
                  `}
                  >
                    <ArrowRight size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-[1.2] relative min-h-[500px] lg:min-h-auto flex items-center justify-center bg-gray-50/50 rounded-[48px] border border-gray-100 shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[450px] p-6 text-center lg:text-left h-full flex flex-col"
              >
                <div className="mb-8 block">
                  <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-4">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                </div>

                <div className="grow flex items-center justify-center">
                  {steps[activeStep].content}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Visual Flair */}
            <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 mt-20 border-t border-white/5 bg-black/20">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
            <Zap size={24} fill="currentColor" />
            <span className="font-black text-2xl tracking-tighter">
              SOLVAULT
            </span>
          </div>

          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            <a href="#" className="hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Discord
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              GitHub
            </a>
          </div>

          <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest">
            © 2026 SolVault Labs / Decentralized Excellence
          </div>
        </div>
      </footer>
    </div>
  );
}
