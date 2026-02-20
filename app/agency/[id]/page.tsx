"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useInquiry } from "@/hooks/useInquiry";
import { useTreks } from "@/hooks/useTreks";
import { AgencyHeader } from "@/components/agency/AgencyHeader";
import { PackageList } from "@/components/agency/PackageList";
import { TrustBreakdown } from "@/components/agency/TrustBreakdown";
import { LoginModal } from "@/components/inquiry/LoginModal";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { Modal } from "@/components/primitives/Modal";
import { Spinner } from "@/components/primitives/Spinner";
import { Button } from "@/components/primitives/Button";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AgencyPage({ params }: PageProps) {
  const { id } = use(params);
  const agency = useQuery(api.agencies.getById, { id: id as Id<"agencies"> });
  const { treks, isLoading: treksLoading } = useTreks(id);

  const inquiry = useInquiry({
    destinationId: agency?.destinationId ?? "",
    agencyId: id,
    source: "agency_detail",
    whatsappNumber: agency?.whatsappNumber,
  });

  if (agency === undefined) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (agency === null) {
    return <p className="text-center py-20 text-gray-500">Agency not found.</p>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <AgencyHeader agency={agency} />

      <div style={{ marginTop: 32 }}>
        <TrustBreakdown
          breakdown={agency.trustScoreBreakdown}
          totalScore={agency.trustScore}
        />
      </div>

      <div style={{ marginTop: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 className="text-xl font-semibold text-gray-900">Trek Packages</h2>
          <Button
            label="Connect with Agency"
            onClick={inquiry.handleConnectClick}
            variant="primary"
          />
        </div>
        <PackageList
          treks={treks}
          isLoading={treksLoading}
          onInquire={(trekId) => inquiry.handleConnectClick()}
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
