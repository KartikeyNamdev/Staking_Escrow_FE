"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, Database, Globe, LogOut, RefreshCcw, Settings, Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Card, Field, KeyValue, PageHeader, inputClass, secondaryButtonClass } from "@/components/dashboard/ui";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "@/hooks/useToast";
import { ExplorerKind, NETWORKS } from "@/lib/solana";

function SectionTitle({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 mb-5 sm:mb-6">
      <div className="w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/10 text-primary flex items-center justify-center">{icon}</div>
      <div>
        <h2 className="text-base font-black text-white uppercase tracking-tight">{title}</h2>
        <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, update, reset, endpoint } = useSettings();
  const { publicKey, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { history, clearHistory } = useDashboard();
  const [rpc, setRpc] = useState(settings.customRpc);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; text: string } | null>(null);

  const testRpc = async (url: string) => {
    setTesting(true);
    setTestResult(null);
    try {
      const conn = new Connection(url, "confirmed");
      const start = performance.now();
      const [version, slot] = await Promise.all([conn.getVersion(), conn.getSlot()]);
      setTestResult({
        ok: true,
        text: `Healthy · ${Math.round(performance.now() - start)}ms · solana-core ${version["solana-core"]} · slot ${slot.toLocaleString()}`,
      });
      return true;
    } catch {
      setTestResult({ ok: false, text: "Couldn't reach this endpoint. Check the URL and CORS settings." });
      return false;
    } finally {
      setTesting(false);
    }
  };

  const saveRpc = async () => {
    const url = rpc.trim();
    if (url && !/^https?:\/\//.test(url)) {
      setTestResult({ ok: false, text: "RPC URL must start with http:// or https://" });
      return;
    }
    if (url && !(await testRpc(url))) return;
    update({ customRpc: url });
    toast.success(url ? "Custom RPC saved" : "Using the public RPC");
  };

  return (
    <>
      <PageHeader
        icon={<Settings size={22} />}
        eyebrow="Preferences"
        title="Settings"
        description="Choose your cluster, bring your own RPC and manage your wallet. Preferences are saved on this device."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-5">
        {/* Network */}
        <Card className="xl:col-span-2">
          <SectionTitle icon={<Globe size={16} />} title="Network" desc="The cluster SolVault reads from and sends transactions to." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {NETWORKS.map((n) => {
              const active = settings.network === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    update({ network: n.id });
                    toast.info(`Switched to ${n.label}`, "Make sure your wallet uses the same network.");
                  }}
                  className={`relative text-left p-4 sm:p-5 rounded-2xl border transition-all active:scale-[0.98] ${
                    active ? "bg-primary/10 border-primary/40" : "bg-white/[0.03] border-white/10 hover:border-white/20"
                  }`}
                >
                  {active && (
                    <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary text-black flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                  <p className={`font-black uppercase tracking-tight ${active ? "text-primary" : "text-white"}`}>{n.label}</p>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed pr-6">{n.description}</p>
                </button>
              );
            })}
          </div>
          {settings.network === "mainnet-beta" && (
            <div className="flex gap-3 mt-4 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs leading-relaxed">
              <AlertTriangle size={16} className="shrink-0" />
              Mainnet transactions use real SOL and can&apos;t be reversed. The public mainnet RPC is heavily rate limited — a custom RPC is recommended.
            </div>
          )}
        </Card>

        {/* RPC */}
        <Card>
          <SectionTitle icon={<Database size={16} />} title="RPC Endpoint" desc="Power users can override the public endpoint with Helius, Triton, QuickNode or a local validator." />
          <Field label="Custom RPC URL" hint={`Currently using: ${endpoint}`}>
            <input
              type="url"
              inputMode="url"
              autoCapitalize="off"
              spellCheck={false}
              className={inputClass}
              placeholder="https://your-rpc.example.com"
              value={rpc}
              onChange={(e) => setRpc(e.target.value)}
            />
          </Field>
          {testResult && (
            <p className={`text-xs mt-3 px-1 ${testResult.ok ? "text-primary" : "text-error"}`}>{testResult.text}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-5">
            <button onClick={() => testRpc(rpc.trim() || endpoint)} disabled={testing} className={`${secondaryButtonClass} py-2.5! text-sm`}>
              {testing ? <RefreshCcw size={14} className="animate-spin" /> : null} Test
            </button>
            <button onClick={saveRpc} disabled={testing} className="px-5 py-2.5 rounded-2xl bg-primary text-black text-sm font-bold active:scale-95 transition-transform disabled:opacity-50">
              Save
            </button>
            {settings.customRpc && (
              <button
                onClick={() => {
                  setRpc("");
                  update({ customRpc: "" });
                  setTestResult(null);
                }}
                className="px-4 py-2.5 text-sm font-bold text-white/40 hover:text-white"
              >
                Reset to public
              </button>
            )}
          </div>
        </Card>

        {/* Explorer */}
        <Card>
          <SectionTitle icon={<Globe size={16} />} title="Block Explorer" desc="Where transaction and address links open." />
          <div className="grid grid-cols-2 gap-3">
            {([
              ["solana", "Solana Explorer", "explorer.solana.com"],
              ["solscan", "Solscan", "solscan.io"],
            ] as [ExplorerKind, string, string][]).map(([id, label, host]) => (
              <button
                key={id}
                onClick={() => update({ explorer: id })}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  settings.explorer === id ? "bg-primary/10 border-primary/40" : "bg-white/[0.03] border-white/10 hover:border-white/20"
                }`}
              >
                <p className={`font-bold text-sm ${settings.explorer === id ? "text-primary" : "text-white"}`}>{label}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{host}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Wallet */}
        <Card>
          <SectionTitle icon={<Wallet size={16} />} title="Wallet" desc="SolVault never stores your keys. Disconnecting only ends this session." />
          {publicKey ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {wallet?.adapter.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={wallet.adapter.icon} alt="" className="w-9 h-9 rounded-xl" />
                )}
                <p className="font-bold text-white">{wallet?.adapter.name}</p>
              </div>
              <KeyValue label="Connected address" value={publicKey.toBase58()} />
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setVisible(true)} className={`${secondaryButtonClass} py-2.5! text-sm`}>Change wallet</button>
                <button
                  onClick={() => disconnect()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-error/10 text-error text-sm font-bold hover:bg-error/20 transition-colors"
                >
                  <LogOut size={14} /> Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setVisible(true)} className="px-5 py-3 rounded-2xl bg-primary text-black text-sm font-bold">
              Connect wallet
            </button>
          )}
        </Card>

        {/* Data */}
        <Card>
          <SectionTitle icon={<Database size={16} />} title="Local Data" desc="Activity history and preferences live in this browser only." />
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-4">
            <span className="text-sm text-white/60">Saved activities</span>
            <span className="font-black text-white tabular-nums">{history.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => confirm("Clear all local activity history?") && clearHistory()}
              disabled={history.length === 0}
              className="px-5 py-2.5 rounded-2xl bg-error/10 text-error text-sm font-bold hover:bg-error/20 disabled:opacity-40 transition-colors"
            >
              Clear history
            </button>
            <button
              onClick={() => {
                reset();
                setRpc("");
                toast.info("Preferences reset", "Back to Devnet with the public RPC.");
              }}
              className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              Reset preferences
            </button>
          </div>
          <p className="text-[11px] text-white/25 mt-6">
            SolVault v1.0 beta ·{" "}
            <Link href="/docs" className="hover:text-white">Docs</Link> ·{" "}
            <Link href="/about" className="hover:text-white">About</Link> ·{" "}
            <Link href="/pricing" className="hover:text-white">Roadmap</Link>
          </p>
        </Card>
      </div>
    </>
  );
}
