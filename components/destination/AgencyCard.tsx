import Link from "next/link";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { formatPrice } from "@/lib/utils/formatters";

interface AgencyCardProps {
  id: string;
  name: string;
  trustScore: number;
  priceFrom: number;
  specialities: string[];
  isVerified: boolean;
  whatsappNumber: string;
  onSelect: (id: string) => void;
  onCompareToggle: (id: string) => void;
  isInCompare: boolean;
}

export function AgencyCard({
  id,
  name,
  trustScore,
  priceFrom,
  specialities,
  isVerified,
  onSelect,
  onCompareToggle,
  isInCompare,
}: AgencyCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Link
            href={`/agency/${id}`}
            className="font-semibold text-gray-900 hover:text-green-700"
          >
            {name}
          </Link>
          {isVerified && <Badge label="Verified" variant="green" />}
        </div>
        <TrustScoreBadge score={trustScore} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {specialities.slice(0, 3).map((s) => (
          <Badge key={s} label={s} variant="gray" />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text-sm font-medium text-green-700">
          From {formatPrice(priceFrom)}
        </span>
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isInCompare}
            onChange={() => onCompareToggle(id)}
            className="accent-green-700"
          />
          <span className="text-xs text-gray-500">Compare</span>
        </label>
      </div>

      <Button label="View Agency" onClick={() => onSelect(id)} variant="secondary" fullWidth />
    </div>
  );
}
