import { z } from "./z.js";
import { CabinClassSchema } from "./flight.js";

export const SeatTypeSchema = z
  .enum(["WINDOW", "MIDDLE", "AISLE"])
  .openapi("SeatType");

export const SeatSchema = z
  .object({
    seatNumber: z.string().describe("e.g. 14C"),
    row: z.number().int().positive(),
    column: z.string().length(1),
    seatType: SeatTypeSchema,
    cabinClass: CabinClassSchema,
    available: z.boolean(),
    extraFeeCents: z.number().int().nonnegative().default(0),
  })
  .openapi("Seat");

export const SeatMapQuerySchema = z
  .object({
    flightId: z.string(),
    cabinClass: CabinClassSchema,
  })
  .openapi("SeatMapQuery");

export const SeatMapResponseSchema = z
  .object({
    flightId: z.string(),
    cabinClass: CabinClassSchema,
    seats: z.array(SeatSchema),
  })
  .openapi("SeatMapResponse");

export type SeatType = z.infer<typeof SeatTypeSchema>;
export type Seat = z.infer<typeof SeatSchema>;
export type SeatMapQuery = z.infer<typeof SeatMapQuerySchema>;
export type SeatMapResponse = z.infer<typeof SeatMapResponseSchema>;
