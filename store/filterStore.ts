import { create } from "zustand";
import type { Difficulty } from "@/types/trek";

interface FilterState {
  difficulty: Difficulty | null;
  budgetMax: number | null;
  durationDays: number | null;
  groupSize: number | null;
  travelMonth: string | null;
  activeTab: "agencies" | "guides";
  setDifficulty: (v: Difficulty | null) => void;
  setBudgetMax: (v: number | null) => void;
  setDurationDays: (v: number | null) => void;
  setGroupSize: (v: number | null) => void;
  setTravelMonth: (v: string | null) => void;
  setActiveTab: (v: "agencies" | "guides") => void;
  setMany: (updates: Partial<FilterState>) => void;
  reset: () => void;
}

const defaults = {
  difficulty: null,
  budgetMax: null,
  durationDays: null,
  groupSize: null,
  travelMonth: null,
  activeTab: "agencies" as const,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaults,
  setDifficulty: (v) => set({ difficulty: v }),
  setBudgetMax: (v) => set({ budgetMax: v }),
  setDurationDays: (v) => set({ durationDays: v }),
  setGroupSize: (v) => set({ groupSize: v }),
  setTravelMonth: (v) => set({ travelMonth: v }),
  setActiveTab: (v) => set({ activeTab: v }),
  setMany: (updates) => set(updates),
  reset: () => set(defaults),
}));
