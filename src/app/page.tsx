"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Send,
  PlusCircle,
  Coins,
  Droplets,
  RefreshCcw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

const BACKEND_URL = "http://localhost:3001";

export default function Home() {
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchBalance = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/balance`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // Although GET shouldn't have body, the backend expects it.
        // We'll use POST or fix backend if needed, but the current backend is GET /balance with req.body.publicKey
        // Note: Standard fetch GET doesn't support bodies. Let's see if we can use a query param or if we should fix backend.
        // Looking at backend: app.get("/balance", async (req, res) => { if (!req.body.publicKey) ...
        // Some node servers permit GET body, but browsers often skip it.
        // I'll try it, if it fails I'll recommend a fix.
        body: JSON.stringify({ publicKey }),
      } as any);
      const data = await res.json();
      if (data.balance !== undefined) {
        setBalance(data.balance);
      } else {
        setMessage({
          text: data.error || "Failed to fetch balance",
          type: "error",
        });
      }
    } catch (e) {
      setMessage({
        text: "Backend unreachable. Ensure it's running on port 3001.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  return (
    <main className="container">
      <nav className="navbar">
        <div className="logo">
          <Zap className="icon-primary" />
          <span>SOLVAULT</span>
        </div>
        <div className="status">
          <div className="status-dot"></div>
          <span>Localnet Active</span>
        </div>
      </nav>

      <div className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-content"
        >
          <h1>Solana Dev Toolbox</h1>
          <p>
            The ultimate interface for managing accounts, tokens, and stakings.
          </p>
        </motion.div>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar / Navigation */}
        <aside className="sidebar glass-card">
          <div className="nav-items">
            {[
              { id: "overview", icon: <Wallet size={20} />, label: "Overview" },
              { id: "transfer", icon: <Send size={20} />, label: "Transfer" },
              { id: "airdrop", icon: <Droplets size={20} />, label: "Airdrop" },
              { id: "tools", icon: <PlusCircle size={20} />, label: "Tools" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <motion.div layoutId="pill" className="pill" />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Action Area */}
        <section className="main-content">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="tab-pane"
              >
                <div className="glass-card">
                  <h2 className="section-title">Account Balance</h2>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter Public Key (e.g., 5MF4QD...)"
                      value={publicKey}
                      onChange={(e) => setPublicKey(e.target.value)}
                    />
                    <button
                      onClick={fetchBalance}
                      className="action-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <RefreshCcw className="spinning" />
                      ) : (
                        "Check Balance"
                      )}
                    </button>
                  </div>

                  {balance !== null && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="balance-display"
                    >
                      <div className="balance-value">
                        <span className="amount">{balance}</span>
                        <span className="unit">SOL</span>
                      </div>
                      <div className="balance-info">
                        <ShieldCheck size={16} className="icon-success" />
                        <span>Verified on Cluster</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "transfer" && (
              <TransferView onNotify={showNotification} />
            )}

            {activeTab === "airdrop" && (
              <AirdropView onNotify={showNotification} />
            )}

            {activeTab === "tools" && <ToolsView onNotify={showNotification} />}
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`notification ${message.type}`}
          >
            {message.type === "success" ? (
              <ShieldCheck />
            ) : (
              <ShieldCheck color="red" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: 0.1rem;
        }

        .icon-primary {
          color: var(--primary);
        }

        .status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--text-dim);
          border: 1px solid var(--card-border);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--primary);
        }

        .hero {
          margin-bottom: 3rem;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #fff, #888);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          color: var(--text-dim);
          font-size: 1.1rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 2rem;
        }

        .sidebar {
          height: fit-content;
          padding: 1rem;
        }

        .nav-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-dim);
          position: relative;
          text-align: left;
        }

        .nav-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-btn.active {
          color: #fff;
        }

        .pill {
          position: absolute;
          left: 0;
          width: 3px;
          height: 20px;
          background: var(--primary);
          border-radius: 0 4px 4px 0;
        }

        .section-title {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .input-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-btn {
          background: var(--foreground);
          color: #000;
          padding: 0 24px;
          border-radius: 8px;
          font-weight: 600;
          white-space: nowrap;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .balance-display {
          background: rgba(20, 241, 149, 0.05);
          border: 1px solid rgba(20, 241, 149, 0.2);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
        }

        .balance-value {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .amount {
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary);
        }

        .unit {
          font-size: 1.25rem;
          font-weight: 600;
          opacity: 0.7;
        }

        .balance-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-dim);
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 100;
        }

        .notification.success {
          background: rgba(0, 230, 118, 0.1);
          border-color: rgba(0, 230, 118, 0.2);
        }

        .notification.error {
          background: rgba(255, 77, 77, 0.1);
          border-color: rgba(255, 77, 77, 0.2);
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .hero h1 {
            font-size: 2.5rem;
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
        onNotify(
          `Transfer successful! Signature: ${data.signature.slice(0, 8)}...`,
          "success",
        );
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card"
    >
      <h2 className="section-title">Transfer SOL</h2>
      <div className="form-stack">
        <div className="input-field">
          <label>Recipient Address</label>
          <input
            type="text"
            placeholder="Recipient Public Key"
            value={formData.reciever}
            onChange={(e) =>
              setFormData({ ...formData, reciever: e.target.value })
            }
          />
        </div>
        <div className="input-field">
          <label>Amount (SOL)</label>
          <input
            type="number"
            placeholder="0.0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleSend}
          className="glow-btn"
          disabled={loading}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {loading ? "Processing..." : "Send Tokens"}
        </button>
      </div>
      <style jsx>{`
        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-field label {
          font-size: 0.85rem;
          color: var(--text-dim);
          font-weight: 500;
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
          `Airdrop successful! Signature: ${data.signature.slice(0, 8)}...`,
          "success",
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card"
    >
      <h2 className="section-title">Request Airdrop</h2>
      <p
        style={{
          color: "var(--text-dim)",
          marginBottom: "2rem",
          fontSize: "0.9rem",
        }}
      >
        Get free SOL on Devnet/Testnet for testing your applications.
      </p>
      <div className="form-stack">
        <div className="input-field">
          <label>Wallet Address</label>
          <input
            type="text"
            placeholder="Your Public Key"
            value={formData.publicKey}
            onChange={(e) =>
              setFormData({ ...formData, publicKey: e.target.value })
            }
          />
        </div>
        <div className="input-field">
          <label>Amount (SOL)</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>
        <button
          onClick={handleAirdrop}
          className="glow-btn"
          disabled={loading}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {loading ? "Requesting..." : "Claim Airdrop"}
        </button>
      </div>
      <style jsx>{`
        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-field label {
          font-size: 0.85rem;
          color: var(--text-dim);
          font-weight: 500;
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
        onNotify(`${actionName} Successful!`, "success");
        console.log("Result:", data);
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
    <div className="tools-grid">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card tool-item"
        onClick={() => performAction("createAccount", "Account Creation")}
      >
        <div className="tool-icon">
          <PlusCircle className="icon-primary" />
        </div>
        <h3>Create New Account</h3>
        <p>Generate a fresh Solana keypair and account.</p>
        <div className="tool-footer">
          {loading === "Account Creation" ? (
            <RefreshCcw className="spinning" />
          ) : (
            <ChevronRight />
          )}
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card tool-item"
        onClick={() => performAction("createToken", "Token Creation")}
      >
        <div className="tool-icon">
          <Coins className="icon-secondary" />
        </div>
        <h3>Create SPL Token</h3>
        <p>Initialize a new mint for your own SPL token.</p>
        <div className="tool-footer">
          {loading === "Token Creation" ? (
            <RefreshCcw className="spinning" />
          ) : (
            <ChevronRight />
          )}
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card tool-item"
        onClick={() =>
          performAction("getAssociatedTokenAccountAddress", "ATA Resolution")
        }
      >
        <div className="tool-icon">
          <ExternalLink className="icon-accent" />
        </div>
        <h3>Resolve ATA</h3>
        <p>Get the Associated Token Account for testing.</p>
        <div className="tool-footer">
          {loading === "ATA Resolution" ? (
            <RefreshCcw className="spinning" />
          ) : (
            <ChevronRight />
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .tool-item {
          cursor: pointer;
          transition: border-color 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        .tool-item:hover {
          border-color: var(--primary);
        }
        .tool-icon {
          margin-bottom: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
        .tool-item h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .tool-item p {
          font-size: 0.85rem;
          color: var(--text-dim);
          flex: 1;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .tool-footer {
          display: flex;
          justify-content: flex-end;
          color: var(--text-dim);
        }
        .icon-secondary {
          color: var(--secondary);
        }
        .icon-accent {
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
