import Link from "next/link";
import { TrekImage } from "@/components/shared/TrekImage";
import { formatPrice } from "@/lib/utils/formatters";
import type { Destination } from "@/types/destination";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link
      href={`/destination/${destination.slug}`}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}
      className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div style={{ position: "relative", height: 200 }}>
        <TrekImage
          src={destination.heroImageUrl}
          alt={destination.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        <h3 className="font-semibold text-gray-900 text-base">{destination.name}</h3>
        <p className="text-xs text-gray-500">{destination.region}</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="text-xs text-gray-600">
            {destination.agencyCount} agencies
          </span>
          <span className="text-xs font-medium text-green-700">
            From {formatPrice(destination.startingPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
