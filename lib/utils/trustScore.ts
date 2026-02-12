interface TrustInputs {
  googleRating: number;
  googleReviewCount: number;
  yearsInBusiness: number;
  isVerified: boolean;
  avgResponseTimeHours: number;
}

export function computeTrustScore(inputs: TrustInputs): number {
  const ratingScore   = (inputs.googleRating / 5) * 3;
  const reviewScore   = Math.min(inputs.googleReviewCount / 100, 1) * 2;
  const yearsScore    = Math.min(inputs.yearsInBusiness / 10, 1) * 2;
  const verifiedScore = inputs.isVerified ? 2 : 0;
  const responseScore = inputs.avgResponseTimeHours <= 2 ? 1 : 0;

  return Math.round((ratingScore + reviewScore + yearsScore + verifiedScore + responseScore) * 10) / 10;
}
