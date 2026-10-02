"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";

export function SuccessPanel({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-3 pt-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.05 }}
          className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center shadow-[0_0_40px_rgba(20,241,149,0.25)]"
        >
          <CheckCircle2 size={32} />
        </motion.div>
        <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-white/40 max-w-sm">{subtitle}</p>}
      </div>
      {children}
      {actions && <div className="flex flex-col sm:flex-row gap-3">{actions}</div>}
    </motion.div>
  );
}

export function ErrorPanel({
  title,
  reason,
  raw,
  actions,
}: {
  title: string;
  reason: string;
  raw?: string;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-3 pt-2">
        <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
        <p className="text-sm text-white/50 max-w-md leading-relaxed">{reason}</p>
      </div>
      {raw && raw !== reason && (
        <div className="bg-error/5 border border-error/15 rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white"
          >
            Technical details
            <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <pre className="px-4 pb-4 text-[11px] font-mono text-error/80 whitespace-pre-wrap break-all max-h-48 overflow-auto">
              {raw}
            </pre>
          )}
        </div>
      )}
      {actions && <div className="flex flex-col sm:flex-row gap-3">{actions}</div>}
    </motion.div>
  );
}

export function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 mb-6 sm:mb-8">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2 min-w-0 flex-1 last:flex-none">
          <span
            className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
              i < current ? "bg-primary text-black" : i === current ? "bg-white text-black" : "bg-white/5 text-white/30"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </span>
          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate ${i <= current ? "text-white" : "text-white/30"}`}>
            {s}
          </span>
          {i < steps.length - 1 && <span className={`hidden sm:block h-px flex-1 ${i < current ? "bg-primary/40" : "bg-white/10"}`} />}
        </li>
      ))}
    </ol>
  );
}
