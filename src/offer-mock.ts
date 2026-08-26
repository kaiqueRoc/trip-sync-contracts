import type { Offer, SearchOffersQuery } from "./offer.js";

/**
 * Deterministic mock offer generator shared by trip-sync-api and the
 * trip-sync-platform local fallback, so both produce identical results
 * for the same search query without any persistence or shared cache.
 */

interface CatalogEntry {
  name: string;
  roomTypes: string[];
  basePriceCents: number;
  ratingBase: number;
  amenities: string[];
}

const CATALOG: CatalogEntry[] = [
  {
    name: "Pousada Vale Verde",
    roomTypes: ["Standard", "Superior"],
    basePriceCents: 28000,
    ratingBase: 4.1,
    amenities: ["Wi-Fi", "Café da manhã", "Estacionamento"],
  },
  {
    name: "Hotel Serra Azul",
    roomTypes: ["Luxo", "Suíte"],
    basePriceCents: 45000,
    ratingBase: 4.6,
    amenities: ["Wi-Fi", "Piscina", "Café da manhã", "Spa"],
  },
  {
    name: "Pousada Boutique Horizonte",
    roomTypes: ["Superior", "Suíte"],
    basePriceCents: 52000,
    ratingBase: 4.7,
    amenities: ["Wi-Fi", "Piscina", "Vista panorâmica"],
  },
  {
    name: "Hotel Costa Dourada",
    roomTypes: ["Standard", "Vista mar"],
    basePriceCents: 34000,
    ratingBase: 4.2,
    amenities: ["Wi-Fi", "Café da manhã", "Praia particular"],
  },
  {
    name: "Resort Águas Claras",
    roomTypes: ["Bangalô", "Suíte Master"],
    basePriceCents: 68000,
    ratingBase: 4.8,
    amenities: ["Wi-Fi", "Piscina", "Spa", "All inclusive"],
  },
  {
    name: "Pousada do Vento",
    roomTypes: ["Standard"],
    basePriceCents: 21000,
    ratingBase: 3.9,
    amenities: ["Wi-Fi", "Café da manhã"],
  },
  {
    name: "Hotel Cidade Alta",
    roomTypes: ["Executivo", "Superior"],
    basePriceCents: 31000,
    ratingBase: 4.0,
    amenities: ["Wi-Fi", "Academia", "Estacionamento"],
  },
  {
    name: "Pousada Jardim das Flores",
    roomTypes: ["Standard", "Superior"],
    basePriceCents: 26000,
    ratingBase: 4.3,
    amenities: ["Wi-Fi", "Café da manhã", "Jardim"],
  },
  {
    name: "Hotel Panorama",
    roomTypes: ["Standard", "Luxo"],
    basePriceCents: 39000,
    ratingBase: 4.4,
    amenities: ["Wi-Fi", "Piscina", "Café da manhã"],
  },
  {
    name: "Pousada Recanto Tranquilo",
    roomTypes: ["Standard", "Chalé"],
    basePriceCents: 24000,
    ratingBase: 4.0,
    amenities: ["Wi-Fi", "Café da manhã", "Lareira"],
  },
];

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed;
  return function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function generateOffers(query: SearchOffersQuery): Offer[] {
  const normalizedDestination = query.destination.trim().toLowerCase();
  const seedKey = `${normalizedDestination}|${query.checkIn}|${query.checkOut}`;
  const seed = hashSeed(seedKey);
  const rand = mulberry32(seed);
  const nights = nightsBetween(query.checkIn, query.checkOut);

  const shuffled = [...CATALOG]
    .map((entry) => ({ entry, sortKey: rand() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ entry }) => entry);

  const count = 4 + Math.floor(rand() * 3); // 4-6 offers
  const picked = shuffled.slice(0, count);

  return picked.map((entry, index) => {
    const jitter = 0.9 + rand() * 0.3; // ±15% price variation
    const pricePerNightCents = Math.round(entry.basePriceCents * jitter);
    const roomType =
      entry.roomTypes[Math.floor(rand() * entry.roomTypes.length)];
    const rating = Math.min(
      5,
      Math.round((entry.ratingBase + (rand() - 0.5) * 0.4) * 10) / 10,
    );

    return {
      id: `OF-${seed.toString(36)}-${index}`,
      destination: query.destination,
      providerName: entry.name,
      roomType,
      nights,
      pricePerNightCents,
      totalAmountCents: pricePerNightCents * nights,
      currency: "BRL",
      rating,
      amenities: entry.amenities,
    };
  });
}
