export interface HistoryItem {
  id: number;
  timestamp: string;
  action: string;
  type?: "transfer" | "airdrop" | "tool";
  from?: string;
  to?: string;
  amount?: string | number;
  signature?: string;
  result?: string;
}

export interface NotificationMessage {
  text: string;
  type: "success" | "error" | "";
  signature?: string;
}
