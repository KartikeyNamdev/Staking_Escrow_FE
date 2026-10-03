import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  // Absolute base so og:image / twitter:image resolve to full URLs in link previews
  metadataBase: new URL("https://staking-escrow-fe.vercel.app"),
  title: "SolVault | Automate Solana with AI",
  description:
    "The intelligent vault system for Solana power users. Secure assets, run autonomous agent teams, and scale global.",
  openGraph: {
    type: "website",
    siteName: "SolVault",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020801",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <WalletContextProvider>
          {children}
          <Toaster />
        </WalletContextProvider>
      </body>
    </html>
  );
}
