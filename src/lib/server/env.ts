import "server-only";

import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  FASTAPI_BASE_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  FASTAPI_BASE_URL: process.env.FASTAPI_BASE_URL,
});

export function fastApiUrl(path: string): string {
  return `${env.FASTAPI_BASE_URL.replace(/\/$/, "")}${path}`;
}
