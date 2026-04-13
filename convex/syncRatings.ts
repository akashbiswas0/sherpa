// @ts-nocheck
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/** Replicates the trust score formula from seed.ts */
function calcTrust(
  rating: number,
  reviews: number,
  years: number,
  verified: boolean
) {
  const r = Math.round(((rating - 3) / 2) * 40);
  const rv = Math.min(20, Math.floor(reviews / 25));
  const ya = Math.min(20, Math.floor(years / 2));
  const vs = verified ? 20 : 0;
  const rt = 12;
  return {
    trustScore: r + rv + ya + vs + rt,
    trustScoreBreakdown: {
      googleRating: r,
      reviewVolume: rv,
      yearsActive: ya,
      verifiedStatus: vs,
      responseTime: rt,
    },
  };
}

/** Patch a single agency with real rating data */
export const patchAgencyRating = internalMutation({
  args: {
    agencyId: v.id("agencies"),
    googleRating: v.number(),
    googleReviewCount: v.number(),
    trustScore: v.number(),
    trustScoreBreakdown: v.object({
      googleRating: v.number(),
      reviewVolume: v.number(),
      yearsActive: v.number(),
      verifiedStatus: v.number(),
      responseTime: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { agencyId, ...patch } = args;
    await ctx.db.patch(agencyId, patch);
  },
});

/**
 * Fetches real Google ratings for every agency via Places Text Search API.
 * Run once: npx convex run syncRatings:syncAllRatings
 *
 * Requires GOOGLE_PLACES_API_KEY set in Convex dashboard environment variables.
 */
export const syncAllRatings = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GOOGLE_PLACES_API_KEY not set. Add it in the Convex dashboard → Settings → Environment Variables."
      );
    }

    const agencies = await ctx.runQuery(internal.syncRatings.getAllAgencies);

    const results: { name: string; status: string; rating?: number; reviews?: number }[] = [];

    for (const agency of agencies) {
      // Build a precise query: "Agency Name, City, Uttarakhand"
      const query = `${agency.name} ${agency.address}`;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK" || !data.results?.length) {
          results.push({ name: agency.name, status: `NOT_FOUND (${data.status})` });
          continue;
        }

        const place = data.results[0];
        const googleRating: number = place.rating ?? agency.googleRating;
        const googleReviewCount: number = place.user_ratings_total ?? agency.googleReviewCount;

        const { trustScore, trustScoreBreakdown } = calcTrust(
          googleRating,
          googleReviewCount,
          agency.yearsInBusiness,
          agency.isVerified
        );

        await ctx.runMutation(internal.syncRatings.patchAgencyRating, {
          agencyId: agency._id,
          googleRating,
          googleReviewCount,
          trustScore,
          trustScoreBreakdown,
        });

        results.push({ name: agency.name, status: "OK", rating: googleRating, reviews: googleReviewCount });
      } catch (err) {
        results.push({ name: agency.name, status: `ERROR: ${String(err)}` });
      }
    }

    return results;
  },
});

/** Internal query — returns all agencies (used by the action above) */
export const getAllAgencies = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agencies").collect();
  },
});
