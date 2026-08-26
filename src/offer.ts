import { z } from "./z.js";

export const SearchOffersQuerySchema = z
  .object({
    destination: z
      .string()
      .min(2)
      .max(200)
      .describe("City or destination label"),
    checkIn: z.string().datetime().describe("Check-in date (ISO 8601)"),
    checkOut: z.string().datetime().describe("Check-out date (ISO 8601)"),
    travelers: z.coerce
      .number()
      .int()
      .min(1)
      .max(9)
      .default(1)
      .describe("Number of travelers"),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  })
  .openapi("SearchOffersQuery");

export const OfferSchema = z
  .object({
    id: z
      .string()
      .describe(
        "Deterministic offer identifier — stable for the same search query",
      ),
    destination: z.string(),
    providerName: z.string().describe("Mocked hotel/pousada name"),
    roomType: z.string(),
    nights: z.number().int().positive(),
    pricePerNightCents: z.number().int().positive(),
    totalAmountCents: z.number().int().positive(),
    currency: z.string().length(3).default("BRL"),
    rating: z.number().min(1).max(5),
    amenities: z.array(z.string()),
  })
  .openapi("Offer");

export const SearchOffersResponseSchema = z
  .object({
    data: z.array(OfferSchema),
    query: SearchOffersQuerySchema,
  })
  .openapi("SearchOffersResponse");

export type SearchOffersQuery = z.infer<typeof SearchOffersQuerySchema>;
export type Offer = z.infer<typeof OfferSchema>;
export type SearchOffersResponse = z.infer<typeof SearchOffersResponseSchema>;
