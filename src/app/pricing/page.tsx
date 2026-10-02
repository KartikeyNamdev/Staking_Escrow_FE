import type { Metadata } from "next";
import Link from "next/link";
import { Check, Circle, CircleDot, CheckCircle2 } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Pricing & Roadmap | SolVault",
  description: "SolVault is free today. See what's coming next.",
};

const tiers = [
  {
    name: "Sandbox",
    price: "Free",
    note: "Available now",
    desc: "Everything you need to build and test on Solana.",
    features: ["SOL transfers with fee preview", "Devnet & Testnet faucet", "SPL token minting", "Token account explorer", "Local transaction history", "Custom RPC endpoint"],
    cta: { href: "/dashboard", label: "Launch App" },
    highlight: true,
  },
  {
    name: "Pro",
    price: "$12",
    note: "Coming soon · per month",
    desc: "For teams shipping to mainnet and production.",
    features: ["Everything in Sandbox", "Token metadata (Metaplex)", "Batch transfers via CSV", "Priority-fee optimizer", "Cloud-synced history", "Priority RPC included"],
    highlight: false,
  },
  {
    name: "Team",
    price: "Custom",
    note: "Coming later",
    desc: "Shared vaults and controls for organisations.",
    features: ["Everything in Pro", "Multi-sig vaults (Squads)", "Role-based access", "Audit log export", "Webhooks & alerts", "Dedicated support"],
    highlight: false,
  },
];

const roadmap = [
  { status: "shipped", quarter: "Q1 2026", title: "Core sandbox", items: ["Wallet connect", "Transfers & faucet", "Activity history"] },
  { status: "shipped", quarter: "Q3 2026", title: "Product polish", items: ["SPL minting with supply", "Token account explorer", "Network & RPC settings"] },
  { status: "progress", quarter: "Q4 2026", title: "Token tooling", items: ["Metaplex metadata", "Token-2022 extensions", "Burn & close accounts"] },
  { status: "next", quarter: "Q1 2027", title: "Pro launch", items: ["Batch transfers", "Priority fees", "Cloud history sync"] },
  { status: "next", quarter: "Later", title: "Teams", items: ["Multi-sig vaults", "Escrow & staking flows", "Audit logs"] },
];

const faqs = [
  { q: "Will the Sandbox stay free?", a: "Yes. Devnet tooling will always be free. Paid tiers only add mainnet-scale and team features." },
  { q: "Do you take a cut of transactions?", a: "No. You pay Solana's network fees directly — SolVault adds nothing on top." },
  { q: "Can I get early access to Pro?", a: "Star the GitHub repo and open an issue — early testers get Pro free at launch." },
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-background text-white font-sans overflow-x-clip">
      <SiteNav />

      <section className="px-5 sm:px-6 pt-14 sm:pt-24 pb-10 sm:pb-16 max-w-[900px] mx-auto text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 mb-5">Pricing</p>
        <h1 className="text-[clamp(2.5rem,10vw,5.5rem)] font-black leading-[0.9] tracking-tighter uppercase mb-6">
          Free while <span className="text-primary">you build.</span>
        </h1>
        <p className="text-base sm:text-xl text-white/40 max-w-xl mx-auto leading-relaxed">
          The full sandbox is free today. Paid tiers for mainnet and production teams are on the way.
        </p>
      </section>

      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border ${
                t.highlight ? "bg-linear-to-b from-primary/15 to-transparent border-primary/40" : "bg-white/[0.03] border-white/10"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest">
                  Current
                </span>
              )}
              <h2 className="text-lg font-black uppercase tracking-tight">{t.name}</h2>
              <p className="text-sm text-white/40 mt-1 mb-6">{t.desc}</p>
              <p className="text-5xl font-black tracking-tighter">{t.price}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2 mb-8">{t.note}</p>
              <ul className="flex flex-col gap-3 mb-8">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              {t.cta ? (
                <Link href={t.cta.href} className="mt-auto py-4 rounded-2xl bg-primary text-black font-black text-center active:scale-95 transition-transform">
                  {t.cta.label}
                </Link>
              ) : (
                <span className="mt-auto py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black text-center">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="roadmap" className="px-4 sm:px-6 py-12 sm:py-20 max-w-[1000px] mx-auto">
        <h2 className="text-[2rem] leading-none sm:text-5xl font-black tracking-tighter uppercase mb-10 sm:mb-14">Roadmap</h2>
        <ol className="relative flex flex-col gap-4 sm:gap-6 before:absolute before:left-[15px] before:top-4 before:bottom-4 before:w-px before:bg-white/10">
          {roadmap.map((r) => (
            <li key={r.title} className="relative flex gap-4 sm:gap-6">
              <span className="relative z-10 w-8 h-8 shrink-0 rounded-full bg-background flex items-center justify-center">
                {r.status === "shipped" ? (
                  <CheckCircle2 size={22} className="text-primary" />
                ) : r.status === "progress" ? (
                  <CircleDot size={22} className="text-orange-400 animate-pulse" />
                ) : (
                  <Circle size={22} className="text-white/20" />
                )}
              </span>
              <div className="grow rounded-[24px] bg-white/[0.03] border border-white/10 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                  <h3 className="font-black uppercase tracking-tight text-lg">{r.title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{r.quarter}</span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      r.status === "shipped" ? "bg-primary/10 text-primary" : r.status === "progress" ? "bg-orange-500/10 text-orange-400" : "bg-white/5 text-white/40"
                    }`}
                  >
                    {r.status === "shipped" ? "Shipped" : r.status === "progress" ? "In progress" : "Planned"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.items.map((i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-white/60">{i}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-[900px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-8">Pricing FAQ</h2>
        <div className="grid gap-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-[24px] bg-white/[0.03] border border-white/10 p-5 sm:p-6">
              <h3 className="font-bold text-white mb-2">{f.q}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
