# @trip-sync/contracts

Schema-first API contracts for the **TripSync** portfolio ecosystem — Zod schemas, inferred TypeScript types, and auto-generated **OpenAPI 3.1**.

Part of [Kaique Rocha](https://kaiqueroc.github.io)'s senior portfolio (travel B2B / integrations).

## Related repositories

| Repo | Role |
|------|------|
| [trip-sync-contracts](https://github.com/kaiqueRoc/trip-sync-contracts) | **This repo** — Zod + OpenAPI |
| [trip-sync-api](https://github.com/kaiqueRoc/trip-sync-api) | Backend (Fastify) |
| [trip-sync-ops](https://github.com/kaiqueRoc/trip-sync-ops) | Frontend ops console |
| [trip-sync-platform](https://github.com/kaiqueRoc/trip-sync-platform) | Full stack (Next.js) |

## Install

```bash
npm install @trip-sync/contracts
# or from GitHub tag:
npm install github:kaiqueRoc/trip-sync-contracts#v1.0.0
```

## Usage

```typescript
import {
  CreateBookingInputSchema,
  type CreateBookingInput,
} from "@trip-sync/contracts";

const input: CreateBookingInput = {
  travelerName: "Ana Silva",
  destination: "Rio de Janeiro",
  checkIn: "2026-08-01T15:00:00.000Z",
  checkOut: "2026-08-04T11:00:00.000Z",
  amountCents: 32000,
  currency: "BRL",
};

const parsed = CreateBookingInputSchema.parse(input);
```

## OpenAPI

Generated spec: [`docs/openapi/openapi.json`](./docs/openapi/openapi.json)

```bash
npm run docs:openapi   # regenerate
npm run docs:check     # fail if drift (CI)
```

View locally with [Scalar](https://scalar.com) or Swagger UI pointing at the JSON file.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile to `dist/` |
| `npm test` | Vitest schema tests |
| `npm run docs:openapi` | Zod → OpenAPI 3.1 |
| `npm run docs:check` | CI drift detection |

## Versioning

Semver. Tag releases (`v1.0.0`) and pin in `trip-sync-api`, `trip-sync-ops`, and `trip-sync-platform`.

## ADR

- [001 — Schema-first Zod](./docs/adr/001-schema-first-zod.md)

## License

MIT © Kaique Rocha
