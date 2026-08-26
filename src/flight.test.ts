import { describe, expect, it } from "vitest";
import { generateFlights } from "./flight-mock.js";
import { SearchFlightsQuerySchema } from "./flight.js";

describe("SearchFlightsQuerySchema", () => {
  it("accepts a valid search query", () => {
    const result = SearchFlightsQuerySchema.safeParse({
      origin: "GRU",
      destination: "GIG",
      departureDate: "2026-06-01T00:00:00.000Z",
      passengers: 2,
    });
    expect(result.success).toBe(true);
  });

  it("rejects origin equal to destination", () => {
    const result = SearchFlightsQuerySchema.safeParse({
      origin: "GRU",
      destination: "GRU",
      departureDate: "2026-06-01T00:00:00.000Z",
      passengers: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe("generateFlights", () => {
  const query = {
    origin: "GRU",
    destination: "GIG",
    departureDate: "2026-06-01T00:00:00.000Z",
    passengers: 1,
  };

  it("returns 4 to 7 flights", () => {
    const flights = generateFlights(query);
    expect(flights.length).toBeGreaterThanOrEqual(4);
    expect(flights.length).toBeLessThanOrEqual(7);
  });

  it("is deterministic for the same query", () => {
    const first = generateFlights(query);
    const second = generateFlights({ ...query });
    expect(second).toEqual(first);
  });

  it("produces different flights for a different route", () => {
    const gruGig = generateFlights(query);
    const gruSsa = generateFlights({ ...query, destination: "SSA" });
    expect(gruSsa.map((f) => f.id)).not.toEqual(gruGig.map((f) => f.id));
  });

  it("each flight has three cabin classes with business the most expensive", () => {
    const flights = generateFlights(query);
    for (const flight of flights) {
      expect(flight.cabinClasses).toHaveLength(3);
      const [economy, premium, business] = flight.cabinClasses;
      expect(economy.priceCents).toBeLessThan(premium.priceCents);
      expect(premium.priceCents).toBeLessThan(business.priceCents);
    }
  });
});
