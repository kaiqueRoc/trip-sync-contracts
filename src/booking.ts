import { z } from "./z.js";
import { CabinClassSchema } from "./flight.js";

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
    passengerName: z.string().min(2).max(120),
    passengerDocument: z
      .string()
      .min(5)
      .max(20)
      .describe("CPF or passport number"),
    passengerEmail: z.string().email(),
    flightId: z.string().describe("Flight id from the search results"),
    airline: z.string(),
    flightNumber: z.string(),
    originAirport: z.string().length(3),
    destinationAirport: z.string().length(3),
    departureAt: z.string().datetime(),
    arrivalAt: z.string().datetime(),
    cabinClass: CabinClassSchema,
    seatNumber: z.string(),
    amountCents: z.number().int().positive(),
    currency: z.string().length(3).default("BRL"),
    providerId: z
      .string()
      .cuid()
      .optional()
      .describe("Optional linked provider for sync"),
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
      .describe("Human-readable ticket locator"),
    passengerName: z.string(),
    passengerDocument: z.string(),
    passengerEmail: z.string().email(),
    airline: z.string(),
    flightNumber: z.string(),
    originAirport: z.string(),
    destinationAirport: z.string(),
    departureAt: z.string().datetime(),
    arrivalAt: z.string().datetime(),
    cabinClass: CabinClassSchema,
    seatNumber: z.string(),
    amountCents: z.number().int().positive(),
    currency: z.string().length(3),
    status: BookingStatusSchema,
    userId: z.string().nullable(),
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
