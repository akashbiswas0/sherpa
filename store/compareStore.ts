import { create } from "zustand";

interface CompareState {
  selectedIds: string[];
  toggle: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selectedIds: [],
  toggle: (id) => {
    const { selectedIds } = get();
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter((s) => s !== id) });
    } else if (selectedIds.length < 3) {
      set({ selectedIds: [...selectedIds, id] });
    }
  },
  clear: () => set({ selectedIds: [] }),
  isSelected: (id) => get().selectedIds.includes(id),
  isFull: () => get().selectedIds.length >= 3,
}));
