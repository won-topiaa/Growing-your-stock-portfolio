import type { AssetClass } from '../types';

export const TICKER_SUGGESTIONS: Record<string, { name: string; assetClass: AssetClass }> = {
  SPY: { name: 'SPDR S&P 500 ETF', assetClass: 'broad-market-etf' },
  VOO: { name: 'Vanguard S&P 500 ETF', assetClass: 'broad-market-etf' },
  VTI: { name: 'Vanguard Total Stock Market', assetClass: 'broad-market-etf' },
  QQQ: { name: 'Invesco QQQ Trust', assetClass: 'broad-market-etf' },
  IVV: { name: 'iShares Core S&P 500', assetClass: 'broad-market-etf' },
  VT: { name: 'Vanguard Total World Stock', assetClass: 'broad-market-etf' },

  JNJ: { name: 'Johnson & Johnson', assetClass: 'dividend' },
  KO: { name: 'Coca-Cola', assetClass: 'dividend' },
  PG: { name: 'Procter & Gamble', assetClass: 'dividend' },
  O: { name: 'Realty Income', assetClass: 'dividend' },
  T: { name: 'AT&T', assetClass: 'dividend' },
  VZ: { name: 'Verizon', assetClass: 'dividend' },
  PEP: { name: 'PepsiCo', assetClass: 'dividend' },
  ABBV: { name: 'AbbVie', assetClass: 'dividend' },
  SCHD: { name: 'Schwab US Dividend Equity', assetClass: 'dividend' },

  NVDA: { name: 'NVIDIA', assetClass: 'high-growth-tech' },
  MSFT: { name: 'Microsoft', assetClass: 'high-growth-tech' },
  AAPL: { name: 'Apple', assetClass: 'high-growth-tech' },
  GOOGL: { name: 'Alphabet', assetClass: 'high-growth-tech' },
  AMZN: { name: 'Amazon', assetClass: 'high-growth-tech' },
  META: { name: 'Meta Platforms', assetClass: 'high-growth-tech' },
  TSLA: { name: 'Tesla', assetClass: 'high-growth-tech' },
  AMD: { name: 'AMD', assetClass: 'high-growth-tech' },
};
