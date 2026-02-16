import { INCLUSIONS } from "@/lib/constants/inclusions";
import type { InclusionKey } from "@/lib/constants/inclusions";

interface InclusionIconProps {
  inclusionKey: InclusionKey;
  showLabel?: boolean;
}

export function InclusionIcon({ inclusionKey, showLabel = true }: InclusionIconProps) {
  const inclusion = INCLUSIONS[inclusionKey];
  if (!inclusion) return null;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span aria-hidden="true">{inclusion.icon}</span>
      {showLabel && <span className="text-xs text-gray-600">{inclusion.label}</span>}
    </span>
  );
}
