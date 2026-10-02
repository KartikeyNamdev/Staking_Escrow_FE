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

  const tabTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <main className="min-h-dvh bg-background relative overflow-x-clip font-sans selection:bg-primary/30">
      {/* Cinematic Background */}
      <VideoBackground
        src="/video.mp4"
        overlayOpacity={0.92}
        className="fixed! opacity-50"
      />

      <div className="relative z-10 px-4 pt-4 sm:px-6 md:p-8 max-w-7xl mx-auto min-h-dvh flex flex-col">
        <header className="flex justify-between items-center gap-3 mb-5 md:mb-16 md:pt-4">
          <div className="flex items-center gap-3 md:gap-14 min-w-0">
            <Link
              href="/"
              aria-label="Back to home"
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 hover:-translate-x-0.5 active:scale-95 transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 md:gap-3 font-extrabold text-lg md:text-xl tracking-tighter min-w-0"
            >
              <Zap size={20} className="text-primary shrink-0" />
              <span className="hidden min-[360px]:inline truncate">SOLVAULT</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 shrink-0">
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

        <div className="flex-1 grid grid-cols-1 grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] gap-5 md:gap-10 lg:gap-16 pb-10 md:pb-20">
          <div className="sticky top-3 z-30 self-start md:top-8 space-y-8">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="hidden md:block p-6 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden relative group">
              <VideoBackground src="/video5.mp4" overlayOpacity={0.95} className="opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative z-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-2">Vault Status</p>
                <p className="text-xl font-bold text-white tracking-tighter">SECURE</p>
              </div>
            </div>
          </div>

          <section className="md:min-h-[500px] relative min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              {!publicKey ? (
                <motion.div
                  key="connect-prompt"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full flex flex-col items-center justify-center text-center px-6 py-10 sm:p-12 bg-white/2 border border-white/5 rounded-[28px] sm:rounded-[40px] backdrop-blur-md"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 sm:mb-8 text-primary shadow-[0_0_40px_rgba(20,241,149,0.1)]">
                    <Zap size={40} className="animate-pulse sm:size-12" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4 text-balance">
                    Secure Access Required
                  </h2>
                  <p className="max-w-md text-white/40 mb-8 sm:mb-10 text-sm leading-relaxed text-pretty">
                    Your SolVault is currently locked. Connect your Solana wallet to access your autonomous agents and secure vault assets.
                  </p>
                  <div className="sm:scale-110">
                    <WalletMultiButtonDynamic />
                  </div>
                </motion.div>
              ) : (
                <motion.div key={activeTab} {...tabTransition}>
                  {activeTab === "overview" && (
                    <Overview
                      publicKey={publicKey}
                      setPublicKey={setPublicKey}
                      balance={balance}
                      loading={loading}
                      onQuery={fetchBalance}
                    />
                  )}

                  {activeTab === "transfer" && (
                    <Transfer onNotify={showNotification} backendUrl={BACKEND_URL} />
                  )}

                  {activeTab === "airdrop" && (
                    <Airdrop onNotify={showNotification} backendUrl={BACKEND_URL} />
                  )}

                  {activeTab === "tools" && (
                    <Tools onNotify={showNotification} backendUrl={BACKEND_URL} />
                  )}

                  {activeTab === "history" && (
                    <History
                      history={history}
                      onClear={clearHistory}
                      onCopy={copyToClipboard}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
}
