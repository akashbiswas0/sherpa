export const INCLUSIONS = {
  meals: { label: "Meals", icon: "🍽️" },
  tent: { label: "Tent", icon: "⛺" },
  guide: { label: "Guide", icon: "🧭" },
  transport: { label: "Transport", icon: "🚌" },
  firstAid: { label: "First Aid", icon: "🩺" },
  porter: { label: "Porter", icon: "🎒" },
  permits: { label: "Permits", icon: "📋" },
  insurance: { label: "Insurance", icon: "🛡️" },
} as const;

export type InclusionKey = keyof typeof INCLUSIONS;
