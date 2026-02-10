# Trekking Aggregator — Implementation Guide

> Stack: Next.js 16 (App Router) · Convex DB · Zustand · React Hook Form · Zod · Tailwind CSS · Expo (mobile, later)

---

## Table of Contents

1. [Project Philosophy](#1-project-philosophy)
2. [Folder Structure](#2-folder-structure)
3. [Convex Schema](#3-convex-schema)
4. [Data Flow Architecture](#4-data-flow-architecture)
5. [Screen Inventory](#5-screen-inventory)
6. [User Flow](#6-user-flow)
7. [Component Rules](#7-component-rules)
8. [Hooks Layer](#8-hooks-layer)
9. [Lib Layer](#9-lib-layer)
10. [State Management](#10-state-management)
11. [Forms](#11-forms)
12. [Image Handling](#12-image-handling)
13. [Auth — Google OAuth](#13-auth--google-oauth)
14. [Build Order](#14-build-order)
15. [Environment Variables](#15-environment-variables)
16. [Mobile Portability Rules](#16-mobile-portability-rules)
17. [Naming Conventions](#17-naming-conventions)

---

## 1. Project Philosophy

These rules are non-negotiable. Every decision in this codebase traces back to them.

- **Logic never lives in components.** Components render. Hooks compute. Lib functions transform.
- **Flexbox only for layout.** No CSS Grid for structural layouts. React Native is flex-only.
- **Every screen is a screen, not a page.** Think in terms of mobile screens even while building web.
- **Wrap every third-party component.** Never import shadcn, Radix, or any UI lib directly in a feature component.
- **Convex calls only through the lib layer.** Components never call `useQuery` or `useMutation` directly.
- **Forms always use React Hook Form + Zod.** No raw controlled inputs, no `useState` for form fields.
- **One image component.** `<TrekImage />` is the only way to render images across the entire app.

---

## 2. Folder Structure

```
/
├── app/                          # Next.js App Router — routes only, no logic
│   ├── layout.tsx                # Root layout — providers only
│   ├── page.tsx                  # Landing screen
│   ├── (auth)/
│   │   └── callback/
│   │       └── page.tsx          # Google OAuth callback
│   ├── destination/
│   │   └── [slug]/
│   │       └── page.tsx          # Destination screen (agencies + guides list)
│   ├── agency/
│   │   └── [id]/
│   │       └── page.tsx          # Agency detail screen
│   ├── guide/
│   │   └── [id]/
│   │       └── page.tsx          # Local guide detail screen
│   ├── trek/
│   │   └── [id]/
│   │       └── page.tsx          # Trek package detail screen
│   └── inquiry/
│       └── success/
│           └── page.tsx          # Post-inquiry confirmation screen
│
├── components/                   # UI only — no business logic
│   ├── primitives/               # Wrappers around third-party UI libs
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Spinner.tsx
│   ├── shared/                   # Shared UI used across screens
│   │   ├── TrekImage.tsx         # THE only image component
│   │   ├── TrustScoreBadge.tsx
│   │   ├── DifficultyBadge.tsx
│   │   ├── InclusionIcon.tsx
│   │   └── Navbar.tsx
│   ├── destination/              # Components scoped to destination screen
│   │   ├── DestinationCard.tsx
│   │   ├── DestinationGrid.tsx
│   │   ├── AgencyCard.tsx
│   │   ├── GuideCard.tsx
│   │   ├── FilterBar.tsx
│   │   └── CompareDrawer.tsx
│   ├── agency/
│   │   ├── AgencyHeader.tsx
│   │   ├── PackageList.tsx
│   │   ├── PackageCard.tsx
│   │   ├── TrustBreakdown.tsx
│   │   └── PhotoGallery.tsx
│   └── inquiry/
│       ├── InquiryForm.tsx
│       └── LoginModal.tsx
│
├── hooks/                        # All custom hooks — portable to React Native
│   ├── useDestinations.ts
│   ├── useAgencies.ts
│   ├── useGuides.ts
│   ├── useTreks.ts
│   ├── useFilters.ts
│   ├── useCompare.ts
│   ├── useInquiry.ts
│   └── useAuth.ts
│
├── lib/
│   ├── convex/                   # All Convex query/mutation wrappers
│   │   ├── destinations.ts
│   │   ├── agencies.ts
│   │   ├── guides.ts
│   │   ├── treks.ts
│   │   └── inquiries.ts
│   ├── utils/                    # Pure JS utility functions
│   │   ├── trustScore.ts         # Trust score computation logic
│   │   ├── filters.ts            # Filter matching logic
│   │   ├── formatters.ts         # Price, date, duration formatters
│   │   └── whatsapp.ts           # WhatsApp URL builder
│   └── constants/
│       ├── destinations.ts       # Destination slugs, display names, coords
│       ├── difficulties.ts       # Difficulty enum + labels
│       ├── inclusions.ts         # Inclusion types + icons map
│       └── regions.ts            # Region groupings
│
├── convex/                       # Convex backend
│   ├── schema.ts                 # Database schema
│   ├── destinations.ts           # Queries + mutations
│   ├── agencies.ts
│   ├── guides.ts
│   ├── treks.ts
│   └── inquiries.ts
│
├── types/                        # Shared TypeScript types
│   ├── destination.ts
│   ├── agency.ts
│   ├── guide.ts
│   ├── trek.ts
│   ├── inquiry.ts
│   └── filters.ts
│
├── store/                        # Zustand stores
│   ├── filterStore.ts
│   └── compareStore.ts
│
└── public/
    └── destinations/             # Static destination hero images
```

---

## 3. Convex Schema

Define this first. Everything else derives from it.

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  destinations: defineTable({
    name: v.string(),                   // "Chopta"
    slug: v.string(),                   // "chopta" — used in URL
    region: v.string(),                 // "Uttarakhand"
    heroImageUrl: v.string(),
    description: v.string(),
    altitude: v.optional(v.number()),   // meters
    bestMonths: v.array(v.string()),    // ["March", "April", "May"]
    agencyCount: v.number(),            // denormalized, update on agency add
    startingPrice: v.number(),          // lowest price across all agencies here
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
    googleRating: v.number(),           // 0–5
    googleReviewCount: v.number(),
    instagramHandle: v.optional(v.string()),
    isVerified: v.boolean(),
    trustScore: v.number(),             // 0–10, computed and stored manually
    trustScoreBreakdown: v.object({
      googleRating: v.number(),         // sub-score 0–10
      reviewVolume: v.number(),
      yearsActive: v.number(),
      verifiedStatus: v.number(),
      responseTime: v.number(),
    }),
    specialities: v.array(v.string()), // ["High altitude", "Family treks"]
    languages: v.array(v.string()),    // ["Hindi", "English"]
    certifications: v.array(v.string()),
    isActive: v.boolean(),
  }).index("by_destination", ["destinationId"])
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
    pricePerDay: v.number(),           // ₹ per day per person
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
    itinerarySummary: v.string(),      // Short 2-3 line summary
    itineraryDays: v.array(v.object({
      day: v.number(),
      title: v.string(),
      description: v.string(),
      altitude: v.optional(v.number()),
      distance: v.optional(v.number()),  // km
    })),
    inclusions: v.array(v.string()),   // use constants/inclusions.ts values
    exclusions: v.array(v.string()),
    availableMonths: v.array(v.string()),
    highlights: v.array(v.string()),
    isActive: v.boolean(),
  }).index("by_agency", ["agencyId"])
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
  }).index("by_trek", ["trekId"])
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
    preferredStartDate: v.string(),    // ISO date string
    preferredEndDate: v.optional(v.string()),
    budgetPerPerson: v.optional(v.number()),
    message: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("booked"),
      v.literal("dropped")
    ),
    source: v.string(),                // "agency_detail" | "trek_detail" | "guide_detail"
  }).index("by_status", ["status"])
    .index("by_agency", ["agencyId"]),

});
```

---

## 4. Data Flow Architecture

```
Convex DB
    ↓
convex/*.ts  (queries and mutations — server functions)
    ↓
lib/convex/*.ts  (wrappers — useQuery/useMutation abstracted here)
    ↓
hooks/*.ts  (business logic, loading state, derived data)
    ↓
components/*.tsx  (render only — receive data as props)
    ↓
app/*/page.tsx  (compose components — no logic)
```

**Rule:** Data flows strictly downward. Components never skip a layer.

---

## 5. Screen Inventory

| Screen | Route | Description |
|--------|-------|-------------|
| Landing | `/` | Hero + destination cards grid |
| Destination | `/destination/[slug]` | Agencies + guides list with filters |
| Agency Detail | `/agency/[id]` | Full agency profile + trek packages |
| Guide Detail | `/guide/[id]` | Local guide profile + inquiry |
| Trek Detail | `/trek/[id]` | Full trek page with itinerary |
| Inquiry Success | `/inquiry/success` | Confirmation + WhatsApp CTA |
| Auth Callback | `/(auth)/callback` | Google OAuth redirect handler |

---

## 6. User Flow

### Primary Flow

```
/ (Landing)
  └─ Click destination card
       ↓
  /destination/[slug]
  (see agencies + local guides, apply filters)
       ↓
  Click agency card  ──OR──  Click guide card
       ↓                          ↓
  /agency/[id]              /guide/[id]
  (full profile,            (profile,
   trek packages)            price per day)
       ↓                          ↓
  Click "Connect" or "View Trek"
       ↓
  Login Modal (Google) — only if not logged in
       ↓
  Inquiry Form (pre-filled name + email from Google)
       ↓
  Submit → Convex mutation → WhatsApp redirect
       ↓
  /inquiry/success
  (confirmation + direct WhatsApp button)
```

### Secondary Flows

**Region browse:** Landing → click destination card → pre-filtered destination page.

**Direct URL / SEO:** User arrives at `/destination/chopta?duration=3&difficulty=beginner` — filters are read from URL query params and pre-applied. Filter state lives in the URL, not just component state.

**Compare flow:** On destination page, user ticks 2–3 agency cards → "Compare" sticky bar appears at bottom → side-by-side comparison drawer slides up.

---

## 7. Component Rules

### Primitives — wrap everything

Every third-party component gets a wrapper in `/components/primitives/`. This is the only place you import from `shadcn`, `radix-ui`, or any external UI lib.

```typescript
// components/primitives/Button.tsx
// ✅ Correct — wrapper component

import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({ label, onClick, variant = "primary", isLoading, disabled, fullWidth }: ButtonProps) {
  return (
    <ShadcnButton
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(fullWidth && "w-full")}
    >
      {isLoading ? "..." : label}
    </ShadcnButton>
  );
}
```

When you port to React Native, you replace `ShadcnButton` with `TouchableOpacity` inside this one file. Every feature component stays untouched.

### Feature components — props only, no hooks

```typescript
// components/destination/AgencyCard.tsx
// ✅ Correct — receives everything as props

interface AgencyCardProps {
  id: string;
  name: string;
  trustScore: number;
  priceFrom: number;
  specialities: string[];
  isVerified: boolean;
  whatsappNumber: string;
  onSelect: (id: string) => void;
  onCompareToggle: (id: string) => void;
  isInCompare: boolean;
}

export function AgencyCard({ id, name, trustScore, priceFrom, specialities, isVerified, whatsappNumber, onSelect, onCompareToggle, isInCompare }: AgencyCardProps) {
  // Only render logic here — no useQuery, no fetch, no store access
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* card UI */}
    </div>
  );
}
```

---

## 8. Hooks Layer

All hooks live in `/hooks/`. They are the only place that calls lib/convex functions and accesses Zustand stores. Components consume hooks; hooks do not consume each other unless clearly necessary.

```typescript
// hooks/useAgencies.ts

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFilterStore } from "@/store/filterStore";
import { computeTrustScore } from "@/lib/utils/trustScore";
import type { Agency } from "@/types/agency";

export function useAgencies(destinationSlug: string) {
  const { difficulty, budgetMax, durationDays } = useFilterStore();

  const agencies = useQuery(api.agencies.listByDestination, {
    destinationSlug,
    difficulty: difficulty ?? undefined,
    budgetMax: budgetMax ?? undefined,
    durationDays: durationDays ?? undefined,
  });

  const sorted = agencies
    ? [...agencies].sort((a, b) => b.trustScore - a.trustScore)
    : [];

  return {
    agencies: sorted,
    isLoading: agencies === undefined,
    isEmpty: agencies !== undefined && agencies.length === 0,
  };
}
```

```typescript
// hooks/useFilters.ts

import { useFilterStore } from "@/store/filterStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Syncs filter state to URL query params so filters survive refresh
// and pages are shareable/SEO-friendly
export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useFilterStore();

  // Hydrate from URL on mount
  useEffect(() => {
    const difficulty = searchParams.get("difficulty");
    const budgetMax = searchParams.get("budgetMax");
    const durationDays = searchParams.get("durationDays");
    if (difficulty) store.setDifficulty(difficulty as any);
    if (budgetMax) store.setBudgetMax(Number(budgetMax));
    if (durationDays) store.setDurationDays(Number(durationDays));
  }, []);

  // Push filter changes to URL
  function applyFilters(updates: Partial<typeof store>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    router.replace(`?${params.toString()}`, { scroll: false });
    store.setMany(updates);
  }

  return { ...store, applyFilters };
}
```

---

## 9. Lib Layer

### lib/convex/ — Convex call wrappers

```typescript
// lib/convex/agencies.ts
// Thin wrappers — just re-export api references with correct typing.
// Actual useQuery/useMutation calls happen in hooks, not here.
// This file documents what Convex functions exist and their expected types.

export { api } from "@/convex/_generated/api";
// Named re-exports give hooks a stable import that doesn't change
// if the Convex generated path changes.
```

### lib/utils/ — Pure functions

```typescript
// lib/utils/trustScore.ts

interface TrustInputs {
  googleRating: number;       // 0–5
  googleReviewCount: number;
  yearsInBusiness: number;
  isVerified: boolean;
  avgResponseTimeHours: number;
}

// Pure function — no imports, no side effects, ports to React Native unchanged
export function computeTrustScore(inputs: TrustInputs): number {
  const ratingScore   = (inputs.googleRating / 5) * 3;          // max 3
  const reviewScore   = Math.min(inputs.googleReviewCount / 100, 1) * 2; // max 2
  const yearsScore    = Math.min(inputs.yearsInBusiness / 10, 1) * 2;    // max 2
  const verifiedScore = inputs.isVerified ? 2 : 0;               // max 2
  const responseScore = inputs.avgResponseTimeHours <= 2 ? 1 : 0; // max 1

  return Math.round((ratingScore + reviewScore + yearsScore + verifiedScore + responseScore) * 10) / 10;
}
```

```typescript
// lib/utils/whatsapp.ts

interface WhatsAppParams {
  phone: string;          // with country code, no +, no spaces: "919876543210"
  trekName?: string;
  agencyName?: string;
  groupSize?: number;
  dates?: string;
}

export function buildWhatsAppUrl(params: WhatsAppParams): string {
  const { phone, trekName, agencyName, groupSize, dates } = params;

  const message = [
    "Hi! I found you on TrekMapper.",
    trekName   ? `I'm interested in the *${trekName}* trek.` : "",
    groupSize  ? `Group size: ${groupSize} people.` : "",
    dates      ? `Dates: ${dates}.` : "",
    "Could you share availability and pricing?",
  ].filter(Boolean).join(" ");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

```typescript
// lib/utils/formatters.ts

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDuration(days: number): string {
  return days === 1 ? "1 day" : `${days} days`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
```

### lib/constants/

```typescript
// lib/constants/destinations.ts

export const DESTINATIONS = [
  { slug: "rishikesh",      displayName: "Rishikesh",      region: "Uttarakhand", imageFile: "rishikesh.jpg" },
  { slug: "chopta",         displayName: "Chopta",         region: "Uttarakhand", imageFile: "chopta.jpg"    },
  { slug: "kedarkantha",    displayName: "Kedarkantha",    region: "Uttarakhand", imageFile: "kedarkantha.jpg" },
  { slug: "mussoorie",      displayName: "Mussoorie",      region: "Uttarakhand", imageFile: "mussoorie.jpg" },
  { slug: "har-ki-dun",     displayName: "Har Ki Dun",     region: "Uttarakhand", imageFile: "harkidun.jpg"  },
  { slug: "valley-of-flowers", displayName: "Valley of Flowers", region: "Uttarakhand", imageFile: "vof.jpg" },
] as const;

export type DestinationSlug = typeof DESTINATIONS[number]["slug"];
```

```typescript
// lib/constants/inclusions.ts

export const INCLUSIONS = {
  meals:       { label: "Meals",        icon: "🍽️" },
  tent:        { label: "Tent",         icon: "⛺" },
  guide:       { label: "Guide",        icon: "🧭" },
  transport:   { label: "Transport",    icon: "🚌" },
  firstAid:    { label: "First Aid",    icon: "🩺" },
  porter:      { label: "Porter",       icon: "🎒" },
  permits:     { label: "Permits",      icon: "📋" },
  insurance:   { label: "Insurance",    icon: "🛡️" },
} as const;

export type InclusionKey = keyof typeof INCLUSIONS;
```

---

## 10. State Management

Use Zustand for global client state. React Query is not needed since Convex provides its own reactive query layer.

Only two stores are needed in MVP:

```typescript
// store/filterStore.ts

import { create } from "zustand";
import type { Difficulty } from "@/types/trek";

interface FilterState {
  difficulty: Difficulty | null;
  budgetMax: number | null;
  durationDays: number | null;
  groupSize: number | null;
  travelMonth: string | null;
  activeTab: "agencies" | "guides";
  setDifficulty: (v: Difficulty | null) => void;
  setBudgetMax: (v: number | null) => void;
  setDurationDays: (v: number | null) => void;
  setGroupSize: (v: number | null) => void;
  setTravelMonth: (v: string | null) => void;
  setActiveTab: (v: "agencies" | "guides") => void;
  setMany: (updates: Partial<FilterState>) => void;
  reset: () => void;
}

const defaults = {
  difficulty: null,
  budgetMax: null,
  durationDays: null,
  groupSize: null,
  travelMonth: null,
  activeTab: "agencies" as const,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaults,
  setDifficulty:  (v) => set({ difficulty: v }),
  setBudgetMax:   (v) => set({ budgetMax: v }),
  setDurationDays:(v) => set({ durationDays: v }),
  setGroupSize:   (v) => set({ groupSize: v }),
  setTravelMonth: (v) => set({ travelMonth: v }),
  setActiveTab:   (v) => set({ activeTab: v }),
  setMany:        (updates) => set(updates),
  reset:          () => set(defaults),
}));
```

```typescript
// store/compareStore.ts

import { create } from "zustand";

interface CompareState {
  selectedIds: string[];
  toggle: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  isFull: () => boolean;  // max 3 selections
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selectedIds: [],
  toggle: (id) => {
    const { selectedIds } = get();
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter((s) => s !== id) });
    } else if (selectedIds.length < 3) {
      set({ selectedIds: [...selectedIds, id] });
    }
  },
  clear:      () => set({ selectedIds: [] }),
  isSelected: (id) => get().selectedIds.includes(id),
  isFull:     () => get().selectedIds.length >= 3,
}));
```

---

## 11. Forms

All forms use React Hook Form + Zod. Never use `useState` for form fields.

```typescript
// types/inquiry.ts

import { z } from "zod";

export const inquirySchema = z.object({
  userName:           z.string().min(2, "Name must be at least 2 characters"),
  userPhone:          z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  userEmail:          z.string().email("Enter a valid email"),
  groupSize:          z.number().min(1).max(50),
  preferredStartDate: z.string().min(1, "Select a start date"),
  budgetPerPerson:    z.number().optional(),
  message:            z.string().max(500).optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
```

```typescript
// components/inquiry/InquiryForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormValues } from "@/types/inquiry";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";

interface InquiryFormProps {
  onSubmit: (values: InquiryFormValues) => Promise<void>;
  defaultEmail?: string;
  defaultName?: string;
  isSubmitting: boolean;
}

export function InquiryForm({ onSubmit, defaultEmail, defaultName, isSubmitting }: InquiryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { userName: defaultName ?? "", userEmail: defaultEmail ?? "" },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input {...register("userName")} label="Your Name" error={errors.userName?.message} />
      <Input {...register("userPhone")} label="WhatsApp Number" error={errors.userPhone?.message} />
      <Input {...register("userEmail")} label="Email" error={errors.userEmail?.message} />
      {/* remaining fields */}
      <Button label="Send Inquiry" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting} />
    </div>
  );
}
```

---

## 12. Image Handling

There is exactly one image component in this codebase. All other components import from here.

```typescript
// components/shared/TrekImage.tsx

import Image from "next/image";

interface TrekImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function TrekImage({ src, alt, width, height, fill, priority, className, style }: TrekImageProps) {
  const fallback = "/placeholder-trek.jpg";

  return (
    <Image
      src={src || fallback}
      alt={alt}
      width={fill ? undefined : (width ?? 400)}
      height={fill ? undefined : (height ?? 300)}
      fill={fill}
      priority={priority}
      className={className}
      style={style}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback;
      }}
    />
  );
}
```

When porting to React Native, only this file changes — the interface stays the same and all consumer components port unchanged.

---

## 13. Auth — Google OAuth

Login is triggered only when a user attempts to submit an inquiry. Never shown as a gate before browsing.

```typescript
// hooks/useAuth.ts

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  async function loginWithGoogle() {
    await signIn("google");
  }

  return { isAuthenticated, isLoading, loginWithGoogle, signOut };
}
```

```typescript
// components/inquiry/LoginModal.tsx
// Shown as an overlay on the agency/trek detail page when user hits "Connect"
// After successful login, immediately shows the InquiryForm in the same modal.

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { loginWithGoogle } = useAuth();

  async function handleGoogleLogin() {
    await loginWithGoogle();
    onLoginSuccess();
  }

  // Modal primitive wraps Radix Dialog
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign in to connect">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <p>Sign in to send your inquiry. Takes 5 seconds.</p>
        <Button label="Continue with Google" onClick={handleGoogleLogin} />
      </div>
    </Modal>
  );
}
```

---

## 14. Build Order

Follow this exact sequence. Do not start a phase before the previous one is working end-to-end.

### Phase 1 — Foundation (Day 1–2)
- [ ] Init Next.js 16 project with TypeScript and Tailwind
- [ ] Init Convex and connect to project
- [ ] Define `convex/schema.ts` (all tables)
- [ ] Set up folder structure exactly as defined in section 2
- [ ] Create all TypeScript types in `/types/`
- [ ] Create all constants in `/lib/constants/`
- [ ] Set up Zustand stores

### Phase 2 — Data Layer (Day 2–3)
- [ ] Write Convex queries: `listDestinations`, `listAgenciesByDestination`, `listGuidesByDestination`, `getAgencyById`, `getTrekById`
- [ ] Write Convex mutations: `createInquiry`
- [ ] Seed 4 destinations manually in Convex dashboard
- [ ] Seed 3 agencies per destination (12 total)
- [ ] Seed 2 treks per agency (24 total)
- [ ] Verify all queries return correct data

### Phase 3 — Core Screens (Day 3–6)
- [ ] Build `TrekImage` component
- [ ] Build all primitives (Button, Input, Select, Badge, Modal, Spinner)
- [ ] Build hooks: `useDestinations`, `useAgencies`, `useGuides`, `useFilters`
- [ ] Build Destination screen — agency cards + guide cards + filter bar
- [ ] Build Agency Detail screen — profile + trek packages list
- [ ] Build Trek Detail screen — full itinerary + inquiry CTA
- [ ] Wire filter state to URL query params

### Phase 4 — Auth + Inquiry (Day 7–8)
- [ ] Set up Convex Auth with Google provider
- [ ] Build `useAuth` hook
- [ ] Build `LoginModal` component
- [ ] Build `InquiryForm` component with React Hook Form + Zod
- [ ] Build `useInquiry` hook — handles login check, form submit, Convex mutation
- [ ] Wire inquiry flow end to end: CTA → login modal → form → success page

### Phase 5 — Landing Page (Day 9–10)
- [ ] Build `DestinationCard` component
- [ ] Build `DestinationGrid`
- [ ] Build Landing screen — headline + destination grid
- [ ] Add starting price and agency count to destination cards (from seeded data)

### Phase 6 — Compare Feature (Day 11–12)
- [ ] Wire `useCompareStore` to agency cards
- [ ] Build compare toggle checkbox on agency cards
- [ ] Build sticky compare bar (appears when 2+ selected)
- [ ] Build `CompareDrawer` — side-by-side table of price, inclusions, trust score

### Phase 7 — Polish (Day 13–14)
- [ ] Add loading skeletons to all data-fetching screens
- [ ] Add empty states (no agencies found, no treks found)
- [ ] Add error boundaries
- [ ] Verify all filter states persist in URL
- [ ] Mobile responsive check (Tailwind breakpoints)
- [ ] WhatsApp URL generation working correctly

---

## 15. Environment Variables

```bash
# .env.local

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Google OAuth (via Convex Auth)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_WHATSAPP=919XXXXXXXXX   # your WhatsApp for inquiry notifications
```

---

## 16. Mobile Portability Rules

Follow these during web development so the React Native port is a UI swap, not a logic rewrite.

| Rule | Web (follow this) | Why it helps RN |
|------|-------------------|-----------------|
| Layout | Flexbox only, no CSS Grid for structure | RN has no Grid |
| Units | Avoid `vh`, `vw`, `rem` in logic | RN uses unitless numbers |
| Storage | Never use `localStorage` directly — abstract behind a util function | Swap to AsyncStorage in one place |
| Navigation | Treat `router.push()` as `navigation.navigate()` | Same mental model in Expo Router |
| Images | Only `<TrekImage />`, never `<Image />` directly | One file to update during port |
| Fonts | Import fonts through a single `fonts.ts` constant | Easy swap to RN font loading |
| Third-party UI | Only through `/components/primitives/` | Replace internals, not all consumers |
| Animation | Avoid CSS animations for functional UI | Use Reanimated equivalents in RN |
| Forms | React Hook Form — works in RN with minor adapter | Same hook, different field components |
| State | Zustand — works identically in RN | Zero changes needed |
| API calls | All in `/lib/convex/` and `/hooks/` | Copy-paste to RN |

### Files that port with zero changes
- All of `/hooks/`
- All of `/lib/utils/`
- All of `/lib/constants/`
- All of `/store/`
- All of `/types/`
- All of `/convex/`

### Files that need rebuilding in RN
- All of `/app/` → becomes `/app/` in Expo Router (different components)
- All of `/components/` → swap HTML elements for RN View/Text/TouchableOpacity
- Tailwind classes → StyleSheet objects

---

## 17. Naming Conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Components | PascalCase | `AgencyCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAgencies.ts` |
| Stores | camelCase with `Store` suffix | `filterStore.ts` |
| Convex functions | camelCase | `listAgenciesByDestination` |
| Lib utils | camelCase | `computeTrustScore` |
| Constants | SCREAMING_SNAKE for values, camelCase for objects | `DESTINATIONS` |
| Types | PascalCase | `Agency`, `Trek`, `InquiryFormValues` |
| Routes | kebab-case | `/destination/har-ki-dun` |
| Env vars | SCREAMING_SNAKE | `NEXT_PUBLIC_CONVEX_URL` |
| Image files | kebab-case | `kedarkantha.jpg` |

---

*Last updated: April 2026*
*Stack: Next.js 16 · Convex · Zustand · React Hook Form · Zod · Tailwind · Expo (mobile)*