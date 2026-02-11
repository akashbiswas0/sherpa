import type { Difficulty } from "@/types/trek";

export interface Filters {
  difficulty: Difficulty | null;
  budgetMax: number | null;
  durationDays: number | null;
  groupSize: number | null;
  travelMonth: string | null;
  activeTab: "agencies" | "guides";
}
