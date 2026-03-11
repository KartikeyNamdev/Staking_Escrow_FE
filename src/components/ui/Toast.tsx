"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Copy,
  ExternalLink,
} from "lucide-react";

interface ToastProps {
  message: {
    text: string;
    type: string;
    signature?: string;
  };
  onClose?: () => void;
  onCopy: (text: string) => void;
}

export function Toast({ message, onClose, onCopy }: ToastProps) {
  if (!message.text) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        className={`
          fixed bottom-8 right-8 w-[380px] bg-black/95 backdrop-blur-2xl 
          border border-white/10 rounded-3xl z-[1000] overflow-hidden 
          shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          ${message.type === "success" ? "border-l-4 border-l-primary" : "border-l-4 border-l-error"}
        `}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            {message.type === "success" ? (
              <CheckCircle2 className="text-primary" size={20} />
            ) : (
              <AlertCircle className="text-error" size={20} />
            )}
            <span className="font-bold text-sm grow">
              {message.type === "success"
                ? "Transaction Success"
                : "Action Failed"}
            </span>
            <button
              onClick={onClose}
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              <RefreshCcw size={14} className="rotate-45" />
            </button>
          </div>

          <p className="text-sm text-white/60 leading-relaxed mb-4">
            {typeof message.text === "string"
              ? message.text
              : JSON.stringify(message.text)}
          </p>

          {message.signature && (
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 mt-2">
              <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-widest text-white/30">
                <span>Signature / Address</span>
                <button
                  onClick={() => onCopy(message.signature!)}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md hover:bg-white/10 transition-colors"
                >
                  <Copy size={12} />
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-primary/90 break-all leading-tight mb-3">
                {message.signature}
              </div>
              <a
                href={`https://explorer.solana.com/tx/${message.signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 bg-primary text-black rounded-xl text-xs font-bold hover:translate-y-[-1px] transition-transform"
              >
                <span>View on Explorer</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        <div className="h-[3px] bg-white/5 w-full">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{
              duration: message.type === "success" ? 10 : 5,
              ease: "linear",
            }}
            className={`h-full ${message.type === "success" ? "bg-primary" : "bg-error"}`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
