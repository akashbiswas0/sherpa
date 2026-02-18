import Link from "next/link";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { Button } from "@/components/primitives/Button";
import { formatPrice, formatDuration } from "@/lib/utils/formatters";
import type { Trek } from "@/types/trek";

interface PackageCardProps {
  trek: Trek;
  onInquire: (trekId: string) => void;
}

export function PackageCard({ trek, onInquire }: PackageCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 20,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Link
            href={`/trek/${trek._id}`}
            className="font-semibold text-gray-900 hover:text-green-700 text-lg"
          >
            {trek.name}
          </Link>
          <p className="text-sm text-gray-500">
            {trek.startLocation} → {trek.endLocation}
          </p>
        </div>
        <DifficultyBadge difficulty={trek.difficulty} />
      </div>

      <p className="text-sm text-gray-600">{trek.itinerarySummary}</p>

      <div style={{ display: "flex", gap: 16 }}>
        <span className="text-xs text-gray-500">
          ⏱ {formatDuration(trek.durationDays)}
        </span>
        <span className="text-xs text-gray-500">
          👥 {trek.minGroupSize}–{trek.maxGroupSize} people
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-lg font-bold text-green-700">
          {formatPrice(trek.pricePerPerson)}/person
        </span>
        <Button label="Connect" onClick={() => onInquire(trek._id)} variant="primary" />
      </div>
    </div>
  );
}
