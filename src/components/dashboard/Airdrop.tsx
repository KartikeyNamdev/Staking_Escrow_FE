"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, RefreshCcw } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

interface AirdropProps {
  onNotify: (
    text: string,
    type: "success" | "error",
    signature?: string,
    metadata?: any,
  ) => void;
  backendUrl: string;
}

export function Airdrop({ onNotify, backendUrl }: AirdropProps) {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ publicKey: "", amount: "1" });

  useEffect(() => {
    if (publicKey) {
      setFormData((prev) => ({ ...prev, publicKey: publicKey.toBase58() }));
    }
  }, [publicKey]);

  const handleAirdrop = async () => {
    if (!formData.publicKey) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/airdrop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: formData.publicKey,
          amount: formData.amount,
        }),
      });
      const data = await res.json();
      if (data.signature) {
        onNotify(
          `Airdropped ${formData.amount} SOL`,
          "success",
          data.signature,
          {
            to: formData.publicKey,
            amount: formData.amount,
            type: "airdrop",
          },
        );
      } else {
        onNotify(data.error || "Airdrop failed", "error");
      }
    } catch (e) {
      onNotify("Backend unreachable", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-xl"
    >
      <h2 className="text-2xl font-bold mb-8 text-white">Request Airdrop</h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">
            Wallet PublicKey
          </label>
          <input
            type="text"
            className="bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-primary transition-all"
            placeholder="Address"
            value={formData.publicKey}
            onChange={(e) =>
              setFormData({ ...formData, publicKey: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">
            Quantity (SOL)
          </label>
          <input
            type="number"
            className="bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-primary transition-all"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleAirdrop}
          disabled={loading}
          className="mt-4 bg-primary text-black font-bold px-8 py-4 rounded-2xl hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(20,241,149,0.2)]"
        >
          {loading ? (
            <RefreshCcw className="animate-spin" size={20} />
          ) : (
            <>
              <Droplets size={18} />
              <span>Claim SOL</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
