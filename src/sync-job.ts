import { z } from "./z.js";

export const SyncJobStatusSchema = z
  .enum(["QUEUED", "RUNNING", "COMPLETED", "FAILED"])
  .openapi("SyncJobStatus");

export const CreateSyncJobInputSchema = z
  .object({
    bookingId: z.string().cuid().describe("Booking to sync with provider"),
    providerId: z.string().cuid().describe("Target provider"),
  })
  .openapi("CreateSyncJobInput");

export const SyncJobResponseSchema = z
  .object({
    id: z.string().cuid(),
    bookingId: z.string().cuid(),
    providerId: z.string().cuid(),
    status: SyncJobStatusSchema,
    attempts: z.number().int().nonnegative(),
    lastError: z.string().nullable(),
    createdAt: z.string().datetime(),
    completedAt: z.string().datetime().nullable(),
  })
  .openapi("SyncJobResponse");

export const SyncJobListQuerySchema = z
  .object({
    status: SyncJobStatusSchema.optional(),
    bookingId: z.string().cuid().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .openapi("SyncJobListQuery");

export type SyncJobStatus = z.infer<typeof SyncJobStatusSchema>;
export type CreateSyncJobInput = z.infer<typeof CreateSyncJobInputSchema>;
export type SyncJobResponse = z.infer<typeof SyncJobResponseSchema>;
export type SyncJobListQuery = z.infer<typeof SyncJobListQuerySchema>;
