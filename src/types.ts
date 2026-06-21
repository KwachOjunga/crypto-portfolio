export interface Asset {
  id: string;
  coinName: string;
  coinSymbol: string;
  currentPrice: number;
  amountOwned: number;
  color: string;
  createdAt: string;
}

export interface CoinSuggestion {
  name: string;
  symbol: string;
  defaultPrice: number;
  color: string;
}
