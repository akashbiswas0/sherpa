import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGuides(destinationSlug: string) {
  const guides = useQuery(api.guides.listByDestination, { destinationSlug });

  const sorted = guides
    ? [...guides].sort((a, b) => b.trustScore - a.trustScore)
    : [];

  return {
    guides: sorted,
    isLoading: guides === undefined,
    isEmpty: guides !== undefined && guides.length === 0,
  };
}
