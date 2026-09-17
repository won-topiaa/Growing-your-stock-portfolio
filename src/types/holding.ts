export type AssetClass = 'broad-market-etf' | 'dividend' | 'high-growth-tech';

export type SellReason = 'profit-target' | 'stop-loss' | 'rebalance';

/** An additional purchase of the same holding (dollar-cost averaging). */
export interface BuyLot {
  id: string;
  date: string;
  quantity: number;
  cost: number;
}

/** A dividend payout captured while holding. */
export interface DividendRecord {
  id: string;
  date: string;
  amount: number;
}

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  buyDate: string;
  quantity: number;
  costBasis: number;
  assetClass: AssetClass;
  /** Additional DCA purchases after the initial buy. */
  additionalBuys?: BuyLot[];
  /** Dividends captured while holding. */
  dividends?: DividendRecord[];
  /** Latest manually-recorded total market value of the position. */
  currentValue?: number;
  /** True once the position has weathered a drawdown of >=15% without selling. */
  weatheredDip?: boolean;
  soldDate?: string;
  soldPrice?: number;
  sellReason?: SellReason;
}
