"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Overview } from "@/components/dashboard/Overview";
import { Transfer } from "@/components/dashboard/Transfer";
import { Airdrop } from "@/components/dashboard/Airdrop";
import { Tools } from "@/components/dashboard/Tools";
import { History } from "@/components/dashboard/History";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Toast } from "@/components/ui/Toast";

export default function DashboardPage() {
  const {
    publicKey,
    setPublicKey,
    balance,
    loading,
    activeTab,
    setActiveTab,
    message,
    setMessage,
    history,
    fetchBalance,
    showNotification,
    clearHistory,
    copyToClipboard,
    BACKEND_URL,
  } = useDashboard();

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6 md:gap-14">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 hover:-translate-x-0.5 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3 font-extrabold text-xl tracking-tighter">
            <Zap size={20} className="text-primary" />
            <span>SOLVAULT</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-xs text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-bold uppercase tracking-wider">Devnet</span>
          </div>
          <div className="wallet-button-wrapper">
            <WalletMultiButton />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <section className="min-h-[500px]">
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
        </section>
      </div>

      <Toast
        message={message}
        // onClose={() => setMessage({ text: "", type: "", signature: undefined })}
        onCopy={copyToClipboard}
      />
    </main>
  );
}
