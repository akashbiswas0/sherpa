"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useInquiry } from "@/hooks/useInquiry";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { InclusionIcon } from "@/components/shared/InclusionIcon";
import { LoginModal } from "@/components/inquiry/LoginModal";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { Modal } from "@/components/primitives/Modal";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Spinner } from "@/components/primitives/Spinner";
import { formatPrice, formatDuration } from "@/lib/utils/formatters";
import type { InclusionKey } from "@/lib/constants/inclusions";
import { INCLUSIONS } from "@/lib/constants/inclusions";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TrekPage({ params }: PageProps) {
  const { id } = use(params);
  const trek = useQuery(api.treks.getById, { id: id as Id<"treks"> });

  const inquiry = useInquiry({
    destinationId: trek?.destinationId ?? "",
    trekId: id,
    agencyId: trek?.agencyId,
    source: "trek_detail",
    trekName: trek?.name,
  });

  if (trek === undefined) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (trek === null) {
    return <p className="text-center py-20 text-gray-500">Trek not found.</p>;
  }

  const knownInclusions = trek.inclusions.filter(
    (i: string): i is InclusionKey => i in INCLUSIONS
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 className="text-3xl font-bold text-gray-900">{trek.name}</h1>
          <DifficultyBadge difficulty={trek.difficulty} />
        </div>
        <p className="text-gray-600">
          {trek.startLocation} → {trek.endLocation}
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <span className="text-sm text-gray-500">
            ⏱ {formatDuration(trek.durationDays)}
          </span>
          <span className="text-sm text-gray-500">
            👥 {trek.minGroupSize}–{trek.maxGroupSize} people
          </span>
        </div>
        <p className="text-2xl font-bold text-green-700">
          {formatPrice(trek.pricePerPerson)}/person
        </p>
      </div>

      {/* Summary */}
      <p className="text-gray-700 mt-6">{trek.itinerarySummary}</p>

      {/* Highlights */}
      {trek.highlights.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Highlights</h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {trek.highlights.map((h: string) => (
              <li key={h} className="text-sm text-gray-600 flex items-start gap-2">
                <span>✓</span> {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inclusions */}
      {knownInclusions.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Included</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {knownInclusions.map((key: InclusionKey) => (
              <InclusionIcon key={key} inclusionKey={key} />
            ))}
          </div>
        </div>
      )}

      {/* Itinerary */}
      <div style={{ marginTop: 32 }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {trek.itineraryDays.map((day: { day: number; title: string; description: string; altitude?: number; distance?: number }) => (
            <div
              key={day.day}
              style={{
                padding: 16,
                borderLeft: "4px solid #15803d",
                backgroundColor: "#f9fafb",
                borderRadius: 4,
              }}
            >
              <p className="text-sm font-semibold text-green-700 mb-1">Day {day.day}</p>
              <p className="font-semibold text-gray-900">{day.title}</p>
              <p className="text-sm text-gray-600 mt-2">{day.description}</p>
              {(day.altitude || day.distance) && (
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  {day.altitude && (
                    <span className="text-xs text-gray-500">
                      ⛰ {day.altitude}m
                    </span>
                  )}
                  {day.distance && (
                    <span className="text-xs text-gray-500">
                      📍 {day.distance}km
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: 40 }}>
        <Button
          label="Send Inquiry"
          onClick={inquiry.handleConnectClick}
          variant="primary"
          fullWidth
        />
      </div>

      <LoginModal
        isOpen={inquiry.showLoginModal}
        onClose={inquiry.closeLoginModal}
        onLoginSuccess={inquiry.handleLoginSuccess}
      />

      <Modal
        isOpen={inquiry.showInquiryForm}
        onClose={inquiry.closeInquiryForm}
        title={`Inquire about ${trek.name}`}
      >
        <InquiryForm
          onSubmit={inquiry.submitInquiry}
          isSubmitting={inquiry.isSubmitting}
        />
      </Modal>
    </div>
  );
}
