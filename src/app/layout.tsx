import type { Metadata } from "next";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "SolVault | Automate Solana with AI",
  description:
    "The intelligent vault system for Solana power users. Secure assets, run autonomous agent teams, and scale global.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletContextProvider>
          {children}
          <Toaster />
        </WalletContextProvider>
      </body>
    </html>
  );
}
