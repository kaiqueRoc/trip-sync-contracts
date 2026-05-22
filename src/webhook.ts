import { z } from "zod";
import { BookingStatusSchema } from "./booking.js";

export const ProviderWebhookHeadersSchema = z
  .object({
    "x-provider-signature": z
      .string()
      .min(1)
      .describe("HMAC signature for payload verification"),
    "x-idempotency-key": z
      .string()
      .min(8)
      .max(128)
      .describe("Idempotency key for duplicate delivery"),
  })
  .openapi("ProviderWebhookHeaders");

export const ProviderWebhookPayloadSchema = z
  .object({
    event: z
      .enum(["booking.confirmed", "booking.cancelled"])
      .describe("Webhook event type"),
    reference: z
      .string()
      .regex(/^BK-[A-Z0-9]{8}$/)
      .describe("Booking reference in TripSync"),
    status: BookingStatusSchema,
    providerSlug: z.string().describe("Source provider slug"),
    occurredAt: z.string().datetime(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .openapi("ProviderWebhookPayload");

export type ProviderWebhookPayload = z.infer<typeof ProviderWebhookPayloadSchema>;
