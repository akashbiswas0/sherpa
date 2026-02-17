"use client";

import { Button } from "@/components/primitives/Button";
import { Select } from "@/components/primitives/Select";
import type { Difficulty } from "@/types/trek";

interface FilterBarProps {
  difficulty: Difficulty | null;
  budgetMax: number | null;
  durationDays: number | null;
  activeTab: "agencies" | "guides";
  onApply: (updates: {
    difficulty?: Difficulty | null;
    budgetMax?: number | null;
    durationDays?: number | null;
  }) => void;
  onTabChange: (tab: "agencies" | "guides") => void;
  onReset: () => void;
}

const difficultyOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

const budgetOptions = [
  { value: "5000", label: "Up to ₹5,000" },
  { value: "10000", label: "Up to ₹10,000" },
  { value: "20000", label: "Up to ₹20,000" },
  { value: "50000", label: "Up to ₹50,000" },
];

const durationOptions = [
  { value: "1", label: "1 day" },
  { value: "3", label: "Up to 3 days" },
  { value: "5", label: "Up to 5 days" },
  { value: "7", label: "Up to 7 days" },
];

export function FilterBar({
  difficulty,
  budgetMax,
  durationDays,
  activeTab,
  onApply,
  onTabChange,
  onReset,
}: FilterBarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tab toggle */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onTabChange("agencies")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "agencies"
              ? "bg-green-700 text-white"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Agencies
        </button>
        <button
          onClick={() => onTabChange("guides")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "guides"
              ? "bg-green-700 text-white"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Local Guides
        </button>
      </div>

      {/* Filter controls */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <Select
          label="Difficulty"
          options={difficultyOptions}
          placeholder="Any difficulty"
          value={difficulty ?? ""}
          onChange={(e) =>
            onApply({ difficulty: (e.target.value as Difficulty) || null })
          }
        />
        <Select
          label="Budget"
          options={budgetOptions}
          placeholder="Any budget"
          value={budgetMax ? String(budgetMax) : ""}
          onChange={(e) =>
            onApply({ budgetMax: e.target.value ? Number(e.target.value) : null })
          }
        />
        <Select
          label="Duration"
          options={durationOptions}
          placeholder="Any duration"
          value={durationDays ? String(durationDays) : ""}
          onChange={(e) =>
            onApply({ durationDays: e.target.value ? Number(e.target.value) : null })
          }
        />
        <Button label="Reset" onClick={onReset} variant="ghost" />
      </div>
    </div>
  );
}
