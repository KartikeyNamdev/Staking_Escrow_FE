"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { HistoryItem, NotificationMessage } from "@/types/dashboard";

const BACKEND_URL = "http://localhost:3001";

export function useDashboard() {
  const { publicKey: walletPublicKey } = useWallet();
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Sync wallet public key to state
  useEffect(() => {
    if (walletPublicKey) {
      setPublicKey(walletPublicKey.toBase58());
    } else {
      setPublicKey("");
    }
  }, [walletPublicKey]);
  const [message, setMessage] = useState<NotificationMessage>({
    text: "",
    type: "",
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("solvault_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("solvault_history", JSON.stringify(history));
    }
  }, [history]);

  const addToHistory = useCallback((action: string, metadata: any) => {
    const newEntry: HistoryItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      ...metadata,
    };
    setHistory((prev) => [newEntry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    if (confirm("Clear all activity history?")) {
      setHistory([]);
      localStorage.removeItem("solvault_history");
    }
  }, []);

  const showNotification = useCallback(
    (
      text: string,
      type: "success" | "error",
      signature?: string,
      metadata?: any,
    ) => {
      setMessage({ text, type, signature });

      if (signature && type === "success" && metadata) {
        addToHistory(text, metadata);
      }

      const duration = type === "error" ? 5000 : 10000;
      setTimeout(
        () => setMessage({ text: "", type: "", signature: undefined }),
        duration,
      );
    },
    [addToHistory],
  );

  const fetchBalance = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });
      const data = await res.json();
      if (data.balance !== undefined) {
        setBalance(data.balance);
      } else {
        showNotification(data.error || "Failed to fetch balance", "error");
      }
    } catch (e) {
      showNotification(
        "Backend unreachable. Ensure it's running on port 3001.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return {
    publicKey,
    setPublicKey,
    balance,
    loading,
    activeTab,
    setActiveTab,
    message,
    setMessage,
    history,
    fetchBalance,
    showNotification,
    clearHistory,
    copyToClipboard,
    BACKEND_URL,
  };
}
