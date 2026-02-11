export const REGIONS = {
  Uttarakhand: [
    "rishikesh",
    "chopta",
    "kedarkantha",
    "mussoorie",
    "har-ki-dun",
    "valley-of-flowers",
  ],
} as const;

export type Region = keyof typeof REGIONS;
