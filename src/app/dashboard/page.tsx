"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Send,
  PlusCircle,
  Coins,
  Droplets,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowLeft,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

const BACKEND_URL = "http://localhost:3001";

export default function DashboardPage() {
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState<{
    text: string;
    type: string;
    signature?: string;
  }>({ text: "", type: "" });
  const [history, setHistory] = useState<any[]>([]);

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
    localStorage.setItem("solvault_history", JSON.stringify(history));
  }, [history]);

  const addToHistory = (action: string, metadata: any) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      ...metadata,
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const clearHistory = () => {
    if (confirm("Clear all activity history?")) {
      setHistory([]);
    }
  };

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Temporarily change type to show feedback if needed, but we'll stick to a simple toast feedback
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const showNotification = (
    text: string,
    type: "success" | "error",
    signature?: string,
    metadata?: any,
  ) => {
    setMessage({ text, type, signature });
    if (signature && type === "success" && metadata) {
      addToHistory(text, metadata);
    }
    if (type === "error") {
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } else {
      setTimeout(() => setMessage({ text: "", type: "" }), 10000);
    }
  };

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <div className="flex items-center gap-14">
          <Link href="/" className="back-link">
            <ArrowLeft size={18} />
          </Link>
          <div className="logo-small">
            <Zap size={20} className="text-primary" />
            <span>SOLVAULT</span>
          </div>
        </div>
        <div className="status-pill">
          <div className="pulse-dot"></div>
          <span>Localnet Online</span>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="nav-group">
            {[
              { id: "overview", icon: <Wallet size={18} />, label: "Overview" },
              { id: "transfer", icon: <Send size={18} />, label: "Transfer" },
              { id: "airdrop", icon: <Droplets size={18} />, label: "Airdrop" },
              { id: "tools", icon: <PlusCircle size={18} />, label: "Tools" },
              { id: "history", icon: <History size={18} />, label: "History" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="active-indicator"
                  />
                )}
              </button>
            ))}
          </div>
        </aside>

        <section className="dashboard-content">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="dashboard-card"
              >
                <h2 className="dashboard-title">Account Balance</h2>
                <div className="input-row">
                  <input
                    type="text"
                    className="dashboard-input"
                    placeholder="Enter Public Key"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                  />
                  <button
                    onClick={fetchBalance}
                    className="premium-button primary"
                    disabled={loading}
                    style={{ minWidth: "120px" }}
                  >
                    {loading ? (
                      <RefreshCcw className="spinning" size={18} />
                    ) : (
                      "Query"
                    )}
                  </button>
                </div>

                {balance !== null && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="balance-badge"
                  >
                    <div className="balance-label">Available SOL</div>
                    <div className="balance-amount">
                      {balance} <span className="sol-unit">SOL</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === "transfer" && (
              <TransferView onNotify={showNotification} />
            )}

            {activeTab === "airdrop" && (
              <AirdropView onNotify={showNotification} />
            )}

            {activeTab === "tools" && <ToolsView onNotify={showNotification} />}

            {activeTab === "history" && (
              <HistoryView
                history={history}
                onClear={clearHistory}
                onCopy={copyToClipboard}
              />
            )}
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            className={`premium-toast ${message.type}`}
          >
            <div className="toast-glow" />
            <div className="toast-content">
              <div className="toast-header">
                {message.type === "success" ? (
                  <CheckCircle2 className="text-primary" size={20} />
                ) : (
                  <AlertCircle className="text-error" size={20} />
                )}
                <span className="toast-title">
                  {message.type === "success"
                    ? "Transaction Success"
                    : "Action Failed"}
                </span>
                <button
                  onClick={() => setMessage({ text: "", type: "" })}
                  className="toast-close"
                >
                  <RefreshCcw size={14} />
                </button>
              </div>

              <p className="toast-message">{message.text}</p>

              {message.signature && (
                <div className="signature-box">
                  <div className="signature-header">
                    <span>Signature / Address</span>
                    <button
                      onClick={() => copyToClipboard(message.signature!)}
                      className="copy-btn"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="signature-text">{message.signature}</div>
                  <a
                    href={`https://explorer.solana.com/tx/${message.signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="explorer-link"
                  >
                    <span>View on Explorer</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            <div className="toast-progress-bar">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: message.type === "success" ? 10 : 5,
                  ease: "linear",
                }}
                className="progress-fill"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: var(--background);
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .back-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          transition: all 0.2s;
        }

        .back-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-2px);
        }

        .logo-small {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 8px 16px;
          background: rgba(20, 241, 149, 0.05);
          border: 1px solid rgba(20, 241, 149, 0.1);
          border-radius: 99px;
          font-size: 0.8rem;
          color: var(--primary);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(20, 241, 149, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(20, 241, 149, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(20, 241, 149, 0);
          }
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 3rem;
        }

        .dashboard-sidebar {
          display: flex;
          flex-direction: column;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 14px 18px;
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
          position: relative;
          transition: all 0.3s;
        }

        .sidebar-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.03);
        }

        .sidebar-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .active-indicator {
          position: absolute;
          left: 0;
          width: 2px;
          height: 20px;
          background: var(--primary);
          border-radius: 0 4px 4px 0;
        }

        .dashboard-content {
          min-height: 500px;
        }

        .input-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .balance-badge {
          background: linear-gradient(
            135deg,
            rgba(20, 241, 149, 0.1),
            transparent
          );
          border: 1px solid rgba(20, 241, 149, 0.2);
          border-radius: 24px;
          padding: 32px;
          text-align: center;
        }

        .balance-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .balance-amount {
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--primary);
        }

        .sol-unit {
          font-size: 1.5rem;
          opacity: 0.5;
        }

        .premium-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 380px;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          z-index: 1000;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .premium-toast.success {
          border-left: 4px solid var(--primary);
        }

        .premium-toast.error {
          border-left: 4px solid #ff4d4d;
        }

        .toast-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: radial-gradient(
            circle at top right,
            rgba(20, 241, 149, 0.1),
            transparent
          );
          pointer-events: none;
        }

        .toast-content {
          padding: 1.5rem;
        }

        .toast-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .toast-title {
          font-weight: 700;
          font-size: 0.95rem;
          flex-grow: 1;
        }

        .toast-close {
          opacity: 0.4;
          transition: opacity 0.2s;
        }

        .toast-close:hover {
          opacity: 1;
        }

        .toast-message {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .signature-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
          margin-top: 0.5rem;
        }

        .signature-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.3);
        }

        .signature-text {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.75rem;
          color: rgba(20, 241, 149, 0.9);
          word-break: break-all;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          color: white;
          font-size: 0.7rem;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .explorer-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 8px;
          background: var(--primary);
          color: black;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s;
        }

        .explorer-link:hover {
          transform: translateY(-1px);
        }

        .toast-progress-bar {
          height: 3px;
          background: rgba(255, 255, 255, 0.05);
          width: 100%;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary);
        }

        .premium-toast.error .progress-fill {
          background: #ff4d4d;
        }

        .text-error {
          color: #ff4d4d;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }
          .dashboard-sidebar {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </main>
  );
}

function TransferView({ onNotify }: { onNotify: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ reciever: "", amount: "" });

  const handleSend = async () => {
    if (!formData.reciever || !formData.amount) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reciever: formData.reciever,
          amount: parseFloat(formData.amount),
        }),
      });
      const data = await res.json();
      if (data.signature) {
        onNotify(`Sent ${formData.amount} SOL`, "success", data.signature, {
          from: "Current Wallet",
          to: formData.reciever,
          amount: formData.amount,
          type: "transfer",
        });
        setFormData({ reciever: "", amount: "" });
      } else {
        onNotify(data.error || "Transfer failed", "error");
      }
    } catch (e) {
      onNotify("Backend unreachable", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <h2 className="dashboard-title">Transfer Assets</h2>
      <div className="form-stack">
        <div className="input-group-dashboard">
          <label className="dashboard-input-label">Recipient Address</label>
          <input
            type="text"
            className="dashboard-input"
            placeholder="PublicKey"
            value={formData.reciever}
            onChange={(e) =>
              setFormData({ ...formData, reciever: e.target.value })
            }
          />
        </div>
        <div className="input-group-dashboard">
          <label className="dashboard-input-label">Amount</label>
          <input
            type="number"
            className="dashboard-input"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleSend}
          className="premium-button primary w-full mt-4"
          disabled={loading}
        >
          {loading ? (
            <RefreshCcw className="spinning" size={18} />
          ) : (
            <>
              <Send size={18} />
              <span>Transfer SOL</span>
            </>
          )}
        </button>
      </div>
      <style jsx>{`
        .input-group-dashboard {
          display: flex;
          flex-direction: column;
        }
        .w-full {
          width: 100%;
        }
        .mt-4 {
          margin-top: 1rem;
        }
      `}</style>
    </motion.div>
  );
}

function AirdropView({ onNotify }: { onNotify: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ publicKey: "", amount: "1" });

  const handleAirdrop = async () => {
    if (!formData.publicKey) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/airdrop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: formData.publicKey,
          amount: parseFloat(formData.amount),
        }),
      });
      const data = await res.json();
      if (data.signature) {
        onNotify(
          `Airdropped ${formData.amount} SOL`,
          "success",
          data.signature,
          {
            to: formData.publicKey,
            amount: formData.amount,
            type: "airdrop",
          },
        );
      } else {
        onNotify(data.error || "Airdrop failed", "error");
      }
    } catch (e) {
      onNotify("Backend unreachable", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <h2 className="dashboard-title">Request Airdrop</h2>
      <div className="form-stack">
        <div className="input-group-dashboard">
          <label className="dashboard-input-label">Wallet PublicKey</label>
          <input
            type="text"
            className="dashboard-input"
            placeholder="Address"
            value={formData.publicKey}
            onChange={(e) =>
              setFormData({ ...formData, publicKey: e.target.value })
            }
          />
        </div>
        <div className="input-group-dashboard">
          <label className="dashboard-input-label">Quantity (SOL)</label>
          <input
            type="number"
            className="dashboard-input"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleAirdrop}
          className="premium-button primary w-full mt-4"
          disabled={loading}
        >
          {loading ? (
            <RefreshCcw className="spinning" size={18} />
          ) : (
            <>
              <Droplets size={18} />
              <span>Claim SOL</span>
            </>
          )}
        </button>
      </div>
      <style jsx>{`
        .input-group-dashboard {
          display: flex;
          flex-direction: column;
        }
        .w-full {
          width: 100%;
        }
        .mt-4 {
          margin-top: 1rem;
        }
      `}</style>
    </motion.div>
  );
}

function ToolsView({ onNotify }: { onNotify: any }) {
  const [loading, setLoading] = useState<string | null>(null);

  const performAction = async (endpoint: string, actionName: string) => {
    setLoading(actionName);
    try {
      const res = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.signature || data.address) {
        const sig = data.signature || data.address;
        onNotify(`${actionName} Ready`, "success", sig, {
          action: actionName,
          result: sig,
          type: "tool",
        });
      } else {
        onNotify(data.error || "Action failed", "error");
      }
    } catch (e) {
      onNotify("Backend unreachable", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="tools-grid-dashboard">
      {[
        {
          id: "createAccount",
          label: "New Account",
          icon: <PlusCircle size={24} />,
          desc: "Generate keys",
        },
        {
          id: "createToken",
          label: "Mint Token",
          icon: <Coins size={24} />,
          desc: "Deploy SPL mint",
        },
        {
          id: "getAssociatedTokenAccountAddress",
          label: "ATA Finder",
          icon: <ExternalLink size={24} />,
          desc: "Resolve address",
        },
      ].map((tool) => (
        <motion.div
          key={tool.id}
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
          onClick={() => performAction(tool.id, tool.label)}
          className="tool-card-dashboard"
        >
          <div className="tool-icon-dashboard">{tool.icon}</div>
          <div className="tool-info-dashboard">
            <h4>{tool.label}</h4>
            <p>{tool.desc}</p>
          </div>
          <div className="tool-status-dashboard">
            {loading === tool.label ? (
              <RefreshCcw className="spinning" size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </div>
        </motion.div>
      ))}
      <style jsx>{`
        .tools-grid-dashboard {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .tool-card-dashboard {
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
        }
        .tool-icon-dashboard {
          color: var(--primary);
        }
        .tool-info-dashboard h4 {
          font-size: 1rem;
          margin-bottom: 2px;
        }
        .tool-info-dashboard p {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
        }
        .tool-status-dashboard {
          margin-left: auto;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
function HistoryView({
  history,
  onClear,
  onCopy,
}: {
  history: any[];
  onClear: () => void;
  onCopy: (text: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter(
    (item) =>
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.to && item.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.signature &&
        item.signature.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <div className="history-header">
        <h2 className="dashboard-title">Activity History</h2>
        <div className="history-actions">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={onClear} className="clear-btn">
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-history">
            <History size={48} />
            <p>No activities recorded yet.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div
                className={`history-icon ${item.type === "transfer" ? "up" : item.type === "airdrop" ? "down" : "tool"}`}
              >
                {item.type === "transfer" ? (
                  <ArrowUpRight size={18} />
                ) : item.type === "airdrop" ? (
                  <ArrowDownLeft size={18} />
                ) : (
                  <Zap size={18} />
                )}
              </div>
              <Link
                href={`/dashboard/history/${item.id}`}
                className="history-info"
              >
                <div className="history-main">
                  <span className="history-action">{item.action}</span>
                  <span className="history-time">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="history-meta">
                  {item.to && (
                    <span className="meta-to">
                      To: <code>{item.to.slice(0, 8)}...</code>
                    </span>
                  )}
                  {item.amount && (
                    <span className="meta-amount">{item.amount} SOL</span>
                  )}
                  {item.signature && (
                    <span className="meta-sig-label">
                      {item.signature.slice(0, 12)}...
                    </span>
                  )}
                </div>
              </Link>
              <a
                href={`https://explorer.solana.com/tx/${item.signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`}
                target="_blank"
                rel="noopener noreferrer"
                className="history-link"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 2rem;
        }
        .history-actions {
          display: flex;
          gap: 1rem;
          flex-grow: 1;
          justify-content: flex-end;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 16px;
          border-radius: 12px;
          flex-grow: 1;
          max-width: 300px;
        }
        .search-box input {
          background: none;
          border: none;
          color: white;
          font-size: 0.85rem;
          outline: none;
          width: 100%;
        }
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 8px 16px;
          border-radius: 12px;
          background: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .clear-btn:hover {
          background: rgba(255, 77, 77, 0.2);
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .history-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          transition: all 0.2s;
        }
        .history-item:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(4px);
        }
        .history-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .history-icon.up {
          background: rgba(20, 241, 149, 0.1);
          color: var(--primary);
        }
        .history-icon.down {
          background: rgba(61, 153, 255, 0.1);
          color: #3d99ff;
        }
        .history-icon.tool {
          background: rgba(255, 170, 0, 0.1);
          color: #ffaa00;
        }
        .history-info {
          flex-grow: 1;
          cursor: pointer;
          color: inherit;
          text-decoration: none;
        }
        .history-main {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .history-action {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .history-time {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }
        .history-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          align-items: center;
        }
        .meta-sig-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 6px;
          color: var(--primary);
        }
        .history-link {
          opacity: 0.3;
          transition: opacity 0.2s;
          color: white;
        }
        .history-link:hover {
          opacity: 1;
        }
        .empty-history {
          text-align: center;
          padding: 4rem;
          color: rgba(255, 255, 255, 0.2);
        }
        .empty-history p {
          margin-top: 1rem;
          font-size: 0.9rem;
        }
      `}</style>
    </motion.div>
  );
}
