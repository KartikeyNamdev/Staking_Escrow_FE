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
    <aside className="w-full md:w-60 flex flex-col gap-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`
            relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
            ${
              activeTab === item.id
                ? "text-white bg-white/10"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }
          `}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
          {activeTab === item.id && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute left-0 w-0.5 h-5 bg-primary rounded-r-full"
            />
          )}
        </button>
      ))}
    </aside>
  );
}
