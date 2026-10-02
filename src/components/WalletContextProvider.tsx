"use client";
import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { MotionConfig } from "framer-motion";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";

import "@solana/wallet-adapter-react-ui/styles.css";

const SolanaProviders: FC<{ children: ReactNode }> = ({ children }) => {
  // Endpoint follows the network / custom RPC chosen in Settings
  const { endpoint } = useSettings();

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const onError = React.useCallback((error: any) => {
    // Suppress common noisy errors like "Plugin Closed" or "User Rejected"
    // to prevent white-screen crashes or intrusive console spam.
    console.warn("Wallet Connection Error:", error.name, error.message);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: "confirmed" }}>
      <WalletProvider wallets={wallets} autoConnect onError={onError}>
        <WalletModalProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <SettingsProvider>
    <SolanaProviders>{children}</SolanaProviders>
  </SettingsProvider>
);
