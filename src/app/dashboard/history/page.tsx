"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, History as HistoryIcon, Search, Trash2 } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { ActivityRow } from "@/components/dashboard/ActivityRow";
import { Card, EmptyState, PageHeader, StatTile, primaryButtonClass } from "@/components/dashboard/ui";
import { HistoryItem } from "@/types/dashboard";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "transfer", label: "Transfers" },
  { id: "airdrop", label: "Airdrops" },
  { id: "mint", label: "Mints" },
  { id: "tool", label: "Other" },
];

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function HistoryPage() {
  const { history, clearHistory } = useDashboard();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return history.filter(
      (item) =>
        (filter === "all" || (item.type ?? "tool") === filter) &&
        (!q ||
          item.action.toLowerCase().includes(q) ||
          item.to?.toLowerCase().includes(q) ||
          item.mint?.toLowerCase().includes(q) ||
          item.signature?.toLowerCase().includes(q)),
    );
  }, [history, search, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, HistoryItem[]>();
    filtered.forEach((item) => {
      const key = dayLabel(item.timestamp);
      map.set(key, [...(map.get(key) ?? []), item]);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solvault-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onClear = () => {
    if (confirm("Clear all activity history? This only removes your local record — on-chain transactions are permanent.")) {
      clearHistory();
    }
  };

  const count = (t: string) => history.filter((h) => (h.type ?? "tool") === t).length;

  return (
    <>
      <PageHeader
        icon={<HistoryIcon size={22} />}
        eyebrow="Activity"
        title="Transaction History"
        description="Every transaction made through SolVault on this device, each linked to the explorer so you can verify it on-chain."
        action={
          history.length > 0 && (
            <div className="flex gap-2">
              <button onClick={exportJson} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white/70 hover:text-white active:scale-95 transition-all">
                <Download size={14} /> Export
              </button>
              <button onClick={onClear} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-error/10 text-error text-sm font-bold hover:bg-error/20 active:scale-95 transition-all">
                <Trash2 size={14} /> Clear
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-3 sm:mb-5">
        <StatTile label="Total" value={history.length} />
        <StatTile label="Transfers" value={count("transfer")} />
        <StatTile label="Airdrops" value={count("airdrop")} />
        <StatTile label="Mints" value={count("mint")} />
      </div>

      <Card className="p-3! sm:p-6!">
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              type="search"
              placeholder="Search by action, address or signature…"
              className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-2.5 rounded-xl text-base md:text-sm outline-none focus:border-primary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  filter === f.id ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/5 text-white/50 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {history.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon size={28} />}
            title="No activity yet"
            description="Once you transfer, airdrop or mint through SolVault, every transaction is recorded here with a link to verify it on-chain."
            action={<Link href="/dashboard/airdrop" className={primaryButtonClass}>Claim test SOL</Link>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Search size={28} />} title="No matches" description="Try a different search term or filter." />
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map(([day, items]) => (
              <div key={day}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 px-1">{day}</p>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <ActivityRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
