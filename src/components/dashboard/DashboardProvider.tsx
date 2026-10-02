"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { HistoryItem } from "@/types/dashboard";
import { useSettings } from "@/context/SettingsContext";

const HISTORY_KEY = "solvault_history";

interface DashboardContextValue {
  history: HistoryItem[];
  record: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  clearHistory: () => void;
  balance: number | null;
  balanceLoading: boolean;
  balanceError: string | null;
  refreshBalance: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { settings } = useSettings();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to parse history", e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {}
  }, [history, hydrated]);

  const record = useCallback(
    (item: Omit<HistoryItem, "id" | "timestamp">) => {
      setHistory((prev) => [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          network: settings.network,
          ...item,
        },
        ...prev,
      ]);
    },
    [settings.network],
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    setBalanceLoading(true);
    setBalanceError(null);
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (e) {
      setBalanceError("Couldn't load balance from the RPC endpoint.");
    } finally {
      setBalanceLoading(false);
    }
  }, [connection, publicKey]);

  // Initial fetch + live updates whenever the account changes on-chain
  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    refreshBalance();
    const id = connection.onAccountChange(
      publicKey,
      (account) => setBalance(account.lamports / LAMPORTS_PER_SOL),
      "confirmed",
    );
    return () => {
      connection.removeAccountChangeListener(id).catch(() => {});
    };
  }, [connection, publicKey, refreshBalance]);

  return (
    <DashboardContext.Provider
      value={{
        history,
        record,
        clearHistory,
        balance,
        balanceLoading,
        balanceError,
        refreshBalance,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
