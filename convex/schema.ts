import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  destinations: defineTable({
    name: v.string(),
    slug: v.string(),
    region: v.string(),
    heroImageUrl: v.string(),
    description: v.string(),
    altitude: v.optional(v.number()),
    bestMonths: v.array(v.string()),
    agencyCount: v.number(),
    startingPrice: v.number(),
    isActive: v.boolean(),
  }).index("by_slug", ["slug"]),

  agencies: defineTable({
    name: v.string(),
    destinationId: v.id("destinations"),
    description: v.string(),
    logoUrl: v.optional(v.string()),
    phone: v.string(),
    whatsappNumber: v.string(),
    email: v.optional(v.string()),
    address: v.string(),
    yearsInBusiness: v.number(),
    googleRating: v.number(),
    googleReviewCount: v.number(),
    instagramHandle: v.optional(v.string()),
    googleMapsUrl: v.optional(v.string()),
    isVerified: v.boolean(),
    trustScore: v.number(),
    trustScoreBreakdown: v.object({
      googleRating: v.number(),
      reviewVolume: v.number(),
      yearsActive: v.number(),
      verifiedStatus: v.number(),
      responseTime: v.number(),
    }),
    specialities: v.array(v.string()),
    languages: v.array(v.string()),
    certifications: v.array(v.string()),
    isActive: v.boolean(),
  })
    .index("by_destination", ["destinationId"])
    .index("by_trust_score", ["trustScore"]),

  guides: defineTable({
    name: v.string(),
    destinationId: v.id("destinations"),
    profileImageUrl: v.optional(v.string()),
    bio: v.string(),
    phone: v.string(),
    whatsappNumber: v.string(),
    yearsExperience: v.number(),
    languages: v.array(v.string()),
    specialRoutes: v.array(v.string()),
    googleRating: v.optional(v.number()),
    googleReviewCount: v.optional(v.number()),
    trustScore: v.number(),
    pricePerDay: v.number(),
    maxGroupSize: v.number(),
    isVerified: v.boolean(),
    isActive: v.boolean(),
  }).index("by_destination", ["destinationId"]),

  treks: defineTable({
    name: v.string(),
    agencyId: v.id("agencies"),
    destinationId: v.id("destinations"),
    durationDays: v.number(),
    pricePerPerson: v.number(),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("expert")
    ),
    maxGroupSize: v.number(),
    minGroupSize: v.number(),
    startLocation: v.string(),
    endLocation: v.string(),
    itinerarySummary: v.string(),
    itineraryDays: v.array(
      v.object({
        day: v.number(),
        title: v.string(),
        description: v.string(),
        altitude: v.optional(v.number()),
        distance: v.optional(v.number()),
      })
    ),
    inclusions: v.array(v.string()),
    exclusions: v.array(v.string()),
    availableMonths: v.array(v.string()),
    highlights: v.array(v.string()),
    isActive: v.boolean(),
  })
    .index("by_agency", ["agencyId"])
    .index("by_destination", ["destinationId"])
    .index("by_difficulty", ["difficulty"]),

  trek_images: defineTable({
    trekId: v.optional(v.id("treks")),
    agencyId: v.optional(v.id("agencies")),
    guideId: v.optional(v.id("guides")),
    imageUrl: v.string(),
    altText: v.string(),
    isPrimary: v.boolean(),
    order: v.number(),
  })
    .index("by_trek", ["trekId"])
    .index("by_agency", ["agencyId"]),

  inquiries: defineTable({
    trekId: v.optional(v.id("treks")),
    agencyId: v.optional(v.id("agencies")),
    guideId: v.optional(v.id("guides")),
    destinationId: v.id("destinations"),
    userName: v.string(),
    userPhone: v.string(),
    userEmail: v.string(),
    groupSize: v.number(),
    preferredStartDate: v.string(),
    preferredEndDate: v.optional(v.string()),
    budgetPerPerson: v.optional(v.number()),
    message: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("booked"),
      v.literal("dropped")
    ),
    source: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_agency", ["agencyId"]),
});
