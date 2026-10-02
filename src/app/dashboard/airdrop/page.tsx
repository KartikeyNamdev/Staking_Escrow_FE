"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Droplets, ExternalLink, FlaskConical, RefreshCcw } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ActivityRow } from "@/components/dashboard/ActivityRow";
import { ErrorPanel, SuccessPanel } from "@/components/dashboard/ResultPanel";
import {
  Card,
  EmptyState,
  Field,
  KeyValue,
  PageHeader,
  RequireWallet,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/dashboard/ui";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "@/hooks/useToast";
import { BACKEND_URL, describeError, formatSol, isValidAddress, networkLabel, shorten } from "@/lib/solana";

const AMOUNTS = ["0.5", "1", "2"];

export default function AirdropPage() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { history, record, balance } = useDashboard();
  const { settings, txUrl } = useSettings();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<ReturnType<typeof describeError> | null>(null);

  useEffect(() => {
    if (publicKey) setAddress(publicKey.toBase58());
  }, [publicKey]);

  const isMainnet = settings.network === "mainnet-beta";
  const amt = parseFloat(amount);
  const addressError = isValidAddress(address) ? null : "Not a valid Solana address";
  const amountError = isNaN(amt) || amt <= 0 || amt > 5 ? "Amount must be between 0.1 and 5 SOL" : null;

  // Devnet goes through the SolVault API; other test clusters hit the RPC faucet directly.
  const requestAirdrop = async (): Promise<string> => {
    if (settings.network === "devnet" && !settings.customRpc) {
      try {
        const res = await fetch(`${BACKEND_URL}/airdrop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicKey: address.trim(), amount }),
        });
        const data = await res.json();
        if (data.signature) return data.signature;
        throw new Error(data.message || data.error || "Airdrop failed");
      } catch (e) {
        if (!(e instanceof TypeError)) throw e; // only fall back when the API is unreachable
      }
    }
    const sig = await connection.requestAirdrop(new PublicKey(address.trim()), Math.round(amt * LAMPORTS_PER_SOL));
    const latest = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");
    return sig;
  };

  const handleAirdrop = async () => {
    if (addressError || amountError || isMainnet) return;
    setLoading(true);
    setError(null);
    try {
      const sig = await requestAirdrop();
      setSignature(sig);
      record({ action: `Airdropped ${amount} SOL`, type: "airdrop", to: address.trim(), amount, signature: sig });
      toast.success(`Airdropped ${amount} SOL`, `To: ${shorten(address.trim(), 6)}`, sig);
    } catch (e) {
      setError(describeError(e));
    } finally {
      setLoading(false);
    }
  };

  const airdrops = history.filter((h) => h.type === "airdrop");

  return (
    <RequireWallet>
      <PageHeader
        icon={<Droplets size={22} />}
        eyebrow="Faucet"
        title="Devnet Airdrop"
        description="Request free test SOL for development. Airdropped SOL only exists on test clusters and has no monetary value."
        action={
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest">
            <FlaskConical size={12} /> Test SOL only
          </span>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-3 sm:gap-5">
        <Card>
          {isMainnet ? (
            <EmptyState
              icon={<AlertTriangle size={28} />}
              title="Airdrops aren't available on Mainnet"
              description="There's no faucet for real SOL. Switch to Devnet or Testnet in Settings to claim test SOL."
              action={<Link href="/dashboard/settings" className={primaryButtonClass}>Open Settings</Link>}
            />
          ) : signature ? (
            <SuccessPanel
              title="Airdrop received"
              subtitle={`${amount} test SOL landed in ${shorten(address, 6)} on ${networkLabel(settings.network)}.`}
              actions={
                <>
                  <button onClick={() => setSignature("")} className={`${primaryButtonClass} flex-1`}>Request more</button>
                  <Link href="/dashboard/transfer" className={`${secondaryButtonClass} flex-1`}>Try a transfer</Link>
                </>
              }
            >
              <KeyValue label="Signature" value={signature} href={txUrl(signature)} />
            </SuccessPanel>
          ) : error ? (
            <ErrorPanel
              title={error.title}
              reason={error.reason}
              raw={error.raw}
              actions={
                <>
                  <button onClick={handleAirdrop} disabled={loading} className={`${primaryButtonClass} flex-1`}>
                    {loading ? <RefreshCcw className="animate-spin" size={18} /> : "Retry"}
                  </button>
                  <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer" className={`${secondaryButtonClass} flex-1`}>
                    Use faucet.solana.com <ExternalLink size={14} />
                  </a>
                </>
              }
            />
          ) : (
            <div className="flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Current balance</span>
                <span className="font-black text-white tabular-nums">{formatSol(balance)} SOL</span>
              </div>
              <Field label="Wallet Address" error={address ? addressError : null} hint="Defaults to your connected wallet.">
                <input
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={inputClass}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Field>
              <Field label="Amount (SOL)" error={amountError}>
                <div className="grid grid-cols-3 gap-2 mb-1">
                  {AMOUNTS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      className={`py-3 rounded-2xl text-sm font-black border transition-all active:scale-95 ${
                        amount === v ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                      }`}
                    >
                      {v} SOL
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className={inputClass}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Field>
              <button onClick={handleAirdrop} disabled={loading || !!addressError || !!amountError} className={`${primaryButtonClass} mt-2`}>
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin" size={18} /> Requesting & confirming…
                  </>
                ) : (
                  <>
                    <Droplets size={18} /> Claim {amount || 0} test SOL
                  </>
                )}
              </button>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-3 sm:gap-5">
          <Card>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Faucet limits</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/50 leading-relaxed">
              <li>• Public faucets usually cap requests at <span className="text-white/80">1–2 SOL</span>.</li>
              <li>• Requests are <span className="text-white/80">rate limited</span> per IP — wait a minute if one fails.</li>
              <li>• Test SOL can&apos;t be bridged or sold. It&apos;s for building only.</li>
            </ul>
            <a
              href="https://faucet.solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-primary/80 hover:text-primary"
            >
              Official Solana faucet <ExternalLink size={12} />
            </a>
          </Card>
          <Card>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Recent airdrops</h3>
            {airdrops.length === 0 ? (
              <p className="text-sm text-white/30">No airdrops yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {airdrops.slice(0, 3).map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </RequireWallet>
  );
}
