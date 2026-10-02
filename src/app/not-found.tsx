import Link from "next/link";
import { ArrowLeft, BookOpen, LayoutGrid } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background text-white font-sans overflow-x-clip flex flex-col">
      <SiteNav />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <p className="text-[clamp(6rem,30vw,14rem)] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white/20 to-white/0 select-none">
          404
        </p>
        <p className="font-mono text-xs text-primary/70 mb-4 -mt-4">Error: AccountNotFound</p>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase mb-4">This page isn&apos;t on-chain</h1>
        <p className="text-white/40 max-w-md mb-10 leading-relaxed">
          The address you followed doesn&apos;t exist — it may have moved, or the link has a typo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
          <Link href="/" className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} /> Home
          </Link>
          <Link href="/dashboard" className="px-6 py-3.5 rounded-2xl bg-primary text-black font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <LayoutGrid size={16} /> Dashboard
          </Link>
          <Link href="/docs" className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <BookOpen size={16} /> Docs
          </Link>
        </div>
      </main>
    </div>
  );
}
