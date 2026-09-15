export type AssetClass = 'broad-market-etf' | 'dividend' | 'high-growth-tech';

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  buyDate: string;
  quantity: number;
  costBasis: number;
  assetClass: AssetClass;
  soldDate?: string;
  soldPrice?: number;
}
