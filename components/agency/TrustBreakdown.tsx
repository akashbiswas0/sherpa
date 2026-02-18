import type { Agency } from "@/types/agency";

interface TrustBreakdownProps {
  breakdown: Agency["trustScoreBreakdown"];
  totalScore: number;
}

function ScoreRow({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = (score / max) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-medium text-gray-900">
          {score.toFixed(1)}/{max}
        </span>
      </div>
      <div style={{ height: 6, backgroundColor: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: "#15803d",
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}

export function TrustBreakdown({ breakdown, totalScore }: TrustBreakdownProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 20,
        borderRadius: 12,
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 className="font-semibold text-gray-900">Trust Score</h3>
        <span className="text-2xl font-bold text-green-700">{totalScore}/10</span>
      </div>
      <ScoreRow label="Google Rating" score={breakdown.googleRating} max={3} />
      <ScoreRow label="Review Volume" score={breakdown.reviewVolume} max={2} />
      <ScoreRow label="Years Active" score={breakdown.yearsActive} max={2} />
      <ScoreRow label="Verified Status" score={breakdown.verifiedStatus} max={2} />
      <ScoreRow label="Response Time" score={breakdown.responseTime} max={1} />
    </div>
  );
}
