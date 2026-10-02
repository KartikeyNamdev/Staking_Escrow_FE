import type { Network } from "@/lib/solana";

export type ActivityType = "transfer" | "airdrop" | "mint" | "tool";

export interface HistoryItem {
  id: number;
  timestamp: string;
  action: string;
  type?: ActivityType;
  from?: string;
  to?: string;
  amount?: string | number;
  signature?: string;
  result?: string;
  network?: Network;
  fee?: number;
  // Mint details
  mint?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  supply?: string;
}

export interface NotificationMessage {
  text: string;
  type: "success" | "error" | "";
  signature?: string;
}
