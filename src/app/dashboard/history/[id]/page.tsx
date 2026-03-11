"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Clock,
  Hash,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HistoryItem } from "@/types/dashboard";

export default function ActivityDetailPage() {
  const params = useParams();
  const [activity, setActivity] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedHistory = localStorage.getItem("solvault_history");
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        const item = history.find((h: any) => h.id.toString() === params.id);
        setActivity(item);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    setLoading(false);
  }, [params.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) return null;

  if (!activity) {
    return (
      <div className="min-h-screen p-8 max-w-3xl mx-auto flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold text-white">Activity Not Found</h2>
        <p className="text-white/40">
          This transaction might have been cleared from your history.
        </p>
        <Link
          href="/dashboard"
          className="bg-primary text-black font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto font-sans">
      <header className="flex items-center gap-6 mb-12">
        <Link
          href="/dashboard"
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-white hover:bg-white/10 hover:-translate-x-1 transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-3xl font-black tracking-tighter">
          Transaction Details
        </h1>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8 relative z-10">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center 
            ${
              activity.type === "transfer"
                ? "bg-primary/10 text-primary"
                : activity.type === "airdrop"
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-orange-500/10 text-orange-500"
            }`}
          >
            {activity.type === "transfer" ? (
              <ArrowUpRight size={32} />
            ) : activity.type === "airdrop" ? (
              <ArrowDownLeft size={32} />
            ) : (
              <Zap size={32} />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
              <CheckCircle2 size={12} />
              <span>Confirmed</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              {activity.action}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-10 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
              <Clock size={12} />
              <span>Timestamp</span>
            </div>
            <div className="text-lg font-medium text-white/90">
              {new Date(activity.timestamp).toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "medium",
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
              <Hash size={12} />
              <span>Signature / ID</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between gap-4 group">
              <code className="font-mono text-xs md:text-sm text-primary break-all leading-tight">
                {activity.signature || activity.result}
              </code>
              <button
                onClick={() =>
                  copyToClipboard(activity.signature || activity.result || "")
                }
                className="text-white/20 hover:text-white transition-colors flex-shrink-0"
                title="Copy Signature"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {(activity.from || activity.to) && (
            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                Participating Wallets
              </h3>
              <div className="flex flex-col gap-6 bg-white/2 p-6 rounded-[24px]">
                {activity.from && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-white/30">
                      Sender
                    </div>
                    <div className="flex items-center gap-3 font-mono text-sm break-all text-white/70">
                      <User size={14} className="opacity-30" />
                      <span>{activity.from}</span>
                    </div>
                  </div>
                )}
                {activity.to && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-primary/40 uppercase tracking-tighter">
                      Recipient
                    </div>
                    <div className="flex items-center gap-3 font-mono text-sm break-all text-primary/80">
                      <User size={14} className="opacity-30" />
                      <span>{activity.to}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activity.amount && (
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                <ShieldCheck size={12} />
                <span>Value transferred</span>
              </div>
              <div className="text-5xl font-black text-white flex items-baseline gap-3">
                {activity.amount}{" "}
                <span className="text-2xl font-black text-white/20">SOL</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 relative z-10">
          <a
            href={`https://explorer.solana.com/tx/${activity.signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-100 transition-all shadow-[0_0_30px_rgba(20,241,149,0.2)]"
          >
            <ExternalLink size={20} />
            Check on Solana Explorer
          </a>
        </div>
      </motion.div>
    </main>
  );
}
