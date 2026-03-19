"use client";

import { motion } from "framer-motion";
import { Wallet, Send, Droplets, PlusCircle, History } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "overview", icon: <Wallet size={18} />, label: "Overview" },
  { id: "transfer", icon: <Send size={18} />, label: "Transfer" },
  { id: "airdrop", icon: <Droplets size={18} />, label: "Airdrop" },
  { id: "tools", icon: <PlusCircle size={18} />, label: "Tools" },
  { id: "history", icon: <History size={18} />, label: "History" },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-full md:w-60 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`
            relative flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 whitespace-nowrap md:whitespace-normal flex-shrink-0
            ${
              activeTab === item.id
                ? "text-white bg-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }
          `}
        >
          <div className={`${activeTab === item.id ? 'text-primary' : 'text-inherit'} transition-colors`}>
            {item.icon}
          </div>
          <span className="font-bold text-[10px] md:text-sm uppercase tracking-wider">{item.label}</span>
          {activeTab === item.id && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute bottom-0 md:bottom-auto md:left-0 w-full md:w-0.5 h-0.5 md:h-5 bg-primary rounded-t-full md:rounded-r-full"
            />
          )}
        </button>
      ))}
    </aside>
  );
}
