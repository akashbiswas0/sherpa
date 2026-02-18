import { TrekImage } from "@/components/shared/TrekImage";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { Badge } from "@/components/primitives/Badge";
import type { Agency } from "@/types/agency";

interface AgencyHeaderProps {
  agency: Agency;
}

export function AgencyHeader({ agency }: AgencyHeaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {agency.logoUrl && (
          <div style={{ width: 80, height: 80, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative" }}>
            <TrekImage src={agency.logoUrl} alt={agency.name} fill className="object-contain" />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 className="text-2xl font-bold text-gray-900">{agency.name}</h1>
            {agency.isVerified && <Badge label="Verified" variant="green" />}
          </div>
          <p className="text-sm text-gray-600">{agency.address}</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <TrustScoreBadge score={agency.trustScore} />
            <span className="text-sm text-gray-500">
              ⭐ {agency.googleRating.toFixed(1)} ({agency.googleReviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700">{agency.description}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {agency.specialities.map((s) => (
          <Badge key={s} label={s} variant="gray" />
        ))}
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="text-xs text-gray-500">Years active</span>
          <span className="font-semibold text-gray-900">{agency.yearsInBusiness}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="text-xs text-gray-500">Languages</span>
          <span className="font-semibold text-gray-900">{agency.languages.join(", ")}</span>
        </div>
      </div>
    </div>
  );
}
