export const DESTINATIONS = [
  { slug: "rishikesh", displayName: "Rishikesh", region: "Uttarakhand", imageFile: "rishikesh.jpg" },
  { slug: "chopta", displayName: "Chopta", region: "Uttarakhand", imageFile: "chopta.jpg" },
  { slug: "kedarkantha", displayName: "Kedarkantha", region: "Uttarakhand", imageFile: "kedarkantha.jpg" },
  { slug: "mussoorie", displayName: "Mussoorie", region: "Uttarakhand", imageFile: "mussoorie.jpg" },
  { slug: "har-ki-dun", displayName: "Har Ki Dun", region: "Uttarakhand", imageFile: "harkidun.jpg" },
  { slug: "valley-of-flowers", displayName: "Valley of Flowers", region: "Uttarakhand", imageFile: "vof.jpg" },
] as const;

export type DestinationSlug = typeof DESTINATIONS[number]["slug"];
