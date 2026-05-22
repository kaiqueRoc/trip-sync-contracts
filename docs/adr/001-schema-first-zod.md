# ADR-001: Schema-first API documentation with Zod

## Status

Accepted

## Context

TripSync spans four repositories (`contracts`, `api`, `ops`, `platform`). Documentation drift between code and OpenAPI is a common failure mode in distributed teams and portfolio projects.

## Decision

- All public API shapes live in `@trip-sync/contracts` as **Zod schemas**.
- OpenAPI 3.1 is **generated** via `@asteasolutions/zod-to-openapi`, never hand-written.
- CI runs `docs:check` to fail PRs when `openapi.json` is out of date.
- Downstream repos pin semver tags of `contracts` and regenerate HTTP clients from OpenAPI.

## Consequences

- Single source of truth for validation, TypeScript types, and API docs.
- Breaking changes require a semver bump in `contracts` and coordinated updates in consumers.
- Runtime dependency on Zod only in `contracts`; consumers import compiled `dist/`.
