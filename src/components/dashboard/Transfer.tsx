"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, RefreshCcw } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

interface TransferProps {
  onNotify: (
    text: string,
    type: "success" | "error",
    signature?: string,
    metadata?: any,
  ) => void;
  backendUrl: string;
}

export function Transfer({ onNotify, backendUrl }: TransferProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ reciever: "", amount: "" });

  const handleSend = async () => {
    if (!publicKey) {
      onNotify("Please connect your wallet first", "error");
      return;
    }
    if (!formData.reciever || !formData.amount) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: publicKey.toBase58(),
          reciever: formData.reciever,
          amount: formData.amount,
        }),
      });
      const data = await res.json();

      if (data.transaction) {
        const transaction = Transaction.from(
          Buffer.from(data.transaction, "base64"),
        );
        const signature = await sendTransaction(transaction, connection);

        onNotify(`Sent ${formData.amount} SOL`, "success", signature, {
          from: publicKey.toBase58(),
          to: formData.reciever,
          amount: formData.amount,
          type: "transfer",
        });
        setFormData({ reciever: "", amount: "" });
      } else {
        onNotify(data.error || "Transfer failed", "error");
      }
    } catch (e: any) {
      console.error(e);
      onNotify(e.message || "Action failed", "error");
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
      <h2 className="text-2xl font-bold mb-8 text-white">Transfer Assets</h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">
            Recipient Address
          </label>
          <input
            type="text"
            className="bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-primary transition-all"
            placeholder="PublicKey"
            value={formData.reciever}
            onChange={(e) =>
              setFormData({ ...formData, reciever: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">
            Amount
          </label>
          <input
            type="number"
            className="bg-white/5 border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-primary transition-all"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleSend}
          disabled={loading}
          className="mt-4 bg-primary text-black font-bold px-8 py-4 rounded-2xl hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(20,241,149,0.2)]"
        >
          {loading ? (
            <RefreshCcw className="animate-spin" size={20} />
          ) : (
            <>
              <Send size={18} />
              <span>Transfer SOL</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
