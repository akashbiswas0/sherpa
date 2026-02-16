import { Badge } from "@/components/primitives/Badge";
import { DIFFICULTIES } from "@/lib/constants/difficulties";
import type { Difficulty } from "@/types/trek";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const difficultyVariant: Record<Difficulty, "green" | "yellow" | "red"> = {
  beginner: "green",
  intermediate: "yellow",
  expert: "red",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Badge
      label={DIFFICULTIES[difficulty].label}
      variant={difficultyVariant[difficulty]}
    />
  );
}
