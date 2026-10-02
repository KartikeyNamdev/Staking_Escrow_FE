import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Eye,
  FlaskConical,
  KeyRound,
  Terminal,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "About | SolVault",
  description: "Why SolVault exists: a unified sandbox for Solana developers.",
};

const problems = [
  { icon: <Terminal size={22} />, title: "CLI juggling", desc: "solana, spl-token, anchor — three CLIs, three config files, and a keypair on disk just to send a test transfer." },
  { icon: <BookOpen size={22} />, title: "Scattered docs", desc: "Answers live across the Solana Cookbook, program READMEs and Discord threads. Context switching kills momentum." },
  { icon: <Calculator size={22} />, title: "Manual ATA math", desc: "Deriving associated token accounts, rent-exempt minimums and decimals by hand is where most early bugs come from." },
];

const principles = [
  { icon: <KeyRound size={20} />, title: "Non-custodial", desc: "Transactions are built in your browser and signed by your wallet. We never touch keys." },
  { icon: <FlaskConical size={20} />, title: "Devnet-first", desc: "Safe defaults. Mainnet is opt-in, clearly labelled and never the default." },
  { icon: <Eye size={20} />, title: "Verifiable", desc: "Every action links to a public explorer. The chain is the source of truth, not our UI." },
];

const stack = ["Next.js 16", "React 19", "@solana/web3.js", "Wallet Adapter", "SPL Token", "Express API", "Framer Motion", "Tailwind v4"];

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-background text-white font-sans overflow-x-clip">
      <SiteNav />

      <section className="px-5 sm:px-6 pt-14 sm:pt-24 pb-16 max-w-[1000px] mx-auto text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 mb-5">About SolVault</p>
        <h1 className="text-[clamp(2.5rem,10vw,5.5rem)] font-black leading-[0.9] tracking-tighter uppercase mb-6 sm:mb-8">
          Solana tooling <br />
          <span className="text-primary">shouldn&apos;t need a terminal.</span>
        </h1>
        <p className="text-base sm:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
          SolVault is a unified sandbox for the everyday tasks every Solana developer repeats —
          funding wallets, sending SOL, minting tokens and inspecting accounts — in one place, with
          the on-chain details visible instead of hidden.
        </p>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-[1300px] mx-auto">
        <h2 className="text-[2rem] leading-none sm:text-5xl font-black tracking-tighter uppercase mb-8 sm:mb-12">The problem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {problems.map((p) => (
            <div key={p.title} className="bg-white/[0.03] border border-white/10 rounded-[28px] p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-6">{p.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">{p.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <h2 className="text-[2rem] leading-none sm:text-5xl font-black tracking-tighter uppercase mb-6">
              The <span className="text-primary">fix</span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-6">
              One wallet connection replaces the keypair-on-disk workflow. Transfers show their exact
              fee before you sign. Minting builds the mint, your ATA and the initial supply in a single
              transaction — and shows you each instruction it used.
            </p>
            <p className="text-white/50 text-base sm:text-lg leading-relaxed">
              When something fails, you get a plain-English reason (rent, rate limits, expired
              blockhash) instead of a raw program log.
            </p>
          </div>
          <div className="grid gap-3">
            {principles.map((p) => (
              <div key={p.title} className="flex gap-4 p-5 sm:p-6 rounded-[24px] bg-white/[0.03] border border-white/10">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{p.icon}</div>
                <div>
                  <h3 className="font-black uppercase tracking-tight">{p.title}</h3>
                  <p className="text-sm text-white/40 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-[1300px] mx-auto">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 sm:p-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6">Built with</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {stack.map((s) => (
              <span key={s} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-white/70">{s}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link href="/dashboard" className="px-8 py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
              Try it now <ArrowRight size={18} />
            </Link>
            <a
              href="https://github.com/KartikeyNamdev/solana-staking-escrow-vault"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 border border-white/10 font-black rounded-2xl text-center hover:bg-white/10 transition-colors"
            >
              View source on GitHub
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
