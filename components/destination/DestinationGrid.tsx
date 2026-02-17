import { DestinationCard } from "@/components/destination/DestinationCard";
import { Spinner } from "@/components/primitives/Spinner";
import type { Destination } from "@/types/destination";

interface DestinationGridProps {
  destinations: Destination[];
  isLoading: boolean;
}

export function DestinationGrid({ destinations, isLoading }: DestinationGridProps) {
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <p className="text-gray-500 text-center py-12">No destinations found.</p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 24,
      }}
    >
      {destinations.map((dest) => (
        <DestinationCard key={dest._id} destination={dest} />
      ))}
    </div>
  );
}
