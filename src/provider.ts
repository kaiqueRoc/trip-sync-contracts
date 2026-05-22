import { z } from "./z.js";

export const IntegrationTypeSchema = z
  .enum(["REST", "SOAP"])
  .openapi("IntegrationType");

export const ProviderIdParamSchema = z
  .object({
    id: z.string().cuid(),
  })
  .openapi("ProviderIdParam");

export const CreateProviderInputSchema = z
  .object({
    name: z.string().min(2).max(120).describe("Provider display name"),
    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .min(2)
      .max(64)
      .describe("URL-safe unique slug"),
    integrationType: IntegrationTypeSchema,
    baseUrl: z.string().url().optional().describe("Base URL for REST integrations"),
    active: z.boolean().default(true),
  })
  .openapi("CreateProviderInput");

export const ProviderResponseSchema = z
  .object({
    id: z.string().cuid(),
    name: z.string(),
    slug: z.string(),
    integrationType: IntegrationTypeSchema,
    baseUrl: z.string().url().nullable(),
    active: z.boolean(),
    lastHealthAt: z.string().datetime().nullable(),
    lastHealthStatus: z.enum(["UP", "DOWN", "UNKNOWN"]).nullable(),
    createdAt: z.string().datetime(),
  })
  .openapi("ProviderResponse");

export const ProviderListResponseSchema = z
  .object({
    data: z.array(ProviderResponseSchema),
  })
  .openapi("ProviderListResponse");

export type IntegrationType = z.infer<typeof IntegrationTypeSchema>;
export type CreateProviderInput = z.infer<typeof CreateProviderInputSchema>;
export type ProviderResponse = z.infer<typeof ProviderResponseSchema>;
