"use client";

import { useRouter } from "next/navigation";
import { useAgencies } from "@/hooks/useAgencies";
import { useGuides } from "@/hooks/useGuides";
import { useFilters } from "@/hooks/useFilters";
import { useCompare } from "@/hooks/useCompare";
import { AgencyCard } from "@/components/destination/AgencyCard";
import { GuideCard } from "@/components/destination/GuideCard";
import { FilterBar } from "@/components/destination/FilterBar";
import { CompareDrawer } from "@/components/destination/CompareDrawer";
import { Spinner } from "@/components/primitives/Spinner";
import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DestinationPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const filters = useFilters();
  const { agencies, isLoading: agenciesLoading } = useAgencies(slug);
  const { guides, isLoading: guidesLoading } = useGuides(slug);
  const { selectedIds, toggle, clear, isSelected, isVisible } = useCompare();

  // Build compare agency data for drawer
  const compareAgencies = agencies.map((a) => ({
    id: a._id,
    name: a.name,
    trustScore: a.trustScore,
    priceFrom: 0,
    inclusions: [],
  }));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
        {slug.replace(/-/g, " ")}
      </h1>

      <FilterBar
        difficulty={filters.difficulty}
        budgetMax={filters.budgetMax}
        durationDays={filters.durationDays}
        activeTab={filters.activeTab}
        onApply={filters.applyFilters}
        onTabChange={(tab) => filters.setActiveTab(tab)}
        onReset={filters.reset}
      />

      <div style={{ marginTop: 32 }}>
        {filters.activeTab === "agencies" ? (
          agenciesLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
              <Spinner size="lg" />
            </div>
          ) : agencies.length === 0 ? (
            <p className="text-gray-500 text-center py-12">
              No agencies found. Try adjusting filters.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {agencies.map((agency) => (
                <AgencyCard
                  key={agency._id}
                  id={agency._id}
                  name={agency.name}
                  trustScore={agency.trustScore}
                  priceFrom={0}
                  specialities={agency.specialities}
                  isVerified={agency.isVerified}
                  whatsappNumber={agency.whatsappNumber}
                  onSelect={(id) => router.push(`/agency/${id}`)}
                  onCompareToggle={toggle}
                  isInCompare={isSelected(agency._id)}
                />
              ))}
            </div>
          )
        ) : guidesLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <Spinner size="lg" />
          </div>
        ) : guides.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No local guides found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {guides.map((guide) => (
              <GuideCard
                key={guide._id}
                id={guide._id}
                name={guide.name}
                trustScore={guide.trustScore}
                pricePerDay={guide.pricePerDay}
                yearsExperience={guide.yearsExperience}
                languages={guide.languages}
                profileImageUrl={guide.profileImageUrl}
                isVerified={guide.isVerified}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky compare bar */}
      {isVisible && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            backgroundColor: "#15803d",
            color: "white",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="text-sm font-medium">
            {selectedIds.length} agencies selected
          </span>
        </div>
      )}

      <CompareDrawer
        agencies={compareAgencies}
        isOpen={isVisible}
        onClose={clear}
        selectedIds={selectedIds}
      />
    </div>
  );
}
