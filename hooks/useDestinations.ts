import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useDestinations() {
  const destinations = useQuery(api.destinations.listDestinations);

  return {
    destinations: destinations ?? [],
    isLoading: destinations === undefined,
    isEmpty: destinations !== undefined && destinations.length === 0,
  };
}
