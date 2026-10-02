"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { VideoBackground } from "@/components/ui/VideoBackground";

interface OverviewProps {
  publicKey: string;
  setPublicKey: (val: string) => void;
  balance: number | null;
  loading: boolean;
  onQuery: () => void;
}

export function Overview({
  publicKey,
  setPublicKey,
  balance,
  loading,
  onQuery,
}: OverviewProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-10 backdrop-blur-md relative overflow-hidden group">
      <VideoBackground
        src="/video.mp4"
        overlayOpacity={0.65}
        className="opacity-40 group-hover:opacity-60 transition-opacity duration-700"
      />
      <div className="relative z-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-8 text-white">Account Balance</h2>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-10">
        <input
          type="text"
          placeholder="Enter Public Key"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="grow text-base w-full min-w-0 bg-zinc-950 border border-white/20 text-white px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-inner placeholder:text-white/25"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
        />
        <button
          onClick={onQuery}
          disabled={loading}
          className="bg-primary text-black font-bold px-8 py-3.5 sm:py-4 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all sm:min-w-[120px] flex items-center justify-center"
        >
          {loading ? (
            <RefreshCcw className="animate-spin" size={20} />
          ) : (
            "Query"
          )}
        </button>
      </div>

      {balance !== null && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-linear-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 sm:p-8 text-center"
        >
          <div className="text-white/50 text-sm mb-2 font-medium uppercase tracking-wider">
            Available SOL
          </div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-primary flex flex-wrap items-baseline justify-center gap-x-3 tabular-nums break-all">
            {balance} <span className="text-2xl opacity-50">SOL</span>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
