"use client";

import { useEffect, useState } from "react";
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
  Send,
  Droplets,
  Coins,
  Layers,
  History,
  Settings2,
  Code2,
  Rocket,
  GraduationCap,
  Check,
  ChevronDown,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import Link from "next/link";
import { VideoBackground } from "@/components/ui/VideoBackground";

const stats = [
  { value: "~400ms", label: "Block time" },
  { value: "<$0.001", label: "Avg. tx fee" },
  { value: "6", label: "Built-in tools" },
  { value: "0", label: "CLI commands" },
];

const toolkit = [
  { href: "/dashboard/transfer", icon: <Send size={22} />, title: "Transfer SOL", desc: "Review the exact fee, confirm, and get an explorer-verified receipt." },
  { href: "/dashboard/airdrop", icon: <Droplets size={22} />, title: "Devnet Faucet", desc: "Claim free test SOL in one click. Clearly devnet-only." },
  { href: "/dashboard/mint", icon: <Coins size={22} />, title: "Token Minting", desc: "Name, symbol, decimals, supply — mint + ATA + supply in one transaction." },
  { href: "/dashboard/tokens", icon: <Layers size={22} />, title: "Account Explorer", desc: "See every token account you own and derive any ATA from its seeds." },
  { href: "/dashboard/history", icon: <History size={22} />, title: "Tx History", desc: "Every action is logged and linked to Solana Explorer or Solscan." },
  { href: "/dashboard/settings", icon: <Settings2 size={22} />, title: "Network Control", desc: "Switch Devnet, Testnet or Mainnet, and bring your own RPC." },
];

const personas = [
  {
    icon: <Code2 size={22} />,
    title: "Protocol devs",
    desc: "Spin up test mints and fund wallets while you iterate on programs.",
    points: ["Instant test SOL", "Custom RPC / localnet", "Raw tx signatures"],
  },
  {
    icon: <Rocket size={22} />,
    title: "Hackathon teams",
    desc: "Skip the setup. Demo token flows to judges in minutes, not hours.",
    points: ["Mint in one tx", "Shareable explorer links", "Mobile friendly"],
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Learners",
    desc: "See what actually happens on-chain — instruction by instruction.",
    points: ["ATA seed visualizer", "Plain-English errors", "Step-by-step docs"],
  },
];

const faqs = [
  { q: "Is SolVault custodial?", a: "No. Every transaction is built in your browser and signed by your own wallet. SolVault never sees or stores private keys." },
  { q: "Does it work on Mainnet?", a: "Yes — switch networks in Settings. Devnet is the default and recommended for testing. The faucet is disabled on Mainnet because test SOL doesn't exist there." },
  { q: "Which wallets are supported?", a: "Phantom out of the box, plus any wallet that implements the Solana Wallet Standard (Solflare, Backpack and others are detected automatically)." },
  { q: "What does it cost?", a: "The sandbox is free. You only pay Solana network fees, which are fractions of a cent. See Pricing for upcoming Pro features." },
  { q: "Where is my history stored?", a: "Locally in your browser. Every entry links to a public explorer, so the on-chain record is always the source of truth." },
];

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Lock page scroll and allow Escape to close while the demo is open
  useEffect(() => {
    if (!showDemo) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowDemo(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [showDemo]);

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
          <div className="bg-[#0a0a0b] p-6 sm:p-8 rounded-[28px] sm:rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex justify-center mt-8 mb-14">
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
        <div className="p-6 sm:p-8 bg-white/3 border border-white/5 rounded-[28px] sm:rounded-[40px] shadow-2xl backdrop-blur-md w-full relative z-10">
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
          <div className="pt-6 border-t border-white/5 flex justify-between items-center gap-3 text-[10px]">
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
    <div className="min-h-dvh bg-background text-white selection:bg-primary/30 font-sans overflow-x-clip">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative px-5 sm:px-6 py-16 sm:py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            v1.0 Beta is live
          </div>

          <h1 className="text-[clamp(3rem,15vw,8rem)] font-black leading-[0.9] tracking-[-0.06em] mb-6 sm:mb-8 uppercase">
            Automate <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-white to-primary/40 bg-[length:200%_auto] animate-shimmer">
              Solana
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-white/40 font-medium max-w-[600px] mx-auto leading-relaxed mb-10 sm:mb-12 tracking-tight text-pretty">
            The high-fidelity vault system for power users.{" "}
            <br className="hidden md:block" />
            Secure assets, run agents, and scale operations.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/dashboard"
              className="group px-10 sm:px-12 py-4 sm:py-5 bg-primary text-black font-black text-md rounded-[20px] sm:rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(20,241,149,0.3)] transition-all active:scale-95"
            >
              Get Started
              <ArrowRight
                size={22}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="px-10 sm:px-12 py-4 sm:py-5 bg-white/5 border border-white/10 text-white font-black text-md rounded-[20px] sm:rounded-[24px] hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 group"
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

      {/* Stats strip */}
      <section className="px-4 sm:px-6 max-w-[1300px] mx-auto -mt-4 sm:mt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-[24px] sm:rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden divide-x divide-y md:divide-y-0 divide-white/5">
          {stats.map((st) => (
            <div key={st.label} className="p-5 sm:p-8 text-center">
              <p className="text-2xl sm:text-4xl font-black tracking-tighter text-white mb-1">{st.value}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/30">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section (Bento Style) */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-40 max-w-[1300px] mx-auto">
        <div className="flex flex-col items-center mb-10 sm:mb-20">
          <h2 className="text-[2rem] leading-none sm:text-4xl md:text-6xl font-black tracking-tighter uppercase mb-5 sm:mb-6 text-center">
            One platform. <br className="md:hidden" />
            <span className="text-primary">Infinite Power.</span>
          </h2>
          <p className="text-white/40 text-base sm:text-lg md:text-xl font-medium max-w-2xl text-center leading-relaxed text-pretty">
            A comprehensive suite of tools built for the next generation of
            Solana power users and autonomous agent teams.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-[minmax(220px,auto)] md:auto-rows-[minmax(280px,auto)]">
          {/* Main Card: Solana Core */}
          <div className="col-span-12 md:col-span-8 bg-white/5 border border-white/10 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 md:p-12 relative overflow-hidden group hover:bg-white/[0.07] transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-primary/20 transition-all" />
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Database size={24} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                  Solana Core Engine
                </h3>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed">
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
          <div className="col-span-12 md:col-span-4 bg-[#0a0a0b] border border-white/10 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 relative overflow-hidden group">
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
          <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col group hover:border-primary/30 transition-all relative overflow-hidden">
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
          <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col group hover:border-primary/30 transition-all">
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
          <div className="col-span-12 md:col-span-4 bg-black border border-white/10 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col group relative overflow-hidden">
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

      {/* Toolkit */}
      <section className="px-4 sm:px-6 py-8 sm:py-16 max-w-[1300px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 mb-3">What&apos;s inside</p>
            <h2 className="text-[2rem] leading-none sm:text-5xl font-black tracking-tighter uppercase">Six tools. One tab.</h2>
          </div>
          <Link href="/dashboard" className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-3 transition-all">
            Open the dashboard <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {toolkit.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="group flex gap-4 sm:gap-5 p-5 sm:p-7 bg-white/[0.03] border border-white/10 rounded-[24px] sm:rounded-[28px] hover:bg-white/[0.06] hover:border-primary/30 hover:-translate-y-1 active:scale-[0.99] transition-all"
            >
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                {t.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-black uppercase tracking-tight text-white mb-1 flex items-center gap-2">
                  {t.title}
                  <ArrowRight size={14} className="text-white/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-48 max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-16 lg:gap-24 items-center">
          {/* Left Column: Navigation and Narrative */}
          <div className="flex-1 w-full flex flex-col justify-center">
            <div className="mb-10 sm:mb-16">
              <h2 className="text-[clamp(2.75rem,14vw,6rem)] md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-6 sm:mb-8 uppercase">
                Simple. <br />
                <span className="text-primary italic">Powerful.</span>
                <br />
                Proven.
              </h2>
              <p className="text-white/40 text-base sm:text-lg md:text-xl font-medium max-w-md leading-relaxed tracking-tight group">
                Scale from <span className="text-white">zero to hero</span> with
                our streamlined pipeline. Designed for the next generation of{" "}
                <span className="text-primary underline decoration-2 underline-offset-4">
                  autonomous builders.
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`
                    group relative flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] transition-all duration-500 text-left overflow-hidden active:scale-[0.99]
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
                      className={`text-base sm:text-xl font-black tracking-tight uppercase transition-colors ${activeStep === index ? "text-white" : "text-white/30"}`}
                    >
                      {step.title}
                    </h4>
                  </div>
                  {activeStep === index && (
                    <motion.div
                      layoutId="step-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="absolute inset-0 bg-primary/5 -z-10"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-[1.4] w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[700px] relative bg-white/2 border border-white/5 rounded-[32px] sm:rounded-[48px] lg:rounded-[64px] flex items-center justify-center overflow-hidden shadow-2xl">
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
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[500px] p-5 sm:p-8 md:p-12 relative z-10"
              >
                <div className="mb-8 sm:mb-12 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 mb-6">
                    {steps[activeStep].id}
                  </div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6 leading-none text-balance">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-white/40 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
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

      {/* Who it's for */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-[1300px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <h2 className="text-[2rem] leading-none sm:text-5xl font-black tracking-tighter uppercase">
            Built for <span className="text-primary">builders.</span>
          </h2>
          <p className="text-white/40 text-base sm:text-lg max-w-md leading-relaxed">
            Whether you&apos;re shipping a protocol or learning what an ATA is, SolVault removes the busywork.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {personas.map((p) => (
            <div key={p.title} className="bg-white/[0.03] border border-white/10 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">{p.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">{p.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-5">{p.desc}</p>
              <ul className="flex flex-col gap-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-white/60">
                    <Check size={14} className="text-primary shrink-0" /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-[900px] mx-auto">
        <h2 className="text-[2rem] leading-none sm:text-5xl font-black tracking-tighter uppercase text-center mb-10 sm:mb-14">
          Questions, <span className="text-primary">answered.</span>
        </h2>
        <div className="flex flex-col gap-2 sm:gap-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-7 py-5"
              >
                <span className="font-bold text-white text-sm sm:text-base">{f.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-white/40 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-primary" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="px-5 sm:px-7 pb-5 text-sm text-white/50 leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 py-10 max-w-[1300px] mx-auto">
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[48px] border border-primary/20 bg-linear-to-br from-primary/20 via-primary/5 to-transparent px-6 py-14 sm:p-20 text-center">
          <VideoBackground src="/video3.mp4" overlayOpacity={0.75} className="opacity-50" />
          <div className="relative z-10">
            <h2 className="text-[2rem] leading-none sm:text-6xl font-black tracking-tighter uppercase mb-5">
              Your first token is <br className="hidden sm:block" />
              <span className="text-primary">60 seconds away.</span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10">
              Connect a wallet, grab free devnet SOL and mint an SPL token — no CLI, no config files.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto">
              <Link href="/dashboard" className="px-10 py-4 bg-primary text-black font-black rounded-[20px] flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all">
                Launch App <ArrowRight size={18} />
              </Link>
              <Link href="/docs" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-[20px] hover:bg-white/10 transition-all">
                Read the Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Video Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-12"
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
              className="w-full max-w-5xl aspect-video bg-white/5 border border-white/10 rounded-[20px] sm:rounded-[40px] overflow-hidden shadow-2xl relative group"
            >
              <button
                onClick={() => setShowDemo(false)}
                aria-label="Close demo"
                className="absolute top-3 right-3 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-20 backdrop-blur-md transition-all active:scale-95"
              >
                <X size={24} />
              </button>

              {/* Vimeo Video Embed */}
              <div className="w-full h-full bg-black">
                <iframe
                  src="https://player.vimeo.com/video/1175687632?autoplay=1&title=0&byline=0&portrait=0&badge=0&autopause=0"
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
