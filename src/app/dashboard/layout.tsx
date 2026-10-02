"use client";

import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardProvider } from "@/components/dashboard/DashboardProvider";
import { WalletButton } from "@/components/WalletButton";
import { useSettings } from "@/context/SettingsContext";
import { networkLabel } from "@/lib/solana";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const isMainnet = settings.network === "mainnet-beta";

  return (
    <DashboardProvider>
      <main className="min-h-dvh bg-background relative overflow-x-clip font-sans selection:bg-primary/30">
        <VideoBackground src="/video.mp4" overlayOpacity={0.92} className="fixed! opacity-50" />

        <div className="relative z-10 px-4 pt-4 sm:px-6 md:p-8 max-w-7xl mx-auto min-h-dvh flex flex-col">
          <header className="flex justify-between items-center gap-3 mb-5 md:mb-12 md:pt-4">
            <div className="flex items-center gap-3 md:gap-14 min-w-0">
              <Link
                href="/"
                aria-label="Back to home"
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 hover:-translate-x-0.5 active:scale-95 transition-all"
              >
                <ArrowLeft size={18} />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 md:gap-3 font-extrabold text-lg md:text-xl tracking-tighter min-w-0"
              >
                <Zap size={20} className="text-primary shrink-0" />
                <span className="hidden min-[360px]:inline truncate">SOLVAULT</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/dashboard/settings"
                title="Change network"
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs border transition-all ${
                  isMainnet
                    ? "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/15"
                    : "bg-primary/5 border-primary/10 text-primary hover:bg-primary/10"
                }`}
              >
                <div className={`w-2 h-2 rounded-full animate-pulse ${isMainnet ? "bg-orange-400" : "bg-primary shadow-[0_0_8px_var(--primary)]"}`} />
                <span className="font-bold uppercase tracking-wider">{networkLabel(settings.network)}</span>
              </Link>
              <div className="wallet-button-wrapper">
                <WalletButton />
              </div>
            </div>
          </header>

          {isMainnet && (
            <div className="mb-5 md:mb-8 px-4 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs sm:text-sm">
              <span className="font-bold">Mainnet mode:</span> transactions move real funds. Make sure your wallet is on Mainnet too.
            </div>
          )}

          <div className="flex-1 grid grid-cols-1 grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-5 md:gap-10 lg:gap-14 pb-10 md:pb-20">
            <div className="sticky top-3 z-30 self-start md:top-8 space-y-6 min-w-0">
              <Sidebar />

              <Link
                href="/dashboard/settings"
                className="hidden md:block p-5 bg-white/5 border border-white/10 rounded-[28px] overflow-hidden relative group hover:border-primary/20 transition-colors"
              >
                <VideoBackground src="/video5.mp4" overlayOpacity={0.95} className="opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-2">Cluster</p>
                  <p className="text-lg font-bold text-white tracking-tighter">{networkLabel(settings.network)}</p>
                  <p className="text-[11px] text-white/30 mt-1 truncate">
                    {settings.customRpc ? "Custom RPC" : "Public RPC"} · Change in Settings
                  </p>
                </div>
              </Link>
            </div>

            <section className="relative min-w-0">{children}</section>
          </div>
        </div>
      </main>
    </DashboardProvider>
  );
}
