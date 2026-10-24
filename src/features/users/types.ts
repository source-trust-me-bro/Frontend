import type { PreferredLanguage } from "./schemas/user-profile-schema";

export type PreferencesState = {
  status: "idle" | "success" | "error";
  message: string;
  language?: PreferredLanguage;
};
