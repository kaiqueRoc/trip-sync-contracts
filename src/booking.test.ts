import { describe, expect, it } from "vitest";
import { CreateBookingInputSchema } from "./booking.js";

describe("CreateBookingInputSchema", () => {
  it("accepts valid ticket input", () => {
    const result = CreateBookingInputSchema.safeParse({
      passengerName: "Kaique Rocha",
      passengerDocument: "12345678900",
      passengerEmail: "kaique@example.com",
      flightId: "FL-abc123-0",
      airline: "LATAM",
      flightNumber: "LA1234",
      originAirport: "GRU",
      destinationAirport: "GIG",
      departureAt: "2026-06-01T14:00:00.000Z",
      arrivalAt: "2026-06-01T15:10:00.000Z",
      cabinClass: "ECONOMY",
      seatNumber: "14C",
      amountCents: 45000,
      currency: "BRL",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid cabin class", () => {
    const result = CreateBookingInputSchema.safeParse({
      passengerName: "Test",
      passengerDocument: "12345678900",
      passengerEmail: "test@example.com",
      flightId: "FL-abc123-0",
      airline: "LATAM",
      flightNumber: "LA1234",
      originAirport: "GRU",
      destinationAirport: "GIG",
      departureAt: "2026-06-01T14:00:00.000Z",
      arrivalAt: "2026-06-01T15:10:00.000Z",
      cabinClass: "FIRST",
      seatNumber: "14C",
      amountCents: 45000,
    });
    expect(result.success).toBe(false);
  });
});
