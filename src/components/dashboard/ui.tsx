"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Zap } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/components/WalletButton";

export const cardClass =
  "bg-white/5 border border-white/10 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 backdrop-blur-md";

export const inputClass =
  "w-full min-w-0 bg-zinc-950 border border-white/20 text-white text-base px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-inner placeholder:text-white/25 disabled:opacity-50";

export const primaryButtonClass =
  "bg-primary text-black font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(20,241,149,0.2)]";

export const secondaryButtonClass =
  "bg-white/5 border border-white/10 text-white font-bold px-6 py-3.5 sm:py-4 rounded-2xl hover:bg-white/10 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2.5";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${cardClass} ${className}`}>{children}</div>;
}

export function PageHeader({
  icon,
  eyebrow,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-8">
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        {icon && (
          <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">{title}</h1>
          {description && (
            <p className="text-sm text-white/40 mt-1.5 max-w-xl leading-relaxed text-pretty">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  right,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 pl-1">
        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">{label}</label>
        {right}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-error pl-1">{error}</p>
      ) : hint ? (
        <p className="text-xs text-white/30 pl-1">{hint}</p>
      ) : null}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 min-w-0">
      <div className="flex items-center justify-between gap-2 text-white/30 mb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] truncate">{label}</span>
        {icon}
      </div>
      <div className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums truncate">
        {value}
      </div>
      {sub && <p className="text-[11px] text-white/30 mt-1 truncate">{sub}</p>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4 gap-3">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/25 mb-2">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-white/40 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function CopyButton({ value, className = "" }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`shrink-0 p-2 -m-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 active:scale-90 transition-all ${className}`}
    >
      {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
    </button>
  );
}

export function ExplorerLink({ href, label = "Explorer" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary/80 hover:text-primary transition-colors"
    >
      {label} <ExternalLink size={12} />
    </a>
  );
}

/** A labelled monospace value with copy + optional explorer link. */
export function KeyValue({
  label,
  value,
  href,
  mono = true,
}: {
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30">{label}</span>
      <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 min-w-0">
        <span className={`${mono ? "font-mono text-xs" : "text-sm"} text-white/80 break-all min-w-0 grow`}>
          {value}
        </span>
        <CopyButton value={value} />
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in explorer"
            className="shrink-0 p-2 -m-1 rounded-lg text-white/40 hover:text-primary hover:bg-white/5 transition-all"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

export function RequireWallet({ children }: { children: ReactNode }) {
  const { publicKey, connecting } = useWallet();

  if (publicKey) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12 sm:p-16 bg-white/2 border border-white/5 rounded-[28px] sm:rounded-[40px] backdrop-blur-md min-h-[420px]">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 sm:mb-8 text-primary shadow-[0_0_40px_rgba(20,241,149,0.1)]">
        <Zap size={40} className={connecting ? "animate-spin-slow" : "animate-pulse"} />
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4 text-balance">
        {connecting ? "Connecting wallet…" : "Secure Access Required"}
      </h2>
      <p className="max-w-md text-white/40 mb-8 text-sm leading-relaxed text-pretty">
        Connect a Solana wallet to use this tool. SolVault is non-custodial — your keys never leave
        your wallet, and every transaction is signed by you.
      </p>
      <WalletButton />
      <Link
        href="/docs"
        className="mt-6 text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors"
      >
        New to Solana wallets? Read the docs
      </Link>
    </div>
  );
}

export function TypeBadge({ type }: { type?: string }) {
  const styles: Record<string, string> = {
    transfer: "bg-primary/10 text-primary border-primary/20",
    airdrop: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    mint: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    tool: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-widest ${styles[type ?? "tool"] ?? styles.tool}`}
    >
      {type ?? "tool"}
    </span>
  );
}
