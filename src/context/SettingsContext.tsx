"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ExplorerKind, Network, NETWORKS, explorerUrl } from "@/lib/solana";

export interface Settings {
  network: Network;
  customRpc: string;
  explorer: ExplorerKind;
}

const DEFAULTS: Settings = { network: "devnet", customRpc: "", explorer: "solana" };
const STORAGE_KEY = "solvault_settings";

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
  endpoint: string;
  txUrl: (signature: string, network?: Network) => string;
  addressUrl: (address: string, network?: Network) => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo<SettingsContextValue>(() => {
    const endpoint =
      settings.customRpc.trim() ||
      NETWORKS.find((n) => n.id === settings.network)!.rpc;
    return {
      settings,
      update,
      reset,
      endpoint,
      txUrl: (sig, network) =>
        explorerUrl("tx", sig, network ?? settings.network, settings.explorer),
      addressUrl: (addr, network) =>
        explorerUrl("address", addr, network ?? settings.network, settings.explorer),
    };
  }, [settings, update, reset]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
