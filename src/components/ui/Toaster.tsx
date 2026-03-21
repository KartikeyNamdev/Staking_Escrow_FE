"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toastStore, ToastMessage } from "@/hooks/useToast";
import { CheckCircle2, AlertCircle, RefreshCcw, Copy, ExternalLink, X, Info } from "lucide-react";

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((t) => {
      setToasts([...t].reverse());
    });
    return () => { unsubscribe(); };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed top-8 right-8 z-1000 flex flex-col gap-4 w-[380px] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <div className="relative group bg-black/95 backdrop-blur-2xl border border-white/10 rounded-[28px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
              {/* Highlight Gradient */}
              <div className={`absolute -top-12 -left-12 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors
                ${toast.type === "success" ? "bg-primary" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"}
              `} />
              
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start gap-4">
                  {/* Icon Section */}
                  <div className={`mt-0.5 p-2 rounded-xl border
                    ${toast.type === "success" ? "bg-primary/5 border-primary/20 text-primary" : 
                      toast.type === "error" ? "bg-red-500/5 border-red-500/20 text-red-500" : 
                      toast.type === "info" ? "bg-blue-500/5 border-blue-500/20 text-blue-500" :
                      "bg-white/5 border-white/10 text-white"}
                  `}>
                    {toast.type === "success" && <CheckCircle2 size={18} />}
                    {toast.type === "error" && <AlertCircle size={18} />}
                    {toast.type === "info" && <Info size={18} />}
                    {toast.type === "loading" && <RefreshCcw size={18} className="animate-spin" />}
                  </div>

                  <div className="grow">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">
                      {toast.title}
                    </h4>
                    {toast.description && (
                      <p className="text-xs text-white/40 leading-relaxed">
                        {toast.description}
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={() => toastStore.remove(toast.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/5 rounded-lg text-white/50"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Optional Signature Section */}
                {toast.signature && (
                  <div className="mt-1 bg-white/3 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-mono text-white/50 uppercase">Success</span>
                      </div>
                      <button 
                         onClick={() => copyToClipboard(toast.signature!)}
                         className="p-1.5 hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                    <code className="text-[11px] font-mono text-primary/70 break-all leading-tight px-1">
                      {toast.signature}
                    </code>
                    <a 
                      href={`https://explorer.solana.com/tx/${toast.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                      <ExternalLink size={10} />
                      <span>Verify on Solana</span>
                    </a>
                  </div>
                )}
              </div>
              
              {/* Progress/Duration Bar */}
              {toast.type !== "loading" && (
                <div className="h-0.5 bg-white/5 w-full">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className={`h-full opacity-50
                      ${toast.type === "success" ? "bg-primary" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"}
                    `}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
