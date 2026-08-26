import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import {
  BookingIdParamSchema,
  BookingListQuerySchema,
  BookingListResponseSchema,
  BookingResponseSchema,
  CreateBookingInputSchema,
  UpdateBookingStatusInputSchema,
} from "./booking.js";
import { ApiErrorSchema } from "./errors.js";
import { HealthResponseSchema } from "./health.js";
import {
  SearchOffersQuerySchema,
  SearchOffersResponseSchema,
} from "./offer.js";
import {
  CreateProviderInputSchema,
  ProviderIdParamSchema,
  ProviderListResponseSchema,
  ProviderResponseSchema,
} from "./provider.js";
import {
  CreateSyncJobInputSchema,
  SyncJobListQuerySchema,
  SyncJobResponseSchema,
} from "./sync-job.js";
import { ProviderWebhookPayloadSchema } from "./webhook.js";
import { z } from "./z.js";

const registry = new OpenAPIRegistry();

const err400 = {
  description: "Validation error",
  content: { "application/json": { schema: ApiErrorSchema } },
};
const err404 = {
  description: "Resource not found",
  content: { "application/json": { schema: ApiErrorSchema } },
};
const err409 = {
  description: "Conflict / idempotency replay",
  content: { "application/json": { schema: ApiErrorSchema } },
};
const err500 = {
  description: "Internal server error",
  content: { "application/json": { schema: ApiErrorSchema } },
};

registry.registerPath({
  method: "get",
  path: "/health",
  summary: "Health check",
  tags: ["System"],
  responses: {
    200: {
      description: "Service health",
      content: { "application/json": { schema: HealthResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/bookings",
  summary: "List bookings",
  tags: ["Bookings"],
  request: { query: BookingListQuerySchema },
  responses: {
    200: {
      description: "Paginated booking list",
      content: { "application/json": { schema: BookingListResponseSchema } },
    },
    400: err400,
    500: err500,
  },
});

registry.registerPath({
  method: "post",
  path: "/bookings",
  summary: "Create booking",
  tags: ["Bookings"],
  request: {
    body: {
      content: { "application/json": { schema: CreateBookingInputSchema } },
      required: true,
    },
    headers: z.object({
      "idempotency-key": z
        .string()
        .optional()
        .describe("Optional idempotency key for safe retries"),
    }),
  },
  responses: {
    201: {
      description: "Booking created",
      content: { "application/json": { schema: BookingResponseSchema } },
    },
    400: err400,
    409: err409,
    500: err500,
  },
});

registry.registerPath({
  method: "get",
  path: "/bookings/{id}",
  summary: "Get booking by ID",
  tags: ["Bookings"],
  request: { params: BookingIdParamSchema },
  responses: {
    200: {
      description: "Booking details",
      content: { "application/json": { schema: BookingResponseSchema } },
    },
    404: err404,
    500: err500,
  },
});

registry.registerPath({
  method: "patch",
  path: "/bookings/{id}/status",
  summary: "Update booking status",
  tags: ["Bookings"],
  request: {
    params: BookingIdParamSchema,
    body: {
      content: { "application/json": { schema: UpdateBookingStatusInputSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Updated booking",
      content: { "application/json": { schema: BookingResponseSchema } },
    },
    400: err400,
    404: err404,
    409: err409,
    500: err500,
  },
});

registry.registerPath({
  method: "get",
  path: "/offers/search",
  summary: "Search mocked availability offers",
  tags: ["Offers"],
  request: { query: SearchOffersQuerySchema },
  responses: {
    200: {
      description: "Mocked offer results — deterministic per query",
      content: { "application/json": { schema: SearchOffersResponseSchema } },
    },
    400: err400,
    500: err500,
  },
});

registry.registerPath({
  method: "get",
  path: "/providers",
  summary: "List integration providers",
  tags: ["Providers"],
  responses: {
    200: {
      description: "Provider list",
      content: { "application/json": { schema: ProviderListResponseSchema } },
    },
    500: err500,
  },
});

registry.registerPath({
  method: "post",
  path: "/providers",
  summary: "Register provider",
  tags: ["Providers"],
  request: {
    body: {
      content: { "application/json": { schema: CreateProviderInputSchema } },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Provider created",
      content: { "application/json": { schema: ProviderResponseSchema } },
    },
    400: err400,
    409: err409,
    500: err500,
  },
});

registry.registerPath({
  method: "get",
  path: "/providers/{id}",
  summary: "Get provider",
  tags: ["Providers"],
  request: { params: ProviderIdParamSchema },
  responses: {
    200: {
      description: "Provider details",
      content: { "application/json": { schema: ProviderResponseSchema } },
    },
    404: err404,
    500: err500,
  },
});

registry.registerPath({
  method: "post",
  path: "/sync-jobs",
  summary: "Enqueue provider sync job",
  tags: ["Sync"],
  request: {
    body: {
      content: { "application/json": { schema: CreateSyncJobInputSchema } },
      required: true,
    },
  },
  responses: {
    202: {
      description: "Sync job accepted",
      content: { "application/json": { schema: SyncJobResponseSchema } },
    },
    400: err400,
    404: err404,
    500: err500,
  },
});

registry.registerPath({
  method: "get",
  path: "/sync-jobs",
  summary: "List sync jobs",
  tags: ["Sync"],
  request: { query: SyncJobListQuerySchema },
  responses: {
    200: {
      description: "Sync job list",
      content: {
        "application/json": {
          schema: z.array(SyncJobResponseSchema),
        },
      },
    },
    400: err400,
    500: err500,
  },
});

registry.registerPath({
  method: "post",
  path: "/webhooks/provider",
  summary: "Inbound provider webhook",
  tags: ["Webhooks"],
  request: {
    body: {
      content: { "application/json": { schema: ProviderWebhookPayloadSchema } },
      required: true,
    },
    headers: z.object({
      "x-provider-signature": z.string().describe("HMAC signature"),
      "x-idempotency-key": z.string().describe("Webhook idempotency key"),
    }),
  },
  responses: {
    200: { description: "Webhook processed" },
    400: err400,
    409: err409,
    500: err500,
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "TripSync API",
      version: "1.1.0",
      description:
        "Travel B2B integration API — schema-first contracts from Zod (@trip-sync/contracts).",
      contact: {
        name: "Kaique Rocha",
        url: "https://github.com/kaiqueRoc",
      },
    },
    servers: [
      { url: "http://localhost:3333", description: "Local development" },
      {
        url: "https://api.example.tripsync.dev",
        description: "Staging (placeholder)",
      },
    ],
    tags: [
      { name: "System", description: "Health and metadata" },
      { name: "Bookings", description: "Reservation lifecycle" },
      { name: "Offers", description: "Mocked availability search" },
      { name: "Providers", description: "REST/SOAP integration partners" },
      { name: "Sync", description: "Async provider synchronization" },
      { name: "Webhooks", description: "Inbound provider events" },
    ],
  });
}
