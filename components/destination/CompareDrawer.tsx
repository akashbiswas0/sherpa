"use client";

import { Button } from "@/components/primitives/Button";
import { TrustScoreBadge } from "@/components/shared/TrustScoreBadge";
import { formatPrice } from "@/lib/utils/formatters";

interface CompareAgency {
  id: string;
  name: string;
  trustScore: number;
  priceFrom: number;
  inclusions: string[];
}

interface CompareDrawerProps {
  agencies: CompareAgency[];
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
}

export function CompareDrawer({ agencies, isOpen, onClose, selectedIds }: CompareDrawerProps) {
  const selected = agencies.filter((a) => selectedIds.includes(a.id));

  if (!isOpen || selected.length < 2) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "white",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
        maxHeight: "60vh",
        overflowY: "auto",
        padding: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 className="text-lg font-semibold">Compare Agencies</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
        {selected.map((agency) => (
          <div
            key={agency.id}
            style={{
              minWidth: 200,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 16,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
          >
            <p className="font-semibold text-gray-900">{agency.name}</p>
            <TrustScoreBadge score={agency.trustScore} />
            <p className="text-sm text-green-700 font-medium">
              From {formatPrice(agency.priceFrom)}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {agency.inclusions.slice(0, 5).map((inc) => (
                <span key={inc} className="text-xs text-gray-500">
                  • {inc}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Button label="Clear comparison" onClick={onClose} variant="ghost" />
      </div>
    </div>
  );
}
