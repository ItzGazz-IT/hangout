import { create } from 'zustand';
import type { EventCategory } from '@types/event.types';

export interface EventFilters {
  category: EventCategory | null;
  isFree: boolean | null;
  dateRange: 'today' | 'weekend' | 'month' | null;
  province: string | null;
  city: string | null;
}

interface EventsState {
  filters: EventFilters;
  setFilters: (filters: Partial<EventFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: EventFilters = {
  category: null,
  isFree: null,
  dateRange: null,
  province: null,
  city: null,
};

export const useEventsStore = create<EventsState>((set) => ({
  filters: defaultFilters,

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),

  resetFilters: () => set({ filters: defaultFilters }),
}));
