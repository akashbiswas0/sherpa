export type Difficulty = "beginner" | "intermediate" | "expert";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  altitude?: number;
  distance?: number;
}

export interface Trek {
  _id: string;
  name: string;
  agencyId: string;
  destinationId: string;
  durationDays: number;
  pricePerPerson: number;
  difficulty: Difficulty;
  maxGroupSize: number;
  minGroupSize: number;
  startLocation: string;
  endLocation: string;
  itinerarySummary: string;
  itineraryDays: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  availableMonths: string[];
  highlights: string[];
  isActive: boolean;
}
