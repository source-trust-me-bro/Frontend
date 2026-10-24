import "server-only";

import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { z } from "zod";

import { fastApiUrl } from "@/lib/server/env";

import {
  userProfileSchema,
  type UserProfile,
} from "../schemas";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  timeoutMs?: number;
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
};

async function readDetail(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json();

    if (payload && typeof payload === "object" && "detail" in payload) {
      const detail = (payload as { detail: unknown }).detail;

      if (typeof detail === "string") {
        return detail;
      }
    }
  } catch {
    // Fall through to the generic message.
  }

  return `The API returned ${response.status}.`;
}

/** The caller's session token, looked up once per render however many API calls follow. */
const sessionToken = cache(async (): Promise<string | null> => {
  const { getToken } = await auth();

  return getToken();
});

/** Calls FastAPI with the caller's Clerk session token as a Bearer token. */
export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  const token = await sessionToken();

  if (!token) {
    throw new ApiError(401, "Your session has expired. Sign in again.");
  }

  let response: Response;

  try {
    response = await fetch(fastApiUrl(path), {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
    });
  } catch {
    throw new ApiError(
      503,
      "Could not reach the news API. Make sure the FastAPI server is running.",
    );
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readDetail(response));
  }

  // 204 responses have no body; callers pass z.void() for those.
  const parsed = schema.safeParse(
    response.status === 204 ? undefined : await response.json(),
  );

  if (!parsed.success) {
    throw new ApiError(502, "The news API returned an unexpected response.");
  }

  return parsed.data;
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Something went wrong while loading this page.";
}

/** Redirects to sign-in when there is no Clerk session. */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}

/** The caller's MongoDB profile, created by FastAPI on first request. */
export const getProfile = cache(
  async (): Promise<UserProfile> =>
    apiRequest("/users/me", userProfileSchema),
);

export type Attempt<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; status: number };

/** Resolves to data or a user-facing message so pages can render without try/catch around JSX. */
export async function attempt<T>(work: () => Promise<T>): Promise<Attempt<T>> {
  try {
    return { ok: true, data: await work() };
  } catch (error) {
    if (isRedirectOrNotFound(error)) {
      throw error;
    }

    return {
      ok: false,
      message: errorMessage(error),
      status: error instanceof ApiError ? error.status : 500,
    };
  }
}

function isRedirectOrNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    /^NEXT_(REDIRECT|HTTP_ERROR_FALLBACK|NOT_FOUND)/.test(
      (error as { digest: string }).digest,
    )
  );
}
