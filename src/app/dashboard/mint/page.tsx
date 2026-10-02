"use client";

import { useState } from "react";
import Link from "next/link";
import { Coins, Info, RefreshCcw, Sparkles } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ActivityRow } from "@/components/dashboard/ActivityRow";
import { ErrorPanel, SuccessPanel } from "@/components/dashboard/ResultPanel";
import {
  Card,
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
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  U64_MAX,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  describeError,
  findAssociatedTokenAddress,
  networkLabel,
  toBaseUnits,
} from "@/lib/solana";

const onChainSteps = [
  { title: "Create account", desc: "System Program allocates 82 bytes owned by the Token Program, funded rent-exempt." },
  { title: "Initialize mint", desc: "InitializeMint2 sets decimals and makes your wallet the mint authority." },
  { title: "Create your ATA", desc: "Associated Token Program derives & creates your token account for this mint." },
  { title: "Mint supply", desc: "MintTo credits the initial supply to your ATA." },
];

interface Result {
  mint: string;
  ata: string;
  signature: string;
}

export default function MintPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { history, record } = useDashboard();
  const { settings, txUrl, addressUrl } = useSettings();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("6");
  const [supply, setSupply] = useState("1000000");
  const [freeze, setFreeze] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<ReturnType<typeof describeError> | null>(null);

  const dec = parseInt(decimals, 10);
  const nameError = !name.trim() ? "Give your token a name" : name.length > 32 ? "Max 32 characters" : null;
  const symbolError = !symbol.trim() ? "Symbol is required" : symbol.length > 10 ? "Max 10 characters" : null;
  const decimalsError = isNaN(dec) || dec < 0 || dec > 9 ? "Decimals must be 0–9" : null;
  let supplyError: string | null = null;
  let baseSupply = BigInt(0);
  try {
    baseSupply = toBaseUnits(supply || "0", decimalsError ? 0 : dec);
    if (baseSupply > U64_MAX) supplyError = "Supply too large for a u64";
  } catch {
    supplyError = "Enter a valid number";
  }
  const hasErrors = !!(nameError || symbolError || decimalsError || supplyError);

  const handleMint = async () => {
    setTouched(true);
    if (hasErrors || !publicKey) return;
    setLoading(true);
    setError(null);
    try {
      const mintKeypair = Keypair.generate();
      const [ata] = findAssociatedTokenAddress(publicKey, mintKeypair.publicKey);
      const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMint2Instruction(mintKeypair.publicKey, dec, publicKey, freeze ? publicKey : null),
        createAssociatedTokenAccountIdempotentInstruction(publicKey, ata, publicKey, mintKeypair.publicKey),
      );
      if (baseSupply > BigInt(0)) {
        tx.add(createMintToInstruction(mintKeypair.publicKey, ata, publicKey, baseSupply));
      }
      const latest = await connection.getLatestBlockhash();
      tx.recentBlockhash = latest.blockhash;
      tx.feePayer = publicKey;

      const sig = await sendTransaction(tx, connection, { signers: [mintKeypair] });
      await connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");

      const mint = mintKeypair.publicKey.toBase58();
      setResult({ mint, ata: ata.toBase58(), signature: sig });
      record({
        action: `Minted ${symbol.toUpperCase()}`,
        type: "mint",
        mint,
        name: name.trim(),
        symbol: symbol.toUpperCase(),
        decimals: dec,
        supply,
        signature: sig,
        result: mint,
      });
      toast.success(`${symbol.toUpperCase()} minted`, `${Number(supply).toLocaleString()} tokens created`, sig);
    } catch (e) {
      setError(describeError(e));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setName("");
    setSymbol("");
    setTouched(false);
  };

  const mints = history.filter((h) => h.type === "mint");

  return (
    <RequireWallet>
      <PageHeader
        icon={<Coins size={22} />}
        eyebrow={`${networkLabel(settings.network)} · SPL Token Program`}
        title="Mint a Token"
        description="Create a new SPL token mint, your associated token account and the initial supply — in a single transaction."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-3 sm:gap-5">
        <Card>
          {result ? (
            <SuccessPanel
              title={`${symbol.toUpperCase()} is live`}
              subtitle={`${Number(supply).toLocaleString()} ${symbol.toUpperCase()} minted to your wallet on ${networkLabel(settings.network)}.`}
              actions={
                <>
                  <button onClick={reset} className={`${primaryButtonClass} flex-1`}>Mint another</button>
                  <Link href="/dashboard/tokens" className={`${secondaryButtonClass} flex-1`}>View token accounts</Link>
                </>
              }
            >
              <div className="grid gap-4">
                <KeyValue label="Mint address" value={result.mint} href={addressUrl(result.mint)} />
                <KeyValue label="Your token account (ATA)" value={result.ata} href={addressUrl(result.ata)} />
                <KeyValue label="Signature" value={result.signature} href={txUrl(result.signature)} />
              </div>
            </SuccessPanel>
          ) : error ? (
            <ErrorPanel
              title={error.title}
              reason={error.reason}
              raw={error.raw}
              actions={
                <>
                  <button onClick={handleMint} disabled={loading} className={`${primaryButtonClass} flex-1`}>
                    {loading ? <RefreshCcw className="animate-spin" size={18} /> : "Try again"}
                  </button>
                  <button onClick={() => setError(null)} className={`${secondaryButtonClass} flex-1`}>Edit details</button>
                </>
              }
            />
          ) : (
            <div className="flex flex-col gap-6">
              {/* Live preview */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-purple-500/15 via-primary/5 to-transparent p-5 flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-linear-to-br from-primary to-purple-500 flex items-center justify-center text-black text-xl font-black">
                  {(symbol || "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 grow">
                  <p className="font-black text-white text-lg truncate">{name || "Token name"}</p>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{symbol.toUpperCase() || "SYMBOL"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-white tabular-nums">{supply ? Number(supply).toLocaleString() : "0"}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{isNaN(dec) ? "–" : dec} decimals</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-5">
                <Field label="Token Name" error={touched ? nameError : null}>
                  <input className={inputClass} placeholder="e.g. Vault Credits" value={name} maxLength={32} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Symbol" error={touched ? symbolError : null}>
                  <input
                    className={`${inputClass} uppercase`}
                    placeholder="VLT"
                    autoCapitalize="characters"
                    maxLength={10}
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.replace(/\s/g, ""))}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-5">
                <Field label="Decimals" error={decimalsError} hint="6 is common, 9 like SOL.">
                  <input type="number" inputMode="numeric" min={0} max={9} className={inputClass} value={decimals} onChange={(e) => setDecimals(e.target.value)} />
                </Field>
                <Field label="Initial Supply" error={supplyError} hint="Minted to your associated token account.">
                  <input type="number" inputMode="decimal" step="any" className={inputClass} value={supply} onChange={(e) => setSupply(e.target.value)} />
                </Field>
              </div>

              <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
                <input type="checkbox" checked={freeze} onChange={(e) => setFreeze(e.target.checked)} className="mt-1 accent-[#14f195] w-4 h-4" />
                <span>
                  <span className="block text-sm font-bold text-white">Keep freeze authority</span>
                  <span className="block text-xs text-white/40 mt-0.5">Lets you freeze token accounts later. Most community tokens leave this off.</span>
                </span>
              </label>

              <p className="flex gap-2 text-xs text-white/30 leading-relaxed">
                <Info size={14} className="shrink-0 mt-0.5" />
                Name & symbol are saved with your local history. On-chain metadata (Metaplex) is on the roadmap.
              </p>

              <button onClick={handleMint} disabled={loading} className={primaryButtonClass}>
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin" size={18} /> Waiting for wallet & confirmation…
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Create Token
                  </>
                )}
              </button>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-3 sm:gap-5">
          <Card>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">What happens on-chain</h3>
            <ol className="relative flex flex-col gap-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {onChainSteps.map((s, i) => (
                <li key={s.title} className="relative flex gap-4">
                  <span className="relative z-10 w-6 h-6 shrink-0 rounded-full bg-zinc-900 border border-primary/30 text-primary text-[10px] font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{s.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Your tokens</h3>
            {mints.length === 0 ? (
              <p className="text-sm text-white/30">Tokens you mint will appear here.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {mints.slice(0, 4).map((item) => (
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
