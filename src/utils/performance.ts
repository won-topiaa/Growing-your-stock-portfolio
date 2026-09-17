import type { Holding } from '../types';

/** Drawdown at or below this (e.g. -15%) earns a "Diamond Hands" resilience badge. */
export const DIP_THRESHOLD = -0.15;
/** Drawdown at or below this (e.g. -30%) triggers a health warning ("checkup"). */
export const WARNING_THRESHOLD = -0.3;

export type HealthState = 'healthy' | 'resilient' | 'warning';
export type ExitType = 'ascension' | 'relocation';

export interface ReturnStats {
  /** Market value change vs total cost (excludes dividends). */
  priceGain: number;
  /** priceGain + dividends captured. */
  totalReturn: number;
  /** totalReturn as a fraction of total cost. */
  pct: number;
  /** Annualized (CAGR) including dividends, or null when not computable. */
  cagr: number | null;
}

function parseDay(iso: string): Date {
  return new Date(iso + 'T00:00:00');
}

function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function daysBetween(startISO: string, endISO?: string): number {
  const start = parseDay(startISO);
  const end = endISO ? parseDay(endISO) : startOfToday();
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86_400_000));
}

/** Total days from first buy to sale (frozen for graduated holdings) or today. */
export function getHoldingDays(h: Holding): number {
  return daysBetween(h.buyDate, h.soldDate);
}

export function getTotalCost(h: Holding): number {
  return h.costBasis + (h.additionalBuys ?? []).reduce((sum, b) => sum + b.cost, 0);
}

export function getTotalQuantity(h: Holding): number {
  return h.quantity + (h.additionalBuys ?? []).reduce((sum, b) => sum + b.quantity, 0);
}

export function getTotalDividends(h: Holding): number {
  return (h.dividends ?? []).reduce((sum, d) => sum + d.amount, 0);
}

/** Number of purchases: the initial buy plus any DCA lots. */
export function getBuyCount(h: Holding): number {
  return 1 + (h.additionalBuys ?? []).length;
}

/** Compound annual growth rate. Returns null when the horizon is under a day. */
export function getCAGR(totalCost: number, finalValue: number, days: number): number | null {
  if (totalCost <= 0 || days < 1) return null;
  if (finalValue <= 0) return -1;
  const years = days / 365;
  return Math.pow(finalValue / totalCost, 1 / years) - 1;
}

/** Realized performance for a graduated (sold) holding, else null. */
export function getRealizedReturn(h: Holding): ReturnStats | null {
  if (h.soldDate === undefined || h.soldPrice === undefined) return null;
  const totalCost = getTotalCost(h);
  const dividends = getTotalDividends(h);
  const priceGain = h.soldPrice - totalCost;
  const totalReturn = priceGain + dividends;
  return {
    priceGain,
    totalReturn,
    pct: totalCost > 0 ? totalReturn / totalCost : 0,
    cagr: getCAGR(totalCost, h.soldPrice + dividends, getHoldingDays(h)),
  };
}

/** Unrealized performance for an active holding with a recorded current value, else null. */
export function getUnrealizedReturn(h: Holding): ReturnStats | null {
  if (h.soldDate !== undefined || h.currentValue === undefined) return null;
  const totalCost = getTotalCost(h);
  const dividends = getTotalDividends(h);
  const priceGain = h.currentValue - totalCost;
  const totalReturn = priceGain + dividends;
  return {
    priceGain,
    totalReturn,
    pct: totalCost > 0 ? totalReturn / totalCost : 0,
    cagr: getCAGR(totalCost, h.currentValue + dividends, getHoldingDays(h)),
  };
}

/** Market drawdown (negative = underwater) for an active priced holding, else null. */
export function getDrawdown(h: Holding): number | null {
  if (h.soldDate !== undefined || h.currentValue === undefined) return null;
  const totalCost = getTotalCost(h);
  if (totalCost <= 0) return null;
  return (h.currentValue - totalCost) / totalCost;
}

export function getHealthState(h: Holding): HealthState {
  if (h.soldDate !== undefined) return 'healthy';
  const drawdown = getDrawdown(h);
  if (drawdown !== null && drawdown <= WARNING_THRESHOLD) return 'warning';
  if (h.weatheredDip) return 'resilient';
  return 'healthy';
}

/**
 * Which graduation ceremony a sale earns.
 * A stop-loss is always a Peaceful Relocation; otherwise a non-negative total
 * return ascends to the Hall of Fame.
 */
export function getExitType(h: Holding): ExitType {
  if (h.sellReason === 'stop-loss') return 'relocation';
  const realized = getRealizedReturn(h);
  if (realized && realized.totalReturn < 0) return 'relocation';
  return 'ascension';
}

const percentFmt = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});

export function formatPercent(fraction: number): string {
  return percentFmt.format(fraction);
}
