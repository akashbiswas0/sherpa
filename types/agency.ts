export interface TrustScoreBreakdown {
  googleRating: number;
  reviewVolume: number;
  yearsActive: number;
  verifiedStatus: number;
  responseTime: number;
}

export interface Agency {
  _id: string;
  name: string;
  destinationId: string;
  description: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber: string;
  email?: string;
  address: string;
  yearsInBusiness: number;
  googleRating: number;
  googleReviewCount: number;
  instagramHandle?: string;
  isVerified: boolean;
  trustScore: number;
  trustScoreBreakdown: TrustScoreBreakdown;
  specialities: string[];
  languages: string[];
  certifications: string[];
  isActive: boolean;
}
