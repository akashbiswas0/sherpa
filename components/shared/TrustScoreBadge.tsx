import { Badge } from "@/components/primitives/Badge";

interface TrustScoreBadgeProps {
  score: number;
  showLabel?: boolean;
}

function scoreVariant(score: number): "green" | "yellow" | "red" {
  if (score >= 7) return "green";
  if (score >= 4) return "yellow";
  return "red";
}

export function TrustScoreBadge({ score, showLabel = true }: TrustScoreBadgeProps) {
  return (
    <Badge
      label={showLabel ? `Trust ${score}/10` : `${score}`}
      variant={scoreVariant(score)}
    />
  );
}
