export interface Guide {
  _id: string;
  name: string;
  destinationId: string;
  profileImageUrl?: string;
  bio: string;
  phone: string;
  whatsappNumber: string;
  yearsExperience: number;
  languages: string[];
  specialRoutes: string[];
  googleRating?: number;
  googleReviewCount?: number;
  trustScore: number;
  pricePerDay: number;
  maxGroupSize: number;
  isVerified: boolean;
  isActive: boolean;
}
