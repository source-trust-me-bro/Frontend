import { z } from "zod";

import { preferredLanguageSchema } from "./user-profile-schema";

export const updatePreferencesSchema = z.object({
  preferred_language: preferredLanguageSchema,
});

export type UpdatePreferencesInput = z.infer<
  typeof updatePreferencesSchema
>;
