import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Holding, BuyLot, DividendRecord, SellReason } from '../types';
import { getTotalCost, DIP_THRESHOLD } from '../utils/performance';

interface HoldingStore {
  holdings: Holding[];
  addHolding: (data: Omit<Holding, 'id'>) => void;
  updateHolding: (id: string, updates: Partial<Holding>) => void;
  addBuy: (id: string, lot: Omit<BuyLot, 'id'>) => void;
  addDividend: (id: string, record: Omit<DividendRecord, 'id'>) => void;
  updateCurrentValue: (id: string, currentValue: number) => void;
  sellHolding: (id: string, soldDate: string, soldPrice: number, sellReason: SellReason) => void;
  deleteHolding: (id: string) => void;
}

export const useHoldingStore = create<HoldingStore>()(
  persist(
    (set) => ({
      holdings: [],
      addHolding: (data) =>
        set((state) => ({
          holdings: [...state.holdings, { ...data, id: crypto.randomUUID() }],
        })),
      updateHolding: (id, updates) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id ? { ...h, ...updates } : h,
          ),
        })),
      addBuy: (id, lot) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id
              ? { ...h, additionalBuys: [...(h.additionalBuys ?? []), { ...lot, id: crypto.randomUUID() }] }
              : h,
          ),
        })),
      addDividend: (id, record) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id
              ? { ...h, dividends: [...(h.dividends ?? []), { ...record, id: crypto.randomUUID() }] }
              : h,
          ),
        })),
      updateCurrentValue: (id, currentValue) =>
        set((state) => ({
          holdings: state.holdings.map((h) => {
            if (h.id !== id) return h;
            const drawdown = (currentValue - getTotalCost(h)) / getTotalCost(h);
            return {
              ...h,
              currentValue,
              weatheredDip: h.weatheredDip || drawdown <= DIP_THRESHOLD,
            };
          }),
        })),
      sellHolding: (id, soldDate, soldPrice, sellReason) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id ? { ...h, soldDate, soldPrice, sellReason } : h,
          ),
        })),
      deleteHolding: (id) =>
        set((state) => ({
          holdings: state.holdings.filter((h) => h.id !== id),
        })),
    }),
    { name: 'companion-portfolio', version: 1 },
  ),
);

export const selectActiveHoldings = (state: HoldingStore) =>
  state.holdings.filter((h) => !h.soldDate);

export const selectSoldHoldings = (state: HoldingStore) =>
  state.holdings.filter((h) => h.soldDate);

export const selectHoldingById = (id: string) => (state: HoldingStore) =>
  state.holdings.find((h) => h.id === id);
