import { z } from "./z.js";

export const HealthResponseSchema = z
  .object({
    status: z.enum(["ok", "degraded"]),
    version: z.string().describe("API semantic version"),
    uptimeSeconds: z.number().nonnegative(),
    checks: z.object({
      database: z.enum(["up", "down"]),
      redis: z.enum(["up", "down", "skipped"]),
    }),
  })
  .openapi("HealthResponse");

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
