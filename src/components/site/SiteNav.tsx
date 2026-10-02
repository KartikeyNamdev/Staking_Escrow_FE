"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="flex justify-between items-center px-5 md:px-12 py-4 md:py-6 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-primary rounded-[14px] flex items-center justify-center text-black shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all group-hover:scale-110">
            <Zap size={22} fill="currentColor" />
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter">SOLVAULT</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-bold tracking-wide uppercase transition-colors ${
                pathname === l.href ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="px-7 py-3 bg-primary text-black rounded-2xl text-sm font-black hover:bg-white transition-all active:scale-95 uppercase tracking-widest"
          >
            Launch App
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/dashboard"
            className="px-4 py-2.5 bg-primary text-black rounded-xl text-xs font-black active:scale-95 transition-transform uppercase tracking-wider"
          >
            Launch
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white active:scale-95 transition-transform"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-b border-white/5"
          >
            <div className="flex flex-col px-5 pb-5 gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider ${
                    pathname === l.href ? "bg-white/5 text-white" : "text-white/60 active:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
