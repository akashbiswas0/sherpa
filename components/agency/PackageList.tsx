import { PackageCard } from "@/components/agency/PackageCard";
import { Spinner } from "@/components/primitives/Spinner";
import type { Trek } from "@/types/trek";

interface PackageListProps {
  treks: Trek[];
  isLoading: boolean;
  onInquire: (trekId: string) => void;
}

export function PackageList({ treks, isLoading, onInquire }: PackageListProps) {
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
        <Spinner />
      </div>
    );
  }

  if (treks.length === 0) {
    return <p className="text-gray-500 py-8">No trek packages listed yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {treks.map((trek) => (
        <PackageCard key={trek._id} trek={trek} onInquire={onInquire} />
      ))}
    </div>
  );
}
