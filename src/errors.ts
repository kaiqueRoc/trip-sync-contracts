import { z } from "./z.js";

export const ErrorCodeSchema = z
  .enum([
    "VALIDATION_ERROR",
    "NOT_FOUND",
    "CONFLICT",
    "UNAUTHORIZED",
    "FORBIDDEN",
    "IDEMPOTENCY_REPLAY",
    "PROVIDER_UNAVAILABLE",
    "INTERNAL_ERROR",
  ])
  .openapi("ErrorCode");

export const ApiErrorSchema = z
  .object({
    code: ErrorCodeSchema,
    message: z.string().describe("Human-readable error message"),
    details: z
      .array(
        z.object({
          path: z.string().optional(),
          message: z.string(),
        }),
      )
      .optional()
      .describe("Field-level validation errors"),
    correlationId: z.string().uuid().optional().describe("Request correlation ID for support"),
  })
  .openapi("ApiError");

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
