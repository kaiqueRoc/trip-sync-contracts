import { z } from "./z.js";

export const CabinClassSchema = z
  .enum(["ECONOMY", "PREMIUM", "BUSINESS"])
  .openapi("CabinClass");

export const SearchFlightsQuerySchema = z
  .object({
    origin: z
      .string()
      .length(3)
      .describe("Origin airport IATA code, e.g. GRU"),
    destination: z
      .string()
      .length(3)
      .describe("Destination airport IATA code, e.g. GIG"),
    departureDate: z
      .string()
      .datetime()
      .describe("Departure date (ISO 8601)"),
    passengers: z.coerce
      .number()
      .int()
      .min(1)
      .max(9)
      .default(1)
      .describe("Number of passengers"),
  })
  .refine(
    (data) => data.origin.toUpperCase() !== data.destination.toUpperCase(),
    { message: "origin and destination must differ", path: ["destination"] },
  )
  .openapi("SearchFlightsQuery");

export const CabinClassOptionSchema = z
  .object({
    cabinClass: CabinClassSchema,
    priceCents: z.number().int().positive(),
    seatsAvailable: z.number().int().nonnegative(),
  })
  .openapi("CabinClassOption");

export const FlightSchema = z
  .object({
    id: z
      .string()
      .describe("Deterministic flight identifier — stable for the same search query"),
    airline: z.string(),
    flightNumber: z.string(),
    originAirport: z.string(),
    originCity: z.string(),
    destinationAirport: z.string(),
    destinationCity: z.string(),
    departureAt: z.string().datetime(),
    arrivalAt: z.string().datetime(),
    durationMinutes: z.number().int().positive(),
    aircraft: z.string(),
    cabinClasses: z.array(CabinClassOptionSchema),
  })
  .openapi("Flight");

export const SearchFlightsResponseSchema = z
  .object({
    data: z.array(FlightSchema),
    query: SearchFlightsQuerySchema,
  })
  .openapi("SearchFlightsResponse");

export type CabinClass = z.infer<typeof CabinClassSchema>;
export type SearchFlightsQuery = z.infer<typeof SearchFlightsQuerySchema>;
export type CabinClassOption = z.infer<typeof CabinClassOptionSchema>;
export type Flight = z.infer<typeof FlightSchema>;
export type SearchFlightsResponse = z.infer<typeof SearchFlightsResponseSchema>;
