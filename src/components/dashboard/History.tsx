"use client";

import { useState } from "react";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Copy,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { HistoryItem } from "@/types/dashboard";

interface HistoryProps {
  history: HistoryItem[];
  onClear: () => void;
  onCopy: (text: string) => void;
}

export function History({ history, onClear, onCopy }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter(
    (item) =>
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.to && item.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.signature &&
        item.signature.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 md:p-10 backdrop-blur-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 sm:mb-8 px-1 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Activity History</h2>
        <div className="flex gap-2 sm:gap-4 w-full md:w-auto flex-grow justify-end">
          <div className="relative flex-grow md:max-w-xs">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
              size={16}
            />
            <input
              type="search"
              placeholder="Search history..."
              className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-2.5 rounded-xl text-base md:text-sm outline-none focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={onClear}
            className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-error/10 text-error text-sm font-bold hover:bg-error/20 active:scale-95 transition-all"
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20 gap-4">
            <HistoryIcon size={48} />
            <p className="text-sm">No activities recorded yet.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 hover:translate-x-1 active:bg-white/5 transition-all group"
            >
              <div
                className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center 
                  ${
                    item.type === "transfer"
                      ? "bg-primary/10 text-primary"
                      : item.type === "airdrop"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-orange-500/10 text-orange-500"
                  }`}
              >
                {item.type === "transfer" ? (
                  <ArrowUpRight size={18} />
                ) : item.type === "airdrop" ? (
                  <ArrowDownLeft size={18} />
                ) : (
                  <Zap size={18} />
                )}
              </div>

              <Link
                href={`/dashboard/history/${item.id}`}
                className="flex-grow min-w-0 cursor-pointer"
              >
                <div className="flex justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-white truncate">
                    {item.action}
                  </span>
                  <span className="shrink-0 text-[10px] text-white/30 uppercase tracking-tighter">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50 items-center">
                  {item.to && (
                    <span>
                      To:{" "}
                      <code className="text-white/70">
                        {item.to.slice(0, 8)}...
                      </code>
                    </span>
                  )}
                  {item.amount && (
                    <span className="text-primary/70">{item.amount} SOL</span>
                  )}
                  {item.signature && (
                    <span className="hidden sm:inline bg-white/5 px-2 py-0.5 rounded text-[10px] text-primary/60 border border-white/5">
                      {item.signature.slice(0, 12)}...
                    </span>
                  )}
                </div>
              </Link>

              <a
                href={`https://explorer.solana.com/tx/${item.signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on Solana Explorer"
                className="shrink-0 p-2 -m-2 opacity-40 md:opacity-20 group-hover:opacity-100 transition-opacity text-white hover:text-primary"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
