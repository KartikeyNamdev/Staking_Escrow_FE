"use client";

import dynamic from "next/dynamic";

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <div className="h-10 sm:h-12 w-[140px] sm:w-[180px] rounded-[24px] bg-primary/20 animate-pulse" />
    ),
  },
);
