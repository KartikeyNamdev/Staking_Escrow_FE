import Link from "next/link";
import { Zap } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/transfer", label: "Transfer SOL" },
      { href: "/dashboard/mint", label: "Mint Tokens" },
      { href: "/dashboard/airdrop", label: "Devnet Faucet" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs#how-it-works", label: "How it works" },
      { href: "/pricing", label: "Roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/pricing", label: "Pricing" },
      { href: "https://github.com/KartikeyNamdev/solana-staking-escrow-vault", label: "GitHub" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-6 pt-14 sm:pt-20 pb-10 mt-10 sm:mt-20 border-t border-white/5 bg-black/20">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Zap size={22} className="text-primary" fill="currentColor" />
              <span className="font-black text-xl tracking-tighter">SOLVAULT</span>
            </Link>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              The developer toolbox for Solana. Transfers, faucets, token minting and account
              inspection — without the CLI.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-4">{col.title}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-primary transition-colors">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-sm text-white/50 hover:text-primary transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-white/5 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <span>© 2026 SolVault Labs</span>
          <span>Non-custodial · Devnet-first · Built on Solana</span>
        </div>
      </div>
    </footer>
  );
}
