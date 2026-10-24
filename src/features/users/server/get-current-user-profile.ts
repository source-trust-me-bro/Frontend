import "server-only";

import { fastApiUrl } from "@/lib/server/env";

import {
  userProfileSchema,
  type UserProfile,
} from "../schemas/user-profile-schema";

export type UserProfileResult =
  | { status: "ok"; profile: UserProfile }
  | { status: "missing"; message: string }
  | { status: "error"; message: string };

export async function getCurrentUserProfile(
  token: string | null,
): Promise<UserProfileResult> {
  if (!token) {
    return {
      status: "error",
      message:
        "Clerk did not return a session token for this request. Sign in again and retry.",
    };
  }

  try {
    const response = await fetch(fastApiUrl("/users/me"), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (response.status === 404) {
      return {
        status: "missing",
        message:
          "FastAPI has not created this MongoDB profile yet. Reload once the first sign-in sync has completed.",
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message: `FastAPI returned ${response.status} while loading your profile.`,
      };
    }

    const payload: unknown = await response.json();
    const candidate =
      payload &&
      typeof payload === "object" &&
      "user" in payload &&
      payload.user
        ? payload.user
        : payload;
    const parsed = userProfileSchema.safeParse(candidate);

    if (!parsed.success) {
      return {
        status: "error",
        message:
          "FastAPI returned a profile in an unexpected shape. Check the /users/me contract.",
      };
    }

    return { status: "ok", profile: parsed.data };
  } catch {
    return {
      status: "error",
      message:
        "Could not reach FastAPI. Start the API at FASTAPI_BASE_URL and reload this page.",
    };
  }
}
