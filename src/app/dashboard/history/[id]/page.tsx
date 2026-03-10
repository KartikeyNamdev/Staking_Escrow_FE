"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Clock,
  Hash,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedHistory = localStorage.getItem("solvault_history");
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        const item = history.find((h: any) => h.id.toString() === params.id);
        setActivity(item);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    setLoading(false);
  }, [params.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) return null;

  if (!activity) {
    return (
      <div className="detail-container">
        <div className="error-card">
          <h2 className="dashboard-title">Activity Not Found</h2>
          <p>This transaction might have been cleared from your history.</p>
          <Link href="/dashboard" className="premium-button primary mt-4">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="detail-container">
      <header className="detail-header">
        <Link href="/dashboard" className="back-link">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="detail-title">Transaction Details</h1>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card detail-card"
      >
        <div className="status-hero">
          <div className={`status-icon-large ${activity.type || "tool"}`}>
            {activity.type === "transfer" ? (
              <ArrowUpRight size={32} />
            ) : activity.type === "airdrop" ? (
              <ArrowDownLeft size={32} />
            ) : (
              <Zap size={32} />
            )}
          </div>
          <div className="status-info">
            <div className="status-badge-success">
              <CheckCircle2 size={14} />
              <span>Confirmed</span>
            </div>
            <h2>{activity.action}</h2>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">
              <Clock size={14} />
              <span>Timestamp</span>
            </div>
            <div className="detail-value">
              {new Date(activity.timestamp).toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "medium",
              })}
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Hash size={14} />
              <span>Signature / ID</span>
            </div>
            <div className="detail-value-box">
              <code className="monospace">
                {activity.signature || activity.result}
              </code>
              <button
                onClick={() =>
                  copyToClipboard(activity.signature || activity.result)
                }
                className="copy-icon-btn"
                title="Copy Signature"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {(activity.from || activity.to) && (
            <div className="detail-section">
              <h3>Participating Wallets</h3>
              <div className="wallets-box">
                {activity.from && (
                  <div className="wallet-row">
                    <div className="wallet-label">Sender</div>
                    <div className="wallet-address">
                      <User size={14} />
                      <span>{activity.from}</span>
                    </div>
                  </div>
                )}
                {activity.to && (
                  <div className="wallet-row text-primary">
                    <div className="wallet-label">Recipient</div>
                    <div className="wallet-address">
                      <User size={14} />
                      <span>{activity.to}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activity.amount && (
            <div className="detail-item">
              <div className="detail-label">
                <ShieldCheck size={14} />
                <span>Value</span>
              </div>
              <div className="detail-amount">
                {activity.amount} <span className="sol-small">SOL</span>
              </div>
            </div>
          )}
        </div>

        <div className="detail-actions">
          <a
            href={`https://explorer.solana.com/tx/${activity.signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button primary w-full"
          >
            <ExternalLink size={18} />
            Verify on Solana Explorer
          </a>
        </div>
      </motion.div>

      <style jsx>{`
        .detail-container {
          min-height: 100vh;
          padding: 3rem 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .detail-title {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .back-link {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          transition: all 0.2s;
        }

        .back-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-4px);
        }

        .detail-card {
          padding: 3rem;
        }

        .status-hero {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 2rem;
        }

        .status-icon-large {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-icon-large.transfer {
          background: rgba(20, 241, 149, 0.1);
          color: var(--primary);
        }
        .status-icon-large.airdrop {
          background: rgba(0, 153, 255, 0.1);
          color: #0099ff;
        }
        .status-icon-large.tool {
          background: rgba(255, 170, 0, 0.1);
          color: #ffaa00;
        }

        .status-badge-success {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 4px 12px;
          background: rgba(20, 241, 149, 0.1);
          color: var(--primary);
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .status-info h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
        }

        .detail-grid {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .detail-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 1rem;
        }

        .detail-value {
          font-size: 1.1rem;
          font-weight: 500;
          color: white;
        }

        .detail-value-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.25rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .monospace {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.9rem;
          color: var(--primary);
          word-break: break-all;
        }

        .copy-icon-btn {
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.2s;
        }

        .copy-icon-btn:hover {
          color: white;
        }

        .detail-section h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 1.5rem;
        }

        .wallets-box {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          padding: 1.5rem;
          border-radius: 20px;
        }

        .wallet-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .wallet-label {
          font-size: 0.75rem;
          opacity: 0.5;
        }

        .wallet-address {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: "JetBrains Mono", monospace;
          font-size: 0.9rem;
          word-break: break-all;
        }

        .detail-amount {
          font-size: 3rem;
          font-weight: 800;
          color: white;
        }

        .sol-small {
          font-size: 1.25rem;
          opacity: 0.4;
        }

        .detail-actions {
          margin-top: 4rem;
        }

        .w-full {
          width: 100%;
        }
        .mt-4 {
          margin-top: 1rem;
        }
      `}</style>
    </main>
  );
}
