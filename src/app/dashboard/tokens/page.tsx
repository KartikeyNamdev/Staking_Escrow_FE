"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, Calculator, Layers, PlusCircle, RefreshCcw } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import {
  Card,
  CopyButton,
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
import {
  BACKEND_URL,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  describeError,
  findAssociatedTokenAddress,
  isValidAddress,
  shorten,
} from "@/lib/solana";

interface TokenRow {
  address: string;
  mint: string;
  amount: string;
  decimals: number;
  program: "Token" | "Token-2022";
  isAta: boolean;
}

function AtaCalculator({ defaultOwner }: { defaultOwner: string }) {
  const { connection } = useConnection();
  const { addressUrl } = useSettings();
  const [owner, setOwner] = useState(defaultOwner);
  const [mint, setMint] = useState("");
  const [program, setProgram] = useState<"token" | "token2022">("token");
  const [exists, setExists] = useState<boolean | null>(null);

  const derived = useMemo(() => {
    if (!isValidAddress(owner) || !isValidAddress(mint)) return null;
    const programId = program === "token" ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID;
    const [ata, bump] = findAssociatedTokenAddress(new PublicKey(owner.trim()), new PublicKey(mint.trim()), programId);
    return { ata: ata.toBase58(), bump };
  }, [owner, mint, program]);

  useEffect(() => {
    setExists(null);
    if (!derived) return;
    let cancelled = false;
    connection
      .getAccountInfo(new PublicKey(derived.ata))
      .then((info) => !cancelled && setExists(!!info))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [derived, connection]);

  return (
    <Card>
      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white mb-2">
        <Calculator size={14} className="text-primary" /> ATA Derivation
      </h3>
      <p className="text-sm text-white/40 mb-6 leading-relaxed">
        An Associated Token Account is a PDA of the Associated Token Program, seeded by{" "}
        <code className="text-white/70">[owner, tokenProgram, mint]</code>. Same inputs → same address, every time.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Field label="Owner">
          <input className={inputClass} spellCheck={false} autoCapitalize="off" value={owner} onChange={(e) => setOwner(e.target.value)} />
        </Field>
        <Field label="Mint">
          <input className={inputClass} spellCheck={false} autoCapitalize="off" placeholder="Mint address" value={mint} onChange={(e) => setMint(e.target.value)} />
        </Field>
      </div>
      <div className="flex gap-2 mb-6">
        {(["token", "token2022"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setProgram(p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              program === p ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {p === "token" ? "Token Program" : "Token-2022"}
          </button>
        ))}
      </div>

      {/* Seeds visual */}
      <div className="grid grid-cols-3 gap-2 text-center mb-2">
        {[
          ["owner", owner],
          ["token program", program === "token" ? TOKEN_PROGRAM_ID.toBase58() : TOKEN_2022_PROGRAM_ID.toBase58()],
          ["mint", mint],
        ].map(([label, v]) => (
          <div key={label} className="rounded-xl bg-white/[0.03] border border-white/5 px-2 py-2.5 min-w-0">
            <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">{label}</p>
            <p className="font-mono text-[11px] text-white/70 truncate">{v ? shorten(v.trim(), 4) : "—"}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center text-white/20 my-2">
        <ArrowDown size={16} />
      </div>

      {derived ? (
        <div className="flex flex-col gap-3">
          <KeyValue label={`Derived ATA · bump ${derived.bump}`} value={derived.ata} href={addressUrl(derived.ata)} />
          <span
            className={`self-start px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              exists === null ? "bg-white/5 text-white/40" : exists ? "bg-primary/10 text-primary" : "bg-orange-500/10 text-orange-400"
            }`}
          >
            {exists === null ? "Checking…" : exists ? "Account exists on-chain" : "Not created yet"}
          </span>
        </div>
      ) : (
        <p className="text-center text-sm text-white/30 py-3">Enter a valid owner and mint to derive the address.</p>
      )}
    </Card>
  );
}

export default function TokensPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { history, record } = useDashboard();
  const { addressUrl, txUrl } = useSettings();
  const [rows, setRows] = useState<TokenRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newAccount, setNewAccount] = useState<{ address: string; signature: string } | null>(null);

  const names = useMemo(() => {
    const map: Record<string, { name?: string; symbol?: string }> = {};
    history.filter((h) => h.mint).forEach((h) => (map[h.mint!] = { name: h.name, symbol: h.symbol }));
    return map;
  }, [history]);

  const load = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    setLoadError(null);
    try {
      const results = await Promise.all(
        [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID].map((programId) =>
          connection.getParsedTokenAccountsByOwner(publicKey, { programId }),
        ),
      );
      const all: TokenRow[] = results.flatMap((res, i) =>
        res.value.map(({ pubkey, account }) => {
          const info = account.data.parsed.info;
          const programId = i === 0 ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID;
          const [ata] = findAssociatedTokenAddress(publicKey, new PublicKey(info.mint), programId);
          return {
            address: pubkey.toBase58(),
            mint: info.mint,
            amount: info.tokenAmount.uiAmountString ?? "0",
            decimals: info.tokenAmount.decimals,
            program: i === 0 ? "Token" : "Token-2022",
            isAta: ata.equals(pubkey),
          } as TokenRow;
        }),
      );
      setRows(all);
    } catch (e) {
      setLoadError(describeError(e).reason);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    load();
  }, [load]);

  const createAccount = async () => {
    if (!publicKey) return;
    setCreating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/createAccount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payer: publicKey.toBase58() }),
      });
      const data = await res.json();
      if (!data.transaction) throw new Error(data.error || "SolVault API couldn't prepare the transaction");
      const tx = Transaction.from(Uint8Array.from(atob(data.transaction), (c) => c.charCodeAt(0)));
      const sig = await sendTransaction(tx, connection);
      setNewAccount({ address: data.newAccount, signature: sig });
      record({ action: "Created System Account", type: "tool", result: data.newAccount, signature: sig });
      toast.success("Account created", shorten(data.newAccount, 6), sig);
    } catch (e) {
      const d = describeError(e);
      toast.error(d.title, d.reason);
    } finally {
      setCreating(false);
    }
  };

  return (
    <RequireWallet>
      <PageHeader
        icon={<Layers size={22} />}
        eyebrow="Explorer"
        title="Token Accounts"
        description="Every SPL token account owned by your wallet, across the Token and Token-2022 programs."
        action={
          <button onClick={load} disabled={loading} className={`${secondaryButtonClass} py-2.5! text-sm`}>
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:gap-5">
        <Card className="p-3! sm:p-6!">
          {rows === null && loading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : loadError ? (
            <EmptyState
              icon={<Layers size={28} />}
              title="Couldn't load token accounts"
              description={`${loadError} Public mainnet RPCs often block this call — try a custom RPC in Settings.`}
              action={<button onClick={load} className={primaryButtonClass}>Retry</button>}
            />
          ) : !rows || rows.length === 0 ? (
            <EmptyState
              icon={<Layers size={28} />}
              title="No token accounts yet"
              description="Mint your first SPL token and its associated token account will show up here."
              action={<Link href="/dashboard/mint" className={primaryButtonClass}>Mint a token</Link>}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="hidden md:grid grid-cols-[1.4fr_1fr_1fr_auto] gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                <span>Token</span>
                <span>Account</span>
                <span className="text-right">Balance</span>
                <span className="w-8" />
              </div>
              {rows.map((r) => {
                const meta = names[r.mint];
                return (
                  <div
                    key={r.address}
                    className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1.4fr_1fr_1fr_auto] items-center gap-3 md:gap-4 p-3 md:px-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 md:col-auto">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-primary/40 to-purple-500/40 flex items-center justify-center font-black text-white">
                        {(meta?.symbol ?? r.mint).slice(0, 1)}
                      </div>
                      <div className="min-w-0 hidden md:block">
                        <p className="font-bold text-sm text-white truncate">{meta?.name ?? shorten(r.mint, 6)}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{r.program}</span>
                          {r.isAta && <span className="text-[9px] font-black uppercase tracking-widest text-primary/70">ATA</span>}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 md:hidden">
                      <p className="font-bold text-sm text-white truncate">{meta?.name ?? shorten(r.mint, 4)}</p>
                      <p className="text-[10px] text-white/30 font-mono truncate">
                        {r.program}
                        {r.isAta ? " · ATA" : ""} · {shorten(r.address, 4)}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-1 min-w-0">
                      <a href={addressUrl(r.address)} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-white/60 hover:text-primary truncate">
                        {shorten(r.address, 6)}
                      </a>
                      <CopyButton value={r.address} />
                    </div>
                    <div className="text-right min-w-0">
                      <p className="font-black text-white tabular-nums truncate">{Number(r.amount).toLocaleString(undefined, { maximumFractionDigits: r.decimals })}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">{meta?.symbol ?? `${r.decimals} dec`}</p>
                    </div>
                    <a
                      href={addressUrl(r.mint)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:inline text-[10px] font-black uppercase tracking-widest text-primary/70 hover:text-primary w-8 text-right"
                    >
                      Mint
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-3 sm:gap-5">
          <AtaCalculator defaultOwner={publicKey?.toBase58() ?? ""} />

          <Card className="flex flex-col">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white mb-2">
              <PlusCircle size={14} className="text-primary" /> New System Account
            </h3>
            <p className="text-sm text-white/40 mb-6 leading-relaxed">
              The SolVault API generates a fresh keypair and a rent-exempt <code className="text-white/70">createAccount</code>{" "}
              transaction, partially signed — you sign as the fee payer.
            </p>
            {newAccount && (
              <div className="grid gap-4 mb-6">
                <KeyValue label="New account" value={newAccount.address} href={addressUrl(newAccount.address)} />
                <KeyValue label="Signature" value={newAccount.signature} href={txUrl(newAccount.signature)} />
              </div>
            )}
            <button onClick={createAccount} disabled={creating} className={`${primaryButtonClass} mt-auto`}>
              {creating ? <RefreshCcw className="animate-spin" size={18} /> : <><PlusCircle size={18} /> Create account</>}
            </button>
            <p className="text-[11px] text-white/25 mt-3 text-center">Uses the SolVault API · Devnet only</p>
          </Card>
        </div>
      </div>
    </RequireWallet>
  );
}
