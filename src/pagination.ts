import { z } from "./z.js";

export const PaginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).describe("Page number (1-based)"),
    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Items per page (max 100)"),
  })
  .openapi("PaginationQuery");

export const PaginationMetaSchema = z
  .object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  })
  .openapi("PaginationMeta");

export function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z
    .object({
      data: z.array(itemSchema),
      meta: PaginationMetaSchema,
    })
    .openapi(`Paginated${itemSchema._def.openapi?.metadata?.title ?? "Items"}`);
}

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
