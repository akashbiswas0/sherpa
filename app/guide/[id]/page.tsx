"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useInquiry } from "@/hooks/useInquiry";
import { TrekImage } from "@/components/shared/TrekImage";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { LoginModal } from "@/components/inquiry/LoginModal";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { Modal } from "@/components/primitives/Modal";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Spinner } from "@/components/primitives/Spinner";
import { formatPrice } from "@/lib/utils/formatters";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GuidePage({ params }: PageProps) {
  const { id } = use(params);
  const guide = useQuery(api.guides.getById, { id: id as Id<"guides"> });

  const inquiry = useInquiry({
    destinationId: guide?.destinationId ?? "",
    guideId: id,
    source: "guide_detail",
    whatsappNumber: guide?.whatsappNumber,
  });

  if (guide === undefined) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (guide === null) {
    return <p className="text-center py-20 text-gray-500">Guide not found.</p>;
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
      {/* Profile */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {guide.profileImageUrl && (
          <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative" }}>
            <TrekImage src={guide.profileImageUrl} alt={guide.name} fill className="object-cover" />
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 className="text-2xl font-bold text-gray-900">{guide.name}</h1>
            {guide.isVerified && <Badge label="Verified" variant="green" />}
          </div>
          <TrustScoreBadge score={guide.trustScore} />
          <p className="text-sm text-gray-600">{guide.bio}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="text-xs text-gray-500">Experience</span>
          <span className="font-semibold">{guide.yearsExperience} years</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="text-xs text-gray-500">Languages</span>
          <span className="font-semibold">{guide.languages.join(", ")}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="text-xs text-gray-500">Max group size</span>
          <span className="font-semibold">{guide.maxGroupSize} people</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="text-xs text-gray-500">Price</span>
          <span className="font-semibold text-green-700">
            {formatPrice(guide.pricePerDay)}/day
          </span>
        </div>
      </div>

      {/* Routes */}
      {guide.specialRoutes.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Specialty Routes</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {guide.specialRoutes.map((r: string) => (
              <Badge key={r} label={r} variant="gray" />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <Button
          label="Connect with Guide"
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
        title="Send Inquiry"
      >
        <InquiryForm
          onSubmit={inquiry.submitInquiry}
          isSubmitting={inquiry.isSubmitting}
        />
      </Modal>
    </div>
  );
}
