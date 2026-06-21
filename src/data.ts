import { CoinSuggestion, Asset } from "./types";

export const COIN_SUGGESTIONS: CoinSuggestion[] = [
  { name: "Bitcoin", symbol: "BTC", defaultPrice: 68420.50, color: "#F7931A" },
  { name: "Ethereum", symbol: "ETH", defaultPrice: 3512.80, color: "#627EEA" },
  { name: "Solana", symbol: "SOL", defaultPrice: 148.30, color: "#14F195" },
  { name: "Cardano", symbol: "ADA", defaultPrice: 0.46, color: "#0033AD" },
  { name: "Ripple", symbol: "XRP", defaultPrice: 0.58, color: "#23292F" },
  { name: "Polkadot", symbol: "DOT", defaultPrice: 6.25, color: "#E6007A" },
  { name: "Dogecoin", symbol: "DOGE", defaultPrice: 0.13, color: "#C2A633" },
  { name: "Chainlink", symbol: "LINK", defaultPrice: 15.40, color: "#375BD2" },
  { name: "Avalanche", symbol: "AVAX", defaultPrice: 28.50, color: "#E84142" },
];

export const INITIAL_HOLDINGS: Asset[] = [
  {
    id: "initial-btc",
    coinName: "Bitcoin",
    coinSymbol: "BTC",
    currentPrice: 68420.50,
    amountOwned: 0.25,
    color: "#F7931A",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    id: "initial-eth",
    coinName: "Ethereum",
    coinSymbol: "ETH",
    currentPrice: 3512.80,
    amountOwned: 1.8,
    color: "#627EEA",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "initial-sol",
    coinName: "Solana",
    coinSymbol: "SOL",
    currentPrice: 148.30,
    amountOwned: 12.5,
    color: "#14F195",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const PALETTE_COLORS = [
  "#F7931A", // Orange
  "#627EEA", // Indigo
  "#14F195", // Teal/Green
  "#E6007A", // Rose
  "#375BD2", // Blue
  "#E84142", // Red
  "#C2A633", // Gold
  "#A259FF", // Purple
  "#00D097", // Emerald
  "#FF5A5F", // Salmon
];
