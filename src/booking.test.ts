import { describe, expect, it } from "vitest";
import { CreateBookingInputSchema } from "./booking.js";

describe("CreateBookingInputSchema", () => {
  it("accepts valid booking input", () => {
    const result = CreateBookingInputSchema.safeParse({
      travelerName: "Kaique Rocha",
      destination: "São Paulo",
      checkIn: "2026-06-01T14:00:00.000Z",
      checkOut: "2026-06-05T11:00:00.000Z",
      amountCents: 45000,
      currency: "BRL",
    });
    expect(result.success).toBe(true);
  });

  it("rejects checkOut before checkIn", () => {
    const result = CreateBookingInputSchema.safeParse({
      travelerName: "Test",
      destination: "BH",
      checkIn: "2026-06-10T14:00:00.000Z",
      checkOut: "2026-06-01T11:00:00.000Z",
      amountCents: 1000,
    });
    expect(result.success).toBe(false);
  });
});
