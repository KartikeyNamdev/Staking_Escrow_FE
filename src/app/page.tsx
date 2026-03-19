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
  Play,
  X,
} from "lucide-react";
import Link from "next/link";
import { VideoBackground } from "@/components/ui/VideoBackground";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const steps = [
    {
      id: "Step 01",
      title: "Connect & Secure",
      description:
        "Initialize your secure SolVault with hardware-level encryption and custom access policies.",
      icon: <Shield />,
      content: (
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-4 p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-emerald-400 uppercase tracking-tight">
                Multi-Sig Active
              </p>
              <p className="text-[10px] text-emerald-400/60 font-medium">
                Hardware-level security
              </p>
            </div>
          </div>
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 font-mono text-[11px] text-white/50 leading-relaxed">
            <span className="text-primary/70">await</span> vault.initialize(
            {"{"}
            <br />
            &nbsp; <span className="text-white/80">owner:</span> "7x...9a",
            <br />
            &nbsp; <span className="text-white/80">threshold:</span> 2<br />
            {"}"});
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
        <div className="p-8 bg-white/3 border border-white/5 rounded-[40px] shadow-2xl backdrop-blur-md w-full relative z-10">
          <div className="flex items-center gap-4 mb-8 text-left">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-base font-black text-white uppercase tracking-tight">
                Global Scaling
              </p>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-[0.2em]">
                Autonomous expansion
              </p>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-full bg-white/5 rounded-full overflow-hidden"
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
          <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[10px]">
            <span className="text-white/30 font-black uppercase tracking-widest">
              Active Scaling Nodes
            </span>
            <span className="text-primary font-black uppercase tracking-widest">
              Operational
            </span>
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
        {/* Background Video */}
        <VideoBackground
          src="/video.mp4"
          overlayOpacity={0.65}
          className="opacity-40"
        />

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
            v1.0 Beta is live
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
              className="group px-12 py-5 bg-primary text-black font-black text-md rounded-[24px] flex items-center gap-3 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(20,241,149,0.3)] transition-all active:scale-95"
            >
              Get Started
              <ArrowRight
                size={22}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black text-md rounded-[24px] hover:bg-white/10 transition-all flex items-center gap-2 group"
            >
              <Play
                size={18}
                className="group-hover:scale-110 group-hover:fill-current transition-all"
              />
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

              <div className="hidden lg:flex absolute bottom-8 right-12 w-64 h-32 bg-white/5 rounded-3xl border border-white/10 p-0 backdrop-blur-md -rotate-2 overflow-hidden shadow-2xl">
                <VideoBackground src="/video2.mp4" overlayOpacity={0.15} />
                <div className="relative z-10 p-4 w-full h-full flex flex-col gap-2 pointer-events-none">
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
                  <div className="text-[10px] font-mono text-white/50 truncate">
                    SYNCING_CLUSTER: SOLANA_MAINNET
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Identity & Security */}
          <div className="col-span-12 md:col-span-4 bg-[#0a0a0b] border border-white/10 rounded-[40px] p-8 relative overflow-hidden group">
            <VideoBackground
              src="/video3.mp4"
              overlayOpacity={0.7}
              className="opacity-60"
            />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mb-16 blur-3xl" />
            <div className="h-full flex flex-col items-center text-center justify-center relative z-10">
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
          <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col group hover:border-primary/30 transition-all relative overflow-hidden">
            <VideoBackground
              src="/video4.mp4"
              overlayOpacity={0.75}
              className="opacity-50"
            />
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 mb-6 group-hover:text-primary transition-colors relative z-10">
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
      <section className="px-6 py-24 md:py-48 max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left Column: Navigation and Narrative */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-16">
              <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8 uppercase">
                Simple. <br />
                <span className="text-primary italic">Powerful.</span>
                <br />
                Proven.
              </h2>
              <p className="text-white/40 text-lg md:text-xl font-medium max-w-md leading-relaxed tracking-tight group">
                Scale from <span className="text-white">zero to hero</span> with
                our streamlined pipeline. Designed for the next generation of{" "}
                <span className="text-primary underline decoration-2 underline-offset-4">
                  autonomous builders.
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`
                    group relative flex items-center gap-6 p-6 rounded-[32px] transition-all duration-500 text-left overflow-hidden
                    ${
                      activeStep === index
                        ? "bg-white/5 border border-white/10 ring-1 ring-white/10"
                        : "hover:bg-white/2 border border-transparent"
                    }
                  `}
                >
                  <div
                    className={`
                    w-12 h-12 flex items-center justify-center rounded-2xl font-black transition-all duration-500 shrink-0
                    ${activeStep === index ? "bg-primary text-black scale-110" : "bg-white/5 text-white/30 group-hover:text-white/50"}
                  `}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h4
                      className={`text-xl font-black tracking-tight uppercase transition-colors ${activeStep === index ? "text-white" : "text-white/30"}`}
                    >
                      {step.title}
                    </h4>
                  </div>
                  {activeStep === index && (
                    <motion.div
                      layoutId="step-glow"
                      className="absolute inset-0 bg-primary/5 -z-10"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-[1.4] w-full aspect-square md:aspect-auto lg:min-h-[700px] relative bg-white/2 border border-white/5 rounded-[64px] flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-3xl">
            {/* Background Video for Right Panel */}
            <VideoBackground
              src="/video5.mp4"
              overlayOpacity={0.5}
              className="opacity-80"
            />

            {/* Visual Flair Background */}
            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.9, y: 30, rotateY: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -30, rotateY: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[500px] p-8 md:p-12 relative z-10"
              >
                <div className="mb-12 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 mb-6">
                    {steps[activeStep].id}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-white/40 text-base md:text-lg font-medium leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-8 bg-primary/20 rounded-[48px] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                  <div className="relative transform transition-transform duration-700 group-hover:scale-[1.02]">
                    {steps[activeStep].content}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
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
            {/* <a href="#" className="hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Discord
            </a> */}
            <a
              href="https://github.com/KartikeyNamdev/solana-staking-escrow-vault"
              className="hover:text-primary text-green-600 transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest">
            © 2026 SolVault Labs / Decentralized Excellence
          </div>
        </div>
      </footer>

      {/* Video Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-6 md:p-12"
          >
            <div
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
              onClick={() => setShowDemo(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl aspect-video bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative group"
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-20 backdrop-blur-md transition-all active:scale-95"
              >
                <X size={24} />
              </button>

              {/* Vimeo Video Embed */}
              <div className="w-full h-full bg-black">
                <iframe
                  src="https://player.vimeo.com/video/1175088411?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  className="w-full h-full"
                  title="SolVault Platform Demo"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
