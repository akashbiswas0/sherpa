export interface Destination {
  _id: string;
  name: string;
  slug: string;
  region: string;
  heroImageUrl: string;
  description: string;
  altitude?: number;
  bestMonths: string[];
  agencyCount: number;
  startingPrice: number;
  isActive: boolean;
}
