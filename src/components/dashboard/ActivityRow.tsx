"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Coins, ExternalLink, Zap } from "lucide-react";
import { HistoryItem } from "@/types/dashboard";
import { useSettings } from "@/context/SettingsContext";
import { shorten } from "@/lib/solana";

export function ActivityIcon({ type, size = 18 }: { type?: string; size?: number }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    transfer: { cls: "bg-primary/10 text-primary", icon: <ArrowUpRight size={size} /> },
    airdrop: { cls: "bg-blue-500/10 text-blue-400", icon: <ArrowDownLeft size={size} /> },
    mint: { cls: "bg-purple-500/10 text-purple-300", icon: <Coins size={size} /> },
    tool: { cls: "bg-orange-500/10 text-orange-400", icon: <Zap size={size} /> },
  };
  const { cls, icon } = map[type ?? "tool"] ?? map.tool;
  return (
    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${cls}`}>
      {icon}
    </div>
  );
}

export function ActivityRow({ item }: { item: HistoryItem }) {
  const { txUrl } = useSettings();
  const detail =
    item.type === "mint"
      ? `${item.supply ?? "0"} ${item.symbol ?? ""}`.trim()
      : item.amount
        ? `${item.amount} SOL`
        : null;

  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 active:bg-white/5 transition-all group">
      <ActivityIcon type={item.type} />
      <Link href={`/dashboard/history/${item.id}`} className="flex-grow min-w-0">
        <div className="flex justify-between gap-2 mb-1">
          <span className="font-bold text-sm text-white truncate">{item.action}</span>
          <span className="shrink-0 text-[10px] text-white/30 uppercase tracking-tighter">
            {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50 items-center">
          {item.to && (
            <span>
              To: <code className="text-white/70">{shorten(item.to, 4)}</code>
            </span>
          )}
          {item.mint && (
            <span>
              Mint: <code className="text-white/70">{shorten(item.mint, 4)}</code>
            </span>
          )}
          {detail && <span className="text-primary/70">{detail}</span>}
          {item.network && item.network !== "devnet" && (
            <span className="text-[10px] uppercase tracking-widest text-orange-400/70">{item.network}</span>
          )}
        </div>
      </Link>
      {item.signature && (
        <a
          href={txUrl(item.signature, item.network)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on explorer"
          className="shrink-0 p-2 -m-2 opacity-40 md:opacity-20 group-hover:opacity-100 transition-opacity text-white hover:text-primary"
        >
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
}
