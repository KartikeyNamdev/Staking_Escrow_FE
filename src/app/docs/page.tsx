"use client";

import { motion } from "framer-motion";
import {
  Zap,
  ArrowLeft,
  Book,
  Terminal,
  Shield,
  Cpu,
  Globe,
  Code2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sections = [
  {
    id: "intro",
    title: "Introduction",
    icon: <Book size={18} />,
    content: (
      <div className="space-y-6">
        <p className="text-white/60 leading-relaxed text-lg">
          Welcome to <span className="text-primary font-bold">SOLVAULT</span>,
          the ultimate developer and power-user toolbox for the Solana
          ecosystem. Designed for speed, security, and automation, SolVault
          provides a high-fidelity interface to manage assets, deploy autonomous
          agents, and streamline blockchain operations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:border-primary/30 transition-all">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-white/40 text-sm">
              Hardware-level encryption and custom multi-sig policies for
              absolute control over your assets.
            </p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:border-primary/30 transition-all">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Cpu size={20} />
            </div>
            <h3 className="font-bold text-white mb-2">Autonomous Agents</h3>
            <p className="text-white/40 text-sm">
              Deploy AI-driven agents that monitor liquidity, handle batch
              transfers, and optimize yield 24/7.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Terminal size={18} />,
    content: (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white">System Requirements</h3>
        <p className="text-white/60">
          Ensure you have the following installed on your machine:
        </p>
        <ul className="list-disc list-inside text-white/40 space-y-2 ml-4">
          <li>Node.js 18.x or higher</li>
          <li>Solana CLI tools (for local development)</li>
          <li>Local Solana Validator (running on port 8899)</li>
        </ul>

        <h3 className="text-2xl font-bold text-white mt-8">Quick Start</h3>
        <div className="p-6 bg-black rounded-2xl border border-white/5 font-mono text-sm space-y-4">
          <div>
            <p className="text-white/30 mb-2"># Clone the repository</p>
            <p className="text-primary">
              git clone https://github.com/your-repo/solvault.git
            </p>
          </div>
          <div>
            <p className="text-white/30 mb-2">
              # Install dependencies (Frontend & Backend)
            </p>
            <p className="text-primary">cd solvault && npm install</p>
          </div>
          <div>
            <p className="text-white/30 mb-2">
              # Run the development environment
            </p>
            <p className="text-primary">npm run dev</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: <Code2 size={18} />,
    content: (
      <div className="space-y-8">
        <p className="text-white/60">
          SolVault backend exposes a RESTful API for interacting with the Solana
          blockchain. Base URL:{" "}
          <code className="text-primary">http://localhost:3001</code>
        </p>

        <div className="space-y-4">
          {[
            {
              method: "POST",
              path: "/balance",
              desc: "Fetch SOL balance for a public key.",
            },
            {
              method: "POST",
              path: "/send",
              desc: "Transfer SOL to another address.",
            },
            {
              method: "POST",
              path: "/airdrop",
              desc: "Request localnet airdrop (SOL).",
            },
            {
              method: "POST",
              path: "/createToken",
              desc: "Initialize a new SPL Token mint.",
            },
          ].map((api) => (
            <div
              key={api.path}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/[0.07] transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black px-2 py-1 bg-primary/20 text-primary rounded border border-primary/30 uppercase tracking-widest">
                  {api.method}
                </span>
                <code className="text-white font-bold">{api.path}</code>
              </div>
              <span className="text-white/40 text-sm hidden md:block">
                {api.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: <Globe size={18} />,
    content: (
      <div className="space-y-6">
        <p className="text-white/60">
          SolVault is built with a decoupled architecture, ensuring high
          performance and scalability.
        </p>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="mt-1 p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
              <Zap size={16} />
            </div>
            <div>
              <h4 className="font-bold text-white">Frontend (Next.js 16)</h4>
              <p className="text-white/40 text-sm italic">
                High-Fidelity Dashboard & UI
              </p>
              <p className="text-white/60 text-sm mt-1">
                Utilizes React Server Components, Turbopack, and Framer Motion
                for a premium editorial experience.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="mt-1 p-2 bg-blue-500/20 text-blue-500 rounded-lg">
              <Terminal size={16} />
            </div>
            <div>
              <h4 className="font-bold text-white">Backend (Express + TSX)</h4>
              <p className="text-white/40 text-sm italic">The Engine Room</p>
              <p className="text-white/60 text-sm mt-1">
                Handles direct communication with the Solana cluster using
                @solana/web3.js and SPL Token libraries.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 font-sans">
      {/* Navbar - Fixed to top */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-white/5 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg transition-transform group-hover:scale-110">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block">
              SOLVAULT
            </span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2 text-white/40 group cursor-default">
            <Book size={16} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Documentation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest hidden md:block"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black hover:bg-white/10 transition-all uppercase tracking-widest"
          >
            Launch App
          </Link>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto pt-20 flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-[300px] border-r border-white/5 hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto p-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-2">
              Fundamentals
            </p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document
                    .getElementById(section.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left
                  ${
                    activeSection === section.id
                      ? "bg-white/5 text-primary border border-white/5"
                      : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                  }
                `}
              >
                {section.icon}
                <span className="text-sm font-bold">{section.title}</span>
                {activeSection === section.id && (
                  <motion.div
                    layoutId="indicator"
                    className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#14f195]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 rounded-3xl border border-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-primary/20 transition-all" />
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
              Beta Preview
            </p>
            <h4 className="font-bold text-white text-sm mb-4">
              Want v2.0 early?
            </h4>
            <button className="flex items-center gap-2 text-xs font-black text-white hover:text-primary transition-colors">
              JOIN DISCORD <ExternalLink size={12} />
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto max-w-4xl mx-auto lg:mx-0">
          <div className="space-y-32 pb-40">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary">
                    {section.icon}
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase">
                    {section.title}
                  </h2>
                </div>
                <div className="pl-0 md:pl-2">{section.content}</div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
