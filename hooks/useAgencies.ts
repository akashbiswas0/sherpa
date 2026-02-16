import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFilterStore } from "@/store/filterStore";

export function useAgencies(destinationSlug: string) {
  const { difficulty, budgetMax, durationDays } = useFilterStore();

  const agencies = useQuery(api.agencies.listByDestination, {
    destinationSlug,
    difficulty: difficulty ?? undefined,
    budgetMax: budgetMax ?? undefined,
    durationDays: durationDays ?? undefined,
  });

  const sorted = agencies
    ? [...agencies].sort((a, b) => b.trustScore - a.trustScore)
    : [];

  return {
    agencies: sorted,
    isLoading: agencies === undefined,
    isEmpty: agencies !== undefined && agencies.length === 0,
  };
}
