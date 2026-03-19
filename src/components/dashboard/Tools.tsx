"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Coins,
  ExternalLink,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

interface ToolsProps {
  onNotify: (
    text: string,
    type: "success" | "error",
    signature?: string,
    metadata?: any,
  ) => void;
  backendUrl: string;
}

const tools = [
  {
    id: "createAccount",
    label: "New Account",
    icon: <PlusCircle size={24} />,
    desc: "Generate keys",
  },
  {
    id: "createToken",
    label: "Mint Token",
    icon: <Coins size={24} />,
    desc: "Deploy SPL mint",
  },
  {
    id: "getAssociatedTokenAccountAddress",
    label: "ATA Finder",
    icon: <ExternalLink size={24} />,
    desc: "Resolve address",
  },
];

export function Tools({ onNotify, backendUrl }: ToolsProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const performAction = async (endpoint: string, actionName: string) => {
    if (!publicKey && endpoint !== "getAssociatedTokenAccountAddress") {
      onNotify("Please connect your wallet", "error");
      return;
    }

    setLoadingAction(actionName);
    try {
      if (endpoint === "getAssociatedTokenAccountAddress") {
        onNotify(
          "ATA Finder requires mint and owner. Use the dashboard query instead.",
          "error",
        );
        return;
      }

      const res = await fetch(`${backendUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payer: publicKey?.toBase58(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.transaction) {
        try {
          const binaryString = window.atob(data.transaction);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const transaction = Transaction.from(bytes);
          const signature = await sendTransaction(transaction, connection);

          const resultLabel = data.mint || data.newAccount || signature;

          onNotify(`${actionName} Successful`, "success", signature, {
            action: actionName,
            result: resultLabel,
            type: "tool",
          });
        } catch (walletError: any) {
          console.error("Wallet Action Error:", walletError);
          const msg = walletError.message || "";
          if (msg.includes("rejected")) {
            onNotify("Action cancelled by user", "error");
          } else {
            onNotify(`Wallet Error: ${msg.slice(0, 40)}`, "error");
          }
        }
      } else {
        onNotify(data.error || "Action failed", "error");
      }
    } catch (e: any) {
      console.error(e);
      onNotify(e.message || "Action failed", "error");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          onClick={() => performAction(tool.id, tool.label)}
          className="group relative bg-white/[0.03] border border-white/10 rounded-[32px] p-8 cursor-pointer transition-all hover:bg-white/[0.05] hover:border-primary/30 overflow-hidden"
        >
          {/* Subtle Hover Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors pointer-events-none" />
          
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-inner">
                {tool.icon}
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary/20 transition-all">
                {loadingAction === tool.label ? (
                  <RefreshCcw className="animate-spin" size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                {tool.label}
              </h4>
              <p className="text-xs text-white/30 font-medium uppercase tracking-[0.2em]">
                {tool.desc}
              </p>
            </div>
            
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 whileHover={{ width: "100%" }}
                 className="h-full bg-primary/50"
                 transition={{ duration: 0.6 }}
               />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
