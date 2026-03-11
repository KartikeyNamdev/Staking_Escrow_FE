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
    if (endpoint !== "getAssociatedTokenAccountAddress" && !publicKey) {
      onNotify("Please connect your wallet", "error");
      return;
    }

    setLoadingAction(actionName);
    try {
      // Special case for ATA Finder which is a POST but returns data, not a transaction
      if (endpoint === "getAssociatedTokenAccountAddress") {
        // This might need more params in a real app, but using current pattern:
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
      const data = await res.json();

      if (data.transaction) {
        const transaction = Transaction.from(
          Buffer.from(data.transaction, "base64"),
        );
        const signature = await sendTransaction(transaction, connection);

        const resultLabel = data.mint || data.newAccount || signature;

        onNotify(`${actionName} Successful`, "success", signature, {
          action: actionName,
          result: resultLabel,
          type: "tool",
        });
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <motion.div
          key={tool.id}
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
          onClick={() => performAction(tool.id, tool.label)}
          className="bg-white/2 border border-white/5 rounded-[20px] p-6 flex items-center gap-4 cursor-pointer transition-colors"
        >
          <div className="text-primary">{tool.icon}</div>
          <div className="grow">
            <h4 className="text-base font-bold text-white">{tool.label}</h4>
            <p className="text-xs text-white/40">{tool.desc}</p>
          </div>
          <div className="opacity-30">
            {loadingAction === tool.label ? (
              <RefreshCcw className="animate-spin" size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
