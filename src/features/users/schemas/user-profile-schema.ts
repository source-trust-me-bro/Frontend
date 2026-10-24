import { z } from "zod";

export const preferredLanguageSchema = z.enum(["en", "fi"]);

export type PreferredLanguage = z.infer<typeof preferredLanguageSchema>;

export const userProfileSchema = z.object({
  id: z.string(),
  clerk_user_id: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  display_name: z.string().optional().nullable(),
  preferred_language: preferredLanguageSchema.catch("en"),
  role: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
