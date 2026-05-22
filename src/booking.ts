import { z } from "./z.js";

export const BookingStatusSchema = z
  .enum(["PENDING", "CONFIRMED", "CANCELLED"])
  .openapi("BookingStatus");

export const BookingIdParamSchema = z
  .object({
    id: z.string().cuid().describe("Booking unique identifier"),
  })
  .openapi("BookingIdParam");

export const CreateBookingInputSchema = z
  .object({
    travelerName: z
      .string()
      .min(2)
      .max(120)
      .describe("Full name of the traveler"),
    destination: z
      .string()
      .min(2)
      .max(200)
      .describe("City or destination label"),
    checkIn: z.string().datetime().describe("Check-in date (ISO 8601)"),
    checkOut: z.string().datetime().describe("Check-out date (ISO 8601)"),
    amountCents: z
      .number()
      .int()
      .positive()
      .describe("Total amount in cents"),
    currency: z
      .string()
      .length(3)
      .default("BRL")
      .describe("ISO 4217 currency code"),
    providerId: z
      .string()
      .cuid()
      .optional()
      .describe("Optional linked provider for sync"),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  })
  .openapi("CreateBookingInput");

export const UpdateBookingStatusInputSchema = z
  .object({
    status: z.enum(["CONFIRMED", "CANCELLED"]).describe("Target status transition"),
    reason: z.string().max(500).optional().describe("Cancellation or audit reason"),
  })
  .openapi("UpdateBookingStatusInput");

export const BookingResponseSchema = z
  .object({
    id: z.string().cuid(),
    reference: z
      .string()
      .regex(/^BK-[A-Z0-9]{8}$/)
      .describe("Human-readable booking reference"),
    travelerName: z.string(),
    destination: z.string(),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    amountCents: z.number().int().positive(),
    currency: z.string().length(3),
    status: BookingStatusSchema,
    providerId: z.string().cuid().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("BookingResponse");

export const BookingListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    status: BookingStatusSchema.optional(),
    destination: z.string().optional().describe("Filter by destination (partial match)"),
    providerId: z.string().cuid().optional(),
  })
  .openapi("BookingListQuery");

export const BookingListResponseSchema = z
  .object({
    data: z.array(BookingResponseSchema),
    meta: z.object({
      page: z.number().int().positive(),
      pageSize: z.number().int().positive(),
      totalItems: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  })
  .openapi("BookingListResponse");

export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingInputSchema>;
export type UpdateBookingStatusInput = z.infer<typeof UpdateBookingStatusInputSchema>;
export type BookingResponse = z.infer<typeof BookingResponseSchema>;
export type BookingListQuery = z.infer<typeof BookingListQuerySchema>;
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>;
