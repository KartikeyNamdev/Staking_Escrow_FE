"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-xl"
    >
      <h2 className="text-2xl font-bold mb-8 text-white">Account Balance</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Enter Public Key"
          className="flex-grow bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-primary transition-all"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
        />
        <button
          onClick={onQuery}
          disabled={loading}
          className="bg-primary text-black font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-100 disabled:opacity-50 disabled:scale-100 transition-all min-w-[120px] flex items-center justify-center"
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
          className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 text-center"
        >
          <div className="text-white/50 text-sm mb-2 font-medium uppercase tracking-wider">
            Available SOL
          </div>
          <div className="text-5xl md:text-6xl font-black text-primary flex items-center justify-center gap-3">
            {balance} <span className="text-2xl opacity-50">SOL</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
