"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Send,
  Droplets,
  Coins,
  Layers,
  History,
  Settings,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Home" },
  { href: "/dashboard/transfer", icon: Send, label: "Transfer" },
  { href: "/dashboard/airdrop", icon: Droplets, label: "Airdrop" },
  { href: "/dashboard/mint", icon: Coins, label: "Mint" },
  { href: "/dashboard/tokens", icon: Layers, label: "Tokens" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const isActive = (pathname: string, href: string) =>
  href === "/dashboard" ? pathname === href : pathname.startsWith(href);

export function Sidebar() {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLElement>(null);

  // Keep the active tab visible in the horizontally scrolling mobile bar
  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = scroller?.querySelector<HTMLElement>("[aria-current='page']");
    if (!scroller || !active || scroller.scrollWidth <= scroller.clientWidth) return;
    scroller.scrollTo({
      left: active.offsetLeft - scroller.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <nav
      ref={scrollerRef}
      aria-label="Dashboard sections"
      className="flex gap-1 p-1.5 overflow-x-auto scrollbar-hide snap-x [mask-image:linear-gradient(to_right,black_calc(100%-40px),transparent)] md:[mask-image:none] bg-black/60 border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] md:flex-col md:gap-1.5 md:p-0 md:overflow-visible md:bg-transparent md:border-0 md:rounded-none md:backdrop-blur-none md:shadow-none"
    >
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`
              relative snap-start shrink-0 min-w-[68px] flex flex-col md:flex-row items-center gap-1.5 md:gap-4 px-2 py-2.5 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl transition-colors duration-300 active:scale-95 md:active:scale-100
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
            <Icon size={18} className={`relative z-10 shrink-0 transition-colors ${active ? "text-primary" : ""}`} />
            <span className="relative z-10 font-bold text-[10px] md:text-sm uppercase tracking-wide md:tracking-wider leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
