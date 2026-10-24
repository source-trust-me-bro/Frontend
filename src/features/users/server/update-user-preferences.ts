"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { fastApiUrl, env } from "@/lib/server/env";

import { updatePreferencesSchema } from "../schemas/update-preferences-schema";
import type { PreferencesState } from "../types";

export async function updateUserPreferences(
  _previousState: PreferencesState,
  formData: FormData,
): Promise<PreferencesState> {
  const { userId, getToken } = await auth();

  if (!userId) {
    return {
      status: "error",
      message: "Your session has expired. Sign in again to save preferences.",
    };
  }

  const parsed = updatePreferencesSchema.safeParse({
    preferred_language: formData.get("preferred_language"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Choose English or Finnish before saving.",
    };
  }

  const token = await getToken();

  if (!token) {
    return {
      status: "error",
      message:
        "Clerk did not return a session token, so FastAPI could not verify the update.",
    };
  }

  try {
    const response = await fetch(fastApiUrl("/users/me"), {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return {
        status: "error",
        message: `FastAPI rejected the update (${response.status}). ${env.FASTAPI_BASE_URL}`,
      };
    }

    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Preferences saved and synced with your MongoDB profile.",
      language: parsed.data.preferred_language,
    };
  } catch {
    return {
      status: "error",
      message:
        "Could not reach FastAPI. Check that the API is running, then try again.",
    };
  }
}
