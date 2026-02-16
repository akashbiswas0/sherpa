import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useTreks(agencyId: string) {
  const treks = useQuery(api.treks.listByAgency, {
    agencyId: agencyId as Id<"agencies">,
  });

  return {
    treks: treks ?? [],
    isLoading: treks === undefined,
    isEmpty: treks !== undefined && treks.length === 0,
  };
}
