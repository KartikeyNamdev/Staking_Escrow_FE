"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Info, RefreshCcw, Send } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ActivityRow } from "@/components/dashboard/ActivityRow";
import { ErrorPanel, Steps, SuccessPanel } from "@/components/dashboard/ResultPanel";
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
  RENT_EXEMPT_MINIMUM,
  describeError,
  formatSol,
  isValidAddress,
  networkLabel,
  shorten,
} from "@/lib/solana";

type Stage = "form" | "review" | "sending" | "success" | "error";

interface Review {
  lamports: number;
  fee: number;
  recipientBalance: number;
}

export default function TransferPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { balance, history, record } = useDashboard();
  const { settings, txUrl } = useSettings();

  const [stage, setStage] = useState<Stage>("form");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<ReturnType<typeof describeError> | null>(null);

  const recipientError = !recipient
    ? "Recipient is required"
    : !isValidAddress(recipient)
      ? "Not a valid Solana address"
      : publicKey && recipient.trim() === publicKey.toBase58()
        ? "You can't send to your own address"
        : null;
  const amt = parseFloat(amount);
  const amountError =
    !amount || isNaN(amt) || amt <= 0
      ? "Enter an amount greater than 0"
      : balance !== null && amt > balance
        ? "Amount exceeds your balance"
        : null;

  const recentRecipients = useMemo(
    () =>
      Array.from(
        new Set(history.filter((h) => h.type === "transfer" && h.to).map((h) => h.to!)),
      ).slice(0, 3),
    [history],
  );

  const buildTx = async (lamports: number) => {
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey(recipient.trim()),
        lamports,
      }),
    );
    const latest = await connection.getLatestBlockhash();
    tx.recentBlockhash = latest.blockhash;
    tx.feePayer = publicKey!;
    return { tx, latest };
  };

  const goToReview = async () => {
    setTouched(true);
    if (recipientError || amountError || !publicKey) return;
    setReviewing(true);
    try {
      const lamports = Math.round(amt * LAMPORTS_PER_SOL);
      const { tx } = await buildTx(lamports);
      const [feeRes, recipientBalance] = await Promise.all([
        connection.getFeeForMessage(tx.compileMessage()),
        connection.getBalance(new PublicKey(recipient.trim())),
      ]);
      setReview({ lamports, fee: feeRes.value ?? 5000, recipientBalance });
      setStage("review");
    } catch (e) {
      const d = describeError(e);
      toast.error(d.title, d.reason);
    } finally {
      setReviewing(false);
    }
  };

  const confirm = async () => {
    if (!review || !publicKey) return;
    setStage("sending");
    try {
      // Fresh blockhash at signing time so a slow review never expires
      const { tx, latest } = await buildTx(review.lamports);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");
      setSignature(sig);
      setStage("success");
      record({
        action: `Sent ${amount} SOL`,
        type: "transfer",
        from: publicKey.toBase58(),
        to: recipient.trim(),
        amount,
        signature: sig,
        fee: review.fee / LAMPORTS_PER_SOL,
      });
      toast.success(`Sent ${amount} SOL`, `To: ${shorten(recipient.trim(), 6)}`, sig);
    } catch (e) {
      setError(describeError(e));
      setStage("error");
    }
  };

  const reset = () => {
    setStage("form");
    setRecipient("");
    setAmount("");
    setTouched(false);
    setReview(null);
    setError(null);
  };

  const setMax = () => {
    if (balance === null) return;
    const max = Math.max(0, balance - 0.00001); // leave room for the fee
    setAmount(max > 0 ? String(Number(max.toFixed(6))) : "0");
  };

  const belowRent =
    review && review.recipientBalance === 0 && review.lamports < RENT_EXEMPT_MINIMUM;
  const stepIndex = stage === "form" ? 0 : stage === "review" || stage === "sending" ? 1 : 2;

  return (
    <RequireWallet>
      <PageHeader
        icon={<Send size={22} />}
        eyebrow={`${networkLabel(settings.network)} · System Program`}
        title="Transfer SOL"
        description="Send native SOL to any address. You'll see the exact network fee before your wallet asks you to sign."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-3 sm:gap-5">
        <Card>
          <Steps steps={["Details", "Review", "Done"]} current={stepIndex} />

          {stage === "form" && (
            <div className="flex flex-col gap-5 sm:gap-6">
              <Field label="Recipient Address" error={touched ? recipientError : null}>
                <input
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={inputClass}
                  placeholder="e.g. 7xKX…9aBc"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </Field>
              {recentRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 -mt-2">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest self-center mr-1">Recent</span>
                  {recentRecipients.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRecipient(r)}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 hover:text-white hover:border-primary/30 transition-colors"
                    >
                      {shorten(r, 4)}
                    </button>
                  ))}
                </div>
              )}
              <Field
                label="Amount (SOL)"
                error={touched ? amountError : null}
                hint={`Available: ${formatSol(balance)} SOL`}
                right={
                  <button onClick={setMax} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                    Max
                  </button>
                }
              >
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className={inputClass}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Field>
              <div className="flex flex-wrap gap-2">
                {["0.01", "0.1", "0.5", "1"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      amount === v ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    {v} SOL
                  </button>
                ))}
              </div>
              <button onClick={goToReview} disabled={reviewing} className={`${primaryButtonClass} mt-2`}>
                {reviewing ? <RefreshCcw className="animate-spin" size={18} /> : <>Review Transfer</>}
              </button>
            </div>
          )}

          {(stage === "review" || stage === "sending") && review && (
            <div className="flex flex-col gap-5">
              <div className="text-center py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">You&apos;re sending</p>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter tabular-nums break-all">
                  {amount} <span className="text-xl text-white/30">SOL</span>
                </p>
              </div>
              <div className="grid gap-4">
                <KeyValue label="From" value={publicKey!.toBase58()} />
                <KeyValue label="To" value={recipient.trim()} />
              </div>
              <div className="rounded-2xl bg-white/[0.03] border border-white/5 divide-y divide-white/5 text-sm">
                {[
                  ["Network", networkLabel(settings.network)],
                  ["Network fee", `${formatSol(review.fee / LAMPORTS_PER_SOL, 9)} SOL`],
                  ["Total debited", `${formatSol(amt + review.fee / LAMPORTS_PER_SOL, 9)} SOL`],
                  ["Balance after", `${formatSol((balance ?? 0) - amt - review.fee / LAMPORTS_PER_SOL, 6)} SOL`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-3">
                    <span className="text-white/40">{k}</span>
                    <span className="font-bold text-white tabular-nums text-right">{v}</span>
                  </div>
                ))}
              </div>
              {belowRent && (
                <div className="flex gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs leading-relaxed">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  This address has no SOL yet. Transfers below the rent-exempt minimum (~0.00089 SOL) to a new account will be rejected by the network.
                </div>
              )}
              {settings.network === "mainnet-beta" && (
                <div className="flex gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs">
                  <AlertTriangle size={16} className="shrink-0" /> Mainnet transfers are irreversible and move real funds.
                </div>
              )}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button onClick={() => setStage("form")} disabled={stage === "sending"} className={secondaryButtonClass}>
                  <ArrowLeft size={16} /> Edit
                </button>
                <button onClick={confirm} disabled={stage === "sending"} className={`${primaryButtonClass} flex-1`}>
                  {stage === "sending" ? (
                    <>
                      <RefreshCcw className="animate-spin" size={18} /> Waiting for wallet & confirmation…
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Confirm & Sign
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {stage === "success" && (
            <SuccessPanel
              title="Transfer confirmed"
              subtitle={`${amount} SOL is on its way to ${shorten(recipient.trim(), 6)}. Confirmed on ${networkLabel(settings.network)}.`}
              actions={
                <>
                  <button onClick={reset} className={`${primaryButtonClass} flex-1`}>Send another</button>
                  <Link href="/dashboard/history" className={`${secondaryButtonClass} flex-1`}>View history</Link>
                </>
              }
            >
              <KeyValue label="Signature" value={signature} href={txUrl(signature)} />
            </SuccessPanel>
          )}

          {stage === "error" && error && (
            <ErrorPanel
              title={error.title}
              reason={error.reason}
              raw={error.raw}
              actions={
                <>
                  <button onClick={() => setStage("review")} className={`${primaryButtonClass} flex-1`}>Try again</button>
                  <button onClick={() => setStage("form")} className={`${secondaryButtonClass} flex-1`}>Edit transfer</button>
                </>
              }
            />
          )}
        </Card>

        <div className="flex flex-col gap-3 sm:gap-5">
          <Card>
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white mb-4">
              <Info size={14} className="text-primary" /> How it works
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/50 leading-relaxed">
              <li>• Uses the native <span className="text-white/80">System Program</span> transfer instruction.</li>
              <li>• Base fee is <span className="text-white/80">5,000 lamports</span> per signature (0.000005 SOL).</li>
              <li>• New accounts need at least <span className="text-white/80">~0.00089 SOL</span> to be rent-exempt.</li>
              <li>• We wait for <span className="text-white/80">confirmed</span> commitment before showing success.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Recent transfers</h3>
            {history.filter((h) => h.type === "transfer").length === 0 ? (
              <p className="text-sm text-white/30">Your transfers will appear here.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.filter((h) => h.type === "transfer").slice(0, 3).map((item) => (
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
