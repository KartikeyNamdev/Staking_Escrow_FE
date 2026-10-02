"use client";

import { useState } from "react";
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
      onNotify("Wallet Authorization Required", "error");
      return;
    }
    if (!formData.reciever || formData.reciever.length < 32) {
      onNotify("Invalid Recipient Address", "error");
      return;
    }
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      onNotify("Enter a valid SOL amount", "error");
      return;
    }

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

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.transaction) {
        try {
          // Robust base64 decoding for browser environments
          const binaryString = window.atob(data.transaction);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const transaction = Transaction.from(bytes);
          
          const signature = await sendTransaction(transaction, connection);

          onNotify(`Sent ${formData.amount} SOL`, "success", signature, {
            from: publicKey.toBase58(),
            to: formData.reciever,
            amount: formData.amount,
            type: "transfer",
          });
          setFormData({ reciever: "", amount: "" });
        } catch (walletError: any) {
          console.error("Wallet Error:", walletError);
          const errorMsg = walletError.message || "";
          if (errorMsg.includes("User rejected")) {
            onNotify("Transaction cancelled by user", "error");
          } else if (errorMsg.includes("insufficient funds")) {
            onNotify("Insufficient funds in wallet", "error");
          } else {
            onNotify(`Wallet Error: ${errorMsg.slice(0, 50)}...`, "error");
          }
        }
      } else {
        onNotify(data.error || "Transaction Execution Failed", "error");
      }
    } catch (e: any) {
      console.error("Transfer Error:", e);
      onNotify(e.name === "SyntaxError" ? "Invalid Server Response" : (e.message || "Infrastructure Offline"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-10 backdrop-blur-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-8 text-white">Transfer Assets</h2>
      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">
            Recipient Address
          </label>
          <input
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full min-w-0 bg-zinc-950 border border-white/20 text-white text-base px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-inner placeholder:text-white/25"
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
            inputMode="decimal"
            step="any"
            className="w-full min-w-0 bg-zinc-950 border border-white/20 text-white text-base px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-inner placeholder:text-white/25"
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
          className="mt-2 sm:mt-4 bg-primary text-black font-bold px-8 py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(20,241,149,0.2)]"
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
    </div>
  );
}
