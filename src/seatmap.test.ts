import { describe, expect, it } from "vitest";
import { generateSeatMap } from "./flight-mock.js";

describe("generateSeatMap", () => {
  it("is deterministic for the same flight + cabin class", () => {
    const first = generateSeatMap("FL-abc123-0", "ECONOMY");
    const second = generateSeatMap("FL-abc123-0", "ECONOMY");
    expect(second).toEqual(first);
  });

  it("produces different maps for a different cabin class", () => {
    const economy = generateSeatMap("FL-abc123-0", "ECONOMY");
    const business = generateSeatMap("FL-abc123-0", "BUSINESS");
    expect(business.length).not.toEqual(economy.length);
  });

  it("assigns window seats to columns A and F", () => {
    const seats = generateSeatMap("FL-abc123-0", "ECONOMY");
    for (const seat of seats) {
      if (seat.column === "A" || seat.column === "F") {
        expect(seat.seatType).toBe("WINDOW");
      }
    }
  });

  it("has a mix of available and unavailable seats", () => {
    const seats = generateSeatMap("FL-abc123-0", "ECONOMY");
    const available = seats.filter((s) => s.available).length;
    expect(available).toBeGreaterThan(0);
    expect(available).toBeLessThan(seats.length);
  });
});
