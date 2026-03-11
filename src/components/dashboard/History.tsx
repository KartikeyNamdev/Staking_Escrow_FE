"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white">Activity History</h2>
        <div className="flex gap-4 w-full md:w-auto flex-grow justify-end">
          <div className="relative flex-grow max-w-xs">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
              size={16}
            />
            <input
              type="text"
              placeholder="Search history..."
              className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-2 rounded-xl text-sm outline-none focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 text-error text-sm font-bold hover:bg-error/20 transition-all"
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20 gap-4">
            <HistoryIcon size={48} />
            <p className="text-sm">No activities recorded yet.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 hover:translate-x-1 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center 
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
                className="flex-grow cursor-pointer"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm text-white">
                    {item.action}
                  </span>
                  <span className="text-[10px] text-white/30 uppercase tracking-tighter">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-white/50 items-center">
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
                    <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-primary/60 border border-white/5">
                      {item.signature.slice(0, 12)}...
                    </span>
                  )}
                </div>
              </Link>

              <a
                href={`https://explorer.solana.com/tx/${item.signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-20 group-hover:opacity-100 transition-opacity text-white hover:text-primary"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
