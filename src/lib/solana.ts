import { Buffer } from "buffer";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

export type Network = "devnet" | "testnet" | "mainnet-beta";
export type ExplorerKind = "solana" | "solscan";

export const BACKEND_URL = "https://solana-staking-escrow-vault.onrender.com";

export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);
export const TOKEN_2022_PROGRAM_ID = new PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
);
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
);
export const MINT_SIZE = 82;
/** Rent-exempt minimum for a 0-byte system account (lamports). */
export const RENT_EXEMPT_MINIMUM = 890_880;

export const NETWORKS: {
  id: Network;
  label: string;
  rpc: string;
  description: string;
}[] = [
  {
    id: "devnet",
    label: "Devnet",
    rpc: "https://api.devnet.solana.com",
    description: "Free test SOL, faucet available. Recommended.",
  },
  {
    id: "testnet",
    label: "Testnet",
    rpc: "https://api.testnet.solana.com",
    description: "Validator stress-testing cluster. Faucet available.",
  },
  {
    id: "mainnet-beta",
    label: "Mainnet",
    rpc: "https://api.mainnet-beta.solana.com",
    description: "Real funds. Use a dedicated RPC for reliability.",
  },
];

export const networkLabel = (n: Network) =>
  NETWORKS.find((x) => x.id === n)?.label ?? n;

export function explorerUrl(
  kind: "tx" | "address",
  value: string,
  network: Network,
  explorer: ExplorerKind = "solana",
) {
  const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
  if (explorer === "solscan") {
    return `https://solscan.io/${kind === "tx" ? "tx" : "account"}/${value}${cluster}`;
  }
  return `https://explorer.solana.com/${kind}/${value}${cluster}`;
}

export function isValidAddress(value: string) {
  const v = value.trim();
  if (v.length < 32 || v.length > 44) return false;
  try {
    new PublicKey(v);
    return true;
  } catch {
    return false;
  }
}

export const shorten = (addr = "", chars = 4) =>
  addr.length <= chars * 2 + 3
    ? addr
    : `${addr.slice(0, chars)}…${addr.slice(-chars)}`;

export const lamportsToSol = (lamports: number) => lamports / LAMPORTS_PER_SOL;

export const formatSol = (sol: number | null | undefined, digits = 4) =>
  sol === null || sol === undefined
    ? "—"
    : sol.toLocaleString(undefined, { maximumFractionDigits: digits });

/** Parses a decimal string into base units (e.g. "1.5" with 6 decimals → 1500000n). */
export function toBaseUnits(value: string, decimals: number): bigint {
  const [whole = "0", frac = ""] = value.trim().split(".");
  if (!/^\d*$/.test(whole) || !/^\d*$/.test(frac)) throw new Error("Invalid number");
  const padded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole || "0") * BigInt(10) ** BigInt(decimals) + BigInt(padded || "0");
}

export const U64_MAX = BigInt("18446744073709551615");

export function findAssociatedTokenAddress(
  owner: PublicKey,
  mint: PublicKey,
  tokenProgram: PublicKey = TOKEN_PROGRAM_ID,
) {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), tokenProgram.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
}

/* ---------- Minimal SPL Token instruction builders (no extra deps) ---------- */

export function createInitializeMint2Instruction(
  mint: PublicKey,
  decimals: number,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  programId: PublicKey = TOKEN_PROGRAM_ID,
) {
  // COption<Pubkey>: tag byte, followed by the key only when Some
  const data = Buffer.alloc(freezeAuthority ? 67 : 35);
  data.writeUInt8(20, 0); // InitializeMint2
  data.writeUInt8(decimals, 1);
  mintAuthority.toBuffer().copy(data, 2);
  data.writeUInt8(freezeAuthority ? 1 : 0, 34);
  if (freezeAuthority) freezeAuthority.toBuffer().copy(data, 35);
  return new TransactionInstruction({
    keys: [{ pubkey: mint, isSigner: false, isWritable: true }],
    programId,
    data,
  });
}

export function createAssociatedTokenAccountIdempotentInstruction(
  payer: PublicKey,
  ata: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  tokenProgram: PublicKey = TOKEN_PROGRAM_ID,
) {
  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: ata, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: tokenProgram, isSigner: false, isWritable: false },
    ],
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([1]), // CreateIdempotent
  });
}

export function createMintToInstruction(
  mint: PublicKey,
  destination: PublicKey,
  authority: PublicKey,
  amount: bigint,
  programId: PublicKey = TOKEN_PROGRAM_ID,
) {
  const data = Buffer.alloc(9);
  data.writeUInt8(7, 0); // MintTo
  data.writeBigUInt64LE(amount, 1);
  return new TransactionInstruction({
    keys: [
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: destination, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: true, isWritable: false },
    ],
    programId,
    data,
  });
}

/* ---------- Human-readable errors ---------- */

export function describeError(e: unknown): { title: string; reason: string; raw: string } {
  const raw =
    (e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e)) ||
    "Unknown error";
  const m = raw.toLowerCase();
  if (m.includes("user rejected") || m.includes("rejected the request") || m.includes("declined"))
    return { title: "Request cancelled", reason: "You rejected the request in your wallet. Nothing was sent.", raw };
  if (m.includes("insufficient") || m.includes("custom program error: 0x1"))
    return { title: "Insufficient funds", reason: "The wallet doesn't hold enough SOL to cover the amount plus network fees.", raw };
  if (m.includes("rent"))
    return { title: "Below rent-exempt minimum", reason: "The receiving account would end up below the rent-exempt minimum (~0.00089 SOL). Send a larger amount.", raw };
  if (m.includes("blockhash") || m.includes("expired") || m.includes("block height exceeded"))
    return { title: "Transaction expired", reason: "The transaction wasn't confirmed before its blockhash expired. Try again.", raw };
  if (m.includes("429") || m.includes("too many") || m.includes("rate limit") || m.includes("airdrop"))
    return { title: "Rate limited", reason: "The faucet or RPC is rate limiting requests. Wait a minute, request a smaller amount, or use faucet.solana.com.", raw };
  if (m.includes("failed to fetch") || m.includes("network") || m.includes("unreachable"))
    return { title: "Network unreachable", reason: "Couldn't reach the RPC endpoint. Check your connection or the RPC URL in Settings.", raw };
  return { title: "Transaction failed", reason: raw.length > 160 ? `${raw.slice(0, 160)}…` : raw, raw };
}
