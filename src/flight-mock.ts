import type { CabinClass, Flight, SearchFlightsQuery } from "./flight.js";
import type { Seat, SeatType } from "./seatmap.js";
import { hashSeed, mulberry32 } from "./mock-utils.js";

/**
 * Deterministic mock flight + seatmap generators shared by trip-sync-api
 * and the trip-sync-platform local fallback. Nothing here is persisted —
 * the same search query (or the same flightId+cabinClass) always
 * reproduces the same results.
 */

export const AIRPORTS: Record<string, string> = {
  GRU: "São Paulo",
  GIG: "Rio de Janeiro",
  CNF: "Belo Horizonte",
  SSA: "Salvador",
  FOR: "Fortaleza",
  POA: "Porto Alegre",
  REC: "Recife",
  BSB: "Brasília",
  CWB: "Curitiba",
  MAO: "Manaus",
};

const AIRLINES = [
  { name: "LATAM", prefix: "LA" },
  { name: "GOL", prefix: "G3" },
  { name: "Azul", prefix: "AD" },
  { name: "Voepass", prefix: "2Z" },
];

const AIRCRAFT = [
  "Airbus A320",
  "Airbus A321neo",
  "Boeing 737-800",
  "Embraer E195",
];

export function generateFlights(query: SearchFlightsQuery): Flight[] {
  const origin = query.origin.toUpperCase();
  const destination = query.destination.toUpperCase();
  const seedKey = `${origin}|${destination}|${query.departureDate.slice(0, 10)}`;
  const seed = hashSeed(seedKey);
  const rand = mulberry32(seed);

  const originCity = AIRPORTS[origin] ?? origin;
  const destinationCity = AIRPORTS[destination] ?? destination;

  const count = 4 + Math.floor(rand() * 4); // 4-7 flights
  const flights: Flight[] = [];

  for (let i = 0; i < count; i++) {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
    const flightNumber = `${airline.prefix}${1000 + Math.floor(rand() * 8999)}`;
    const durationMinutes = 60 + Math.floor(rand() * 240); // 1h-5h
    const aircraft = AIRCRAFT[Math.floor(rand() * AIRCRAFT.length)];

    const departureHour = 5 + Math.floor(rand() * 18); // 05:00-23:00
    const departureMinute = Math.floor(rand() * 12) * 5;
    const departure = new Date(`${query.departureDate.slice(0, 10)}T00:00:00.000Z`);
    departure.setUTCHours(departureHour, departureMinute, 0, 0);
    const arrival = new Date(departure.getTime() + durationMinutes * 60000);

    const basePriceCents = 15000 + durationMinutes * 90;
    const economyPrice = Math.round(basePriceCents * (0.9 + rand() * 0.3));

    flights.push({
      id: `FL-${seed.toString(36)}-${i}`,
      airline: airline.name,
      flightNumber,
      originAirport: origin,
      originCity,
      destinationAirport: destination,
      destinationCity,
      departureAt: departure.toISOString(),
      arrivalAt: arrival.toISOString(),
      durationMinutes,
      aircraft,
      cabinClasses: [
        {
          cabinClass: "ECONOMY",
          priceCents: economyPrice,
          seatsAvailable: 20 + Math.floor(rand() * 60),
        },
        {
          cabinClass: "PREMIUM",
          priceCents: Math.round(economyPrice * 1.6),
          seatsAvailable: 8 + Math.floor(rand() * 12),
        },
        {
          cabinClass: "BUSINESS",
          priceCents: Math.round(economyPrice * 2.6),
          seatsAvailable: 4 + Math.floor(rand() * 8),
        },
      ],
    });
  }

  return flights.sort((a, b) => a.departureAt.localeCompare(b.departureAt));
}

const ROW_RANGES: Record<CabinClass, [number, number]> = {
  BUSINESS: [1, 3],
  PREMIUM: [4, 8],
  ECONOMY: [9, 25],
};

const COLUMNS = ["A", "B", "C", "D", "E", "F"];

const SEAT_TYPE: Record<string, SeatType> = {
  A: "WINDOW",
  B: "MIDDLE",
  C: "AISLE",
  D: "AISLE",
  E: "MIDDLE",
  F: "WINDOW",
};

export function generateSeatMap(flightId: string, cabinClass: CabinClass): Seat[] {
  const seed = hashSeed(`${flightId}|${cabinClass}`);
  const rand = mulberry32(seed);
  const [start, end] = ROW_RANGES[cabinClass];
  const seats: Seat[] = [];

  for (let row = start; row <= end; row++) {
    for (const column of COLUMNS) {
      seats.push({
        seatNumber: `${row}${column}`,
        row,
        column,
        seatType: SEAT_TYPE[column],
        cabinClass,
        available: rand() > 0.28,
        extraFeeCents: 0,
      });
    }
  }

  return seats;
}
