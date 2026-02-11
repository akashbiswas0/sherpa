import type { Difficulty } from "@/types/trek";

export const DIFFICULTIES: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "green" },
  intermediate: { label: "Intermediate", color: "yellow" },
  expert: { label: "Expert", color: "red" },
};
