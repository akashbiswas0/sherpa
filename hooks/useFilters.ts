"use client";

import { useFilterStore } from "@/store/filterStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { Difficulty } from "@/types/trek";

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useFilterStore();

  useEffect(() => {
    const difficulty = searchParams.get("difficulty") as Difficulty | null;
    const budgetMax = searchParams.get("budgetMax");
    const durationDays = searchParams.get("durationDays");
    if (difficulty) store.setDifficulty(difficulty);
    if (budgetMax) store.setBudgetMax(Number(budgetMax));
    if (durationDays) store.setDurationDays(Number(durationDays));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilters(updates: {
    difficulty?: Difficulty | null;
    budgetMax?: number | null;
    durationDays?: number | null;
    groupSize?: number | null;
    travelMonth?: string | null;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    router.replace(`?${params.toString()}`, { scroll: false });
    store.setMany(updates);
  }

  return { ...store, applyFilters };
}
