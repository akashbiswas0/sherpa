import { z } from "zod";

export const inquirySchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  userEmail: z.string().email("Enter a valid email"),
  groupSize: z.number().min(1).max(50),
  preferredStartDate: z.string().min(1, "Select a start date"),
  budgetPerPerson: z.number().optional(),
  message: z.string().max(500).optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

export type InquiryStatus = "new" | "contacted" | "booked" | "dropped";

export interface Inquiry {
  _id: string;
  trekId?: string;
  agencyId?: string;
  guideId?: string;
  destinationId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  groupSize: number;
  preferredStartDate: string;
  preferredEndDate?: string;
  budgetPerPerson?: number;
  message?: string;
  status: InquiryStatus;
  source: string;
}
