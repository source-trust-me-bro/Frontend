import { z } from "zod";

export const healthStatusSchema = z
  .object({
    status: z.string().default("unknown"),
    database: z.string().optional().nullable(),
    version: z.string().optional().nullable(),
    checked_at: z.string().optional().nullable(),
  })
  .passthrough();

export type HealthStatus = z.infer<typeof healthStatusSchema>;
