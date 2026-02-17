import Link from "next/link";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { TrekImage } from "@/components/shared/TrekImage";
import { formatPrice } from "@/lib/utils/formatters";

interface GuideCardProps {
  id: string;
  name: string;
  trustScore: number;
  pricePerDay: number;
  yearsExperience: number;
  languages: string[];
  profileImageUrl?: string;
  isVerified: boolean;
}

export function GuideCard({
  id,
  name,
  trustScore,
  pricePerDay,
  yearsExperience,
  languages,
  profileImageUrl,
  isVerified,
}: GuideCardProps) {
  return (
    <Link
      href={`/guide/${id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        backgroundColor: "white",
        textDecoration: "none",
      }}
      className="hover:shadow-md transition-shadow"
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <TrekImage
            src={profileImageUrl ?? ""}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <span className="font-semibold text-gray-900">{name}</span>
          {isVerified && (
            <span className="text-xs text-green-700 font-medium">✓ Verified</span>
          )}
        </div>
        <TrustScoreBadge score={trustScore} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="text-xs text-gray-500">{yearsExperience}y experience</span>
        <span className="text-sm font-medium text-green-700">
          {formatPrice(pricePerDay)}/day
        </span>
      </div>

      <p className="text-xs text-gray-500">{languages.join(", ")}</p>
    </Link>
  );
}
