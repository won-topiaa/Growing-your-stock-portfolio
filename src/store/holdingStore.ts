import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Holding } from '../types';

interface HoldingStore {
  holdings: Holding[];
  addHolding: (data: Omit<Holding, 'id'>) => void;
  updateHolding: (id: string, updates: Partial<Holding>) => void;
  sellHolding: (id: string, soldDate: string, soldPrice: number) => void;
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
      sellHolding: (id, soldDate, soldPrice) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id ? { ...h, soldDate, soldPrice } : h,
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
