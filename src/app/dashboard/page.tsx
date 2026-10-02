"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Coins,
  Droplets,
  History as HistoryIcon,
  Layers,
  LayoutGrid,
  LogOut,
  RefreshCcw,
  Send,
} from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VideoBackground } from "@/components/ui/VideoBackground";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ActivityRow } from "@/components/dashboard/ActivityRow";
import {
  Card,
  EmptyState,
  KeyValue,
  PageHeader,
  RequireWallet,
  StatTile,
} from "@/components/dashboard/ui";
import { useSettings } from "@/context/SettingsContext";
import { formatSol, networkLabel, shorten } from "@/lib/solana";

const quickActions = [
  { href: "/dashboard/transfer", icon: Send, title: "Transfer SOL", desc: "Review fees, then sign" },
  { href: "/dashboard/airdrop", icon: Droplets, title: "Devnet Airdrop", desc: "Free test SOL" },
  { href: "/dashboard/mint", icon: Coins, title: "Mint a Token", desc: "Create an SPL mint" },
  { href: "/dashboard/tokens", icon: Layers, title: "Token Accounts", desc: "ATAs & balances" },
];

function NetworkStatus() {
  const { connection } = useConnection();
  const { settings } = useSettings();
  const [info, setInfo] = useState<{ epoch: number; slot: number; progress: number; latency: number } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const start = performance.now();
        const e = await connection.getEpochInfo();
        if (cancelled) return;
        setInfo({
          epoch: e.epoch,
          slot: e.absoluteSlot,
          progress: (e.slotIndex / e.slotsInEpoch) * 100,
          latency: Math.round(performance.now() - start),
        });
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [connection]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">Network Status</h3>
        <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${error ? "text-error" : "text-primary"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${error ? "bg-error" : "bg-primary animate-pulse"}`} />
          {error ? "Unreachable" : networkLabel(settings.network)}
        </span>
      </div>
      {info ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Epoch</p>
              <p className="font-black text-white tabular-nums">{info.epoch}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Slot</p>
              <p className="font-black text-white tabular-nums truncate">{info.slot.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">RPC</p>
              <p className="font-black text-white tabular-nums">{info.latency}ms</p>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest mb-2">
            <span>Epoch progress</span>
            <span className="tabular-nums">{info.progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-[width] duration-700" style={{ width: `${info.progress}%` }} />
          </div>
        </>
      ) : error ? (
        <p className="text-sm text-white/40">
          Couldn&apos;t reach the RPC endpoint.{" "}
          <Link href="/dashboard/settings" className="text-primary font-bold">Check Settings</Link>
        </p>
      ) : (
        <div className="space-y-3">
          <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-1.5 bg-white/5 rounded-full animate-pulse" />
        </div>
      )}
    </Card>
  );
}

export default function DashboardHome() {
  const { publicKey, wallet, disconnect } = useWallet();
  const { history, balance, balanceLoading, balanceError, refreshBalance } = useDashboard();
  const { addressUrl, settings } = useSettings();
  const address = publicKey?.toBase58() ?? "";

  const stats = useMemo(() => {
    const sum = (type: string) =>
      history
        .filter((h) => h.type === type)
        .reduce((acc, h) => acc + (parseFloat(String(h.amount ?? 0)) || 0), 0);
    return {
      total: history.length,
      sent: sum("transfer"),
      airdropped: sum("airdrop"),
      mints: history.filter((h) => h.type === "mint").length,
    };
  }, [history]);

  const checklist = [
    { label: "Connect a wallet", done: !!publicKey, href: "/dashboard" },
    { label: "Get test SOL from the faucet", done: stats.airdropped > 0 || (balance ?? 0) > 0, href: "/dashboard/airdrop" },
    { label: "Send your first transfer", done: history.some((h) => h.type === "transfer"), href: "/dashboard/transfer" },
    { label: "Mint your first SPL token", done: stats.mints > 0, href: "/dashboard/mint" },
  ];
  const completed = checklist.filter((c) => c.done).length;

  return (
    <RequireWallet>
      <PageHeader
        icon={<LayoutGrid size={22} />}
        eyebrow="Dashboard"
        title="Welcome back"
        description={`Connected as ${shorten(address, 6)} on ${networkLabel(settings.network)}.`}
      />

      {/* Balance + wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 sm:gap-5 mb-3 sm:mb-5">
        <div className="relative overflow-hidden bg-linear-to-br from-primary/15 via-white/5 to-transparent border border-primary/20 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 group">
          <VideoBackground src="/video.mp4" overlayOpacity={0.7} className="opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live balance
              </span>
              <button
                onClick={refreshBalance}
                disabled={balanceLoading}
                aria-label="Refresh balance"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white active:scale-90 transition-all"
              >
                <RefreshCcw size={14} className={balanceLoading ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="text-5xl sm:text-6xl font-black text-primary tracking-tighter tabular-nums break-all">
              {balance === null ? (
                <span className="inline-block h-14 w-48 bg-white/5 rounded-2xl animate-pulse align-middle" />
              ) : (
                formatSol(balance)
              )}
              <span className="text-xl sm:text-2xl text-white/40 ml-3">SOL</span>
            </div>
            {balanceError && <p className="text-xs text-error mt-3">{balanceError}</p>}
            <div className="flex flex-wrap gap-2 mt-8">
              <Link href="/dashboard/transfer" className="px-4 py-2.5 bg-primary text-black rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-transform flex items-center gap-2">
                <Send size={14} /> Send
              </Link>
              <Link href="/dashboard/airdrop" className="px-4 py-2.5 bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-white/15 active:scale-95 transition-all flex items-center gap-2">
                <Droplets size={14} /> Airdrop
              </Link>
            </div>
          </div>
        </div>

        <Card className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            {wallet?.adapter.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={wallet.adapter.icon} alt="" className="w-10 h-10 rounded-xl" />
            )}
            <div className="min-w-0">
              <p className="font-bold text-white">{wallet?.adapter.name ?? "Wallet"}</p>
              <p className="text-xs text-white/40">Connected · {networkLabel(settings.network)}</p>
            </div>
          </div>
          <KeyValue label="Address" value={address} href={addressUrl(address)} />
          <button
            onClick={() => disconnect()}
            className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white/60 hover:text-error hover:border-error/30 transition-all"
          >
            <LogOut size={16} /> Disconnect
          </button>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-3 sm:mb-5">
        <StatTile label="Transactions" value={stats.total} sub="Through SolVault" icon={<Activity size={14} />} />
        <StatTile label="SOL Sent" value={formatSol(stats.sent, 3)} sub="All transfers" icon={<ArrowUpRight size={14} />} />
        <StatTile label="SOL Airdropped" value={formatSol(stats.airdropped, 2)} sub="Test SOL claimed" icon={<Droplets size={14} />} />
        <StatTile label="Tokens Minted" value={stats.mints} sub="SPL mints created" icon={<Coins size={14} />} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-3 sm:mb-5">
        {quickActions.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group relative bg-white/[0.03] border border-white/10 rounded-[20px] sm:rounded-[28px] p-4 sm:p-6 hover:bg-white/[0.06] hover:border-primary/30 hover:-translate-y-1 active:scale-[0.98] transition-all overflow-hidden"
          >
            <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
              <Icon size={20} />
            </div>
            <h3 className="font-black text-white text-sm sm:text-base uppercase tracking-tight">{title}</h3>
            <p className="text-[11px] sm:text-xs text-white/30 mt-1">{desc}</p>
            <ArrowRight size={16} className="absolute top-5 right-5 text-white/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Activity + onboarding */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-3 sm:gap-5">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Recent Activity</h3>
            <Link href="/dashboard/history" className="text-xs font-bold text-primary/80 hover:text-primary flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {history.length === 0 ? (
            <EmptyState
              icon={<HistoryIcon size={28} />}
              title="No activity yet"
              description="Transactions you make through SolVault show up here, each linked to the explorer."
              action={
                <Link href="/dashboard/airdrop" className="text-xs font-black uppercase tracking-widest text-primary">
                  Start with an airdrop →
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col gap-2">
              {history.slice(0, 5).map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-3 sm:gap-5">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Getting Started</h3>
              <span className="text-xs font-bold text-white/40 tabular-nums">{completed}/{checklist.length}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
              <div className="h-full bg-primary rounded-full transition-[width] duration-700" style={{ width: `${(completed / checklist.length) * 100}%` }} />
            </div>
            <ul className="flex flex-col gap-1">
              {checklist.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="flex items-center gap-3 px-2 py-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors">
                    {c.done ? <CheckCircle2 size={18} className="text-primary shrink-0" /> : <Circle size={18} className="text-white/20 shrink-0" />}
                    <span className={`text-sm ${c.done ? "text-white/40 line-through" : "text-white/80"}`}>{c.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <NetworkStatus />
        </div>
      </div>
    </RequireWallet>
  );
}
