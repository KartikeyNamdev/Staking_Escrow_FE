"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, ExternalLink, SearchX } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ActivityIcon } from "@/components/dashboard/ActivityRow";
import { Card, EmptyState, KeyValue, TypeBadge, primaryButtonClass } from "@/components/dashboard/ui";
import { useSettings } from "@/context/SettingsContext";
import { networkLabel } from "@/lib/solana";

export default function ActivityDetailPage() {
  const params = useParams();
  const { history } = useDashboard();
  const { txUrl, addressUrl, settings } = useSettings();
  const activity = history.find((h) => h.id.toString() === params.id);

  const back = (
    <Link
      href="/dashboard/history"
      className="inline-flex items-center gap-2 mb-5 sm:mb-8 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
    >
      <ArrowLeft size={14} /> All activity
    </Link>
  );

  if (!activity) {
    return (
      <>
        {back}
        <Card>
          <EmptyState
            icon={<SearchX size={28} />}
            title="Activity not found"
            description="This transaction might have been cleared from your local history. If you have the signature, you can still look it up on the explorer."
            action={<Link href="/dashboard/history" className={primaryButtonClass}>Back to history</Link>}
          />
        </Card>
      </>
    );
  }

  const network = activity.network ?? settings.network;

  return (
    <>
      {back}
      <Card className="relative overflow-hidden md:p-10!">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-4 sm:gap-6 mb-8 border-b border-white/5 pb-6 sm:pb-8 relative z-10">
          <div className="scale-125 sm:scale-150 origin-left mr-3 sm:mr-6">
            <ActivityIcon type={activity.type} />
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={12} /> Confirmed
              </span>
              <TypeBadge type={activity.type} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{networkLabel(network)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white break-words">{activity.action}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 relative z-10">
          {(activity.amount || activity.supply) && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                {activity.type === "mint" ? "Initial supply" : "Amount"}
              </p>
              <div className="text-4xl sm:text-5xl font-black text-white flex flex-wrap items-baseline gap-x-3 break-all tabular-nums">
                {activity.type === "mint" ? Number(activity.supply).toLocaleString() : activity.amount}
                <span className="text-xl sm:text-2xl text-white/20">{activity.type === "mint" ? activity.symbol : "SOL"}</span>
              </div>
              {activity.fee !== undefined && <p className="text-xs text-white/30 mt-2">Network fee: {activity.fee} SOL</p>}
            </div>
          )}

          <div>
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
              <Clock size={12} /> Timestamp
            </p>
            <p className="text-base sm:text-lg font-medium text-white/90">
              {new Date(activity.timestamp).toLocaleString(undefined, { dateStyle: "full", timeStyle: "medium" })}
            </p>
          </div>

          <div className="grid gap-4">
            {activity.signature && <KeyValue label="Signature" value={activity.signature} href={txUrl(activity.signature, network)} />}
            {activity.from && <KeyValue label="Sender" value={activity.from} href={addressUrl(activity.from, network)} />}
            {activity.to && <KeyValue label="Recipient" value={activity.to} href={addressUrl(activity.to, network)} />}
            {activity.mint && <KeyValue label={`Mint · ${activity.name ?? ""} (${activity.decimals ?? "?"} decimals)`} value={activity.mint} href={addressUrl(activity.mint, network)} />}
            {activity.result && !activity.mint && <KeyValue label="Result" value={activity.result} href={addressUrl(activity.result, network)} />}
          </div>
        </div>

        {activity.signature && (
          <a
            href={txUrl(activity.signature, network)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${primaryButtonClass} mt-8 sm:mt-10 relative z-10`}
          >
            <ExternalLink size={18} /> Verify on {settings.explorer === "solscan" ? "Solscan" : "Solana Explorer"}
          </a>
        )}
      </Card>
    </>
  );
}
