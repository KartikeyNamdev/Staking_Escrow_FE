"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Overview } from "@/components/dashboard/Overview";
import { Transfer } from "@/components/dashboard/Transfer";
import { Airdrop } from "@/components/dashboard/Airdrop";
import { Tools } from "@/components/dashboard/Tools";
import { History } from "@/components/dashboard/History";
import dynamic from "next/dynamic";
import { Toast } from "@/components/ui/Toast";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export default function DashboardPage() {
  const {
    publicKey,
    setPublicKey,
    balance,
    loading,
    activeTab,
    setActiveTab,
    history,
    fetchBalance,
    showNotification,
    clearHistory,
    copyToClipboard,
    BACKEND_URL,
  } = useDashboard();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Cinematic Background */}
      <VideoBackground
        src="/video.mp4"
        overlayOpacity={0.92}
        className="opacity-50 pointer-events-none"
      />

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        <header className="flex justify-between items-center mb-16 pt-4">
        <div className="flex items-center gap-6 md:gap-14">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 hover:-translate-x-0.5 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3 font-extrabold text-xl tracking-tighter">
            <Zap size={20} className="text-primary" />
            <Link href="/">SOLVAULT</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-xs text-primary transition-all hover:bg-primary/10">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]" />
            <span className="font-bold uppercase tracking-wider">Devnet</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 uppercase tracking-widest">
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-orange-500 animate-pulse' : 'bg-primary'}`} />
            <span>Ready</span>
          </div>
          <div className="wallet-button-wrapper">
            <WalletMultiButtonDynamic />
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-16 pb-20">
        <div className="space-y-8">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="hidden md:block p-6 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden relative group">
            <VideoBackground src="/video5.mp4" overlayOpacity={0.95} className="opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative z-10 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-2">Vault Status</p>
              <p className="text-xl font-bold text-white tracking-tighter">SECURE</p>
            </div>
          </div>
        </div>

        <section className="min-h-[500px] relative">
          <AnimatePresence mode="wait">
            {!publicKey ? (
              <motion.div
                key="connect-prompt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/2 border border-white/5 rounded-[40px] backdrop-blur-xl"
              >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary shadow-[0_0_40px_rgba(20,241,149,0.1)]">
                  <Zap size={48} className="animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                  Secure Access Required
                </h2>
                <p className="max-w-md text-white/40 mb-10 text-sm leading-relaxed">
                  Your SolVault is currently locked. Connect your Solana wallet to access your autonomous agents and secure vault assets.
                </p>
                <div className="scale-110">
                  <WalletMultiButtonDynamic />
                </div>
              </motion.div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <Overview
                    key="overview"
                    publicKey={publicKey}
                    setPublicKey={setPublicKey}
                    balance={balance}
                    loading={loading}
                    onQuery={fetchBalance}
                  />
                )}

                {activeTab === "transfer" && (
                  <Transfer
                    key="transfer"
                    onNotify={showNotification}
                    backendUrl={BACKEND_URL}
                  />
                )}

                {activeTab === "airdrop" && (
                  <Airdrop
                    key="airdrop"
                    onNotify={showNotification}
                    backendUrl={BACKEND_URL}
                  />
                )}

                {activeTab === "tools" && (
                  <Tools
                    key="tools"
                    onNotify={showNotification}
                    backendUrl={BACKEND_URL}
                  />
                )}

                {activeTab === "history" && (
                  <History
                    key="history"
                    history={history}
                    onClear={clearHistory}
                    onCopy={copyToClipboard}
                  />
                )}
              </>
            )}
          </AnimatePresence>
        </section>
      </div>
      </div>
    </main>
  );
}
