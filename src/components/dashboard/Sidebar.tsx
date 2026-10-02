"use client";

import { motion } from "framer-motion";
import { Wallet, Send, Droplets, PlusCircle, History } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "overview", icon: Wallet, label: "Overview" },
  { id: "transfer", icon: Send, label: "Transfer" },
  { id: "airdrop", icon: Droplets, label: "Airdrop" },
  { id: "tools", icon: PlusCircle, label: "Tools" },
  { id: "history", icon: History, label: "History" },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <nav
      aria-label="Dashboard sections"
      className="grid grid-cols-5 gap-1 p-1.5 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] md:flex md:flex-col md:gap-2 md:p-0 md:bg-transparent md:border-0 md:rounded-none md:backdrop-blur-none md:shadow-none"
    >
      {navItems.map((item) => {
        const active = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            aria-current={active ? "page" : undefined}
            className={`
              relative flex flex-col md:flex-row items-center gap-1.5 md:gap-4 px-1 py-2.5 md:px-5 md:py-4 rounded-xl md:rounded-2xl transition-colors duration-300 active:scale-95 md:active:scale-100
              ${active ? "text-white" : "text-white/40 hover:text-white hover:bg-white/5"}
            `}
          >
            {active && (
              <motion.div
                layoutId="sidebar-active"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
              >
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-t-full bg-primary md:bottom-auto md:left-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:w-0.5 md:h-5 md:rounded-t-none md:rounded-r-full" />
              </motion.div>
            )}
            <Icon
              size={18}
              className={`relative z-10 shrink-0 transition-colors ${active ? "text-primary" : ""}`}
            />
            <span className="relative z-10 font-bold text-[9px] min-[400px]:text-[10px] md:text-sm uppercase tracking-wide md:tracking-wider leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
