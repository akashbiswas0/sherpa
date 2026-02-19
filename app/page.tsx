"use client";

import { useDestinations } from "@/hooks/useDestinations";
import { DestinationGrid } from "@/components/destination/DestinationGrid";

export default function LandingPage() {
  const { destinations, isLoading } = useDestinations();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Trek
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Compare verified trekking agencies and local guides. Read real reviews.
          Connect directly via WhatsApp.
        </p>
      </div>

      <DestinationGrid destinations={destinations} isLoading={isLoading} />
    </div>
  );
}
