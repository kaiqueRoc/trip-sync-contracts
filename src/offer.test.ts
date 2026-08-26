import { describe, expect, it } from "vitest";
import { generateOffers } from "./offer-mock.js";
import { SearchOffersQuerySchema } from "./offer.js";

describe("SearchOffersQuerySchema", () => {
  it("accepts a valid search query", () => {
    const result = SearchOffersQuerySchema.safeParse({
      destination: "Gramado, RS",
      checkIn: "2026-06-01T14:00:00.000Z",
      checkOut: "2026-06-05T11:00:00.000Z",
      travelers: 2,
    });
    expect(result.success).toBe(true);
  });

  it("rejects checkOut before checkIn", () => {
    const result = SearchOffersQuerySchema.safeParse({
      destination: "Gramado, RS",
      checkIn: "2026-06-10T14:00:00.000Z",
      checkOut: "2026-06-01T11:00:00.000Z",
      travelers: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe("generateOffers", () => {
  const query = {
    destination: "Gramado, RS",
    checkIn: "2026-06-01T14:00:00.000Z",
    checkOut: "2026-06-05T11:00:00.000Z",
    travelers: 2,
  };

  it("returns 4 to 6 offers", () => {
    const offers = generateOffers(query);
    expect(offers.length).toBeGreaterThanOrEqual(4);
    expect(offers.length).toBeLessThanOrEqual(6);
  });

  it("is deterministic for the same query", () => {
    const first = generateOffers(query);
    const second = generateOffers({ ...query });
    expect(second).toEqual(first);
  });

  it("produces different offers for a different destination", () => {
    const gramado = generateOffers(query);
    const florianopolis = generateOffers({
      ...query,
      destination: "Florianópolis, SC",
    });
    expect(florianopolis.map((o) => o.id)).not.toEqual(
      gramado.map((o) => o.id),
    );
  });

  it("computes totalAmountCents as pricePerNightCents * nights", () => {
    const offers = generateOffers(query);
    for (const offer of offers) {
      expect(offer.nights).toBe(4);
      expect(offer.totalAmountCents).toBe(
        offer.pricePerNightCents * offer.nights,
      );
    }
  });
});
