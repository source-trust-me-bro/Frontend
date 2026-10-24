import "server-only";

import { fastApiUrl } from "@/lib/server/env";

import {
  healthStatusSchema,
  type HealthStatus,
} from "../schemas/health-status-schema";

export type BackendHealthResult =
  | { status: "ok"; health: HealthStatus }
  | { status: "error"; message: string };

export async function getBackendHealth(): Promise<BackendHealthResult> {
  try {
    const response = await fetch(fastApiUrl("/health/ready"), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      return {
        status: "error",
        message: `Readiness probe returned ${response.status}.`,
      };
    }

    const payload: unknown = await response.json();
    const parsed = healthStatusSchema.safeParse(payload);

    if (!parsed.success) {
      return {
        status: "error",
        message: "Readiness probe returned an unexpected payload.",
      };
    }

    return { status: "ok", health: parsed.data };
  } catch {
    return {
      status: "error",
      message: "FastAPI is not reachable from this server.",
    };
  }
}
