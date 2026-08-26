import { z } from "./z.js";

export const MockPaymentInputSchema = z
  .object({
    cardHolderName: z.string().min(2).max(120),
    cardNumber: z
      .string()
      .regex(/^\d{13,19}$/)
      .describe("Digits only — validated for shape, never persisted"),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/).describe("MM/YY"),
    cvv: z.string().regex(/^\d{3,4}$/),
    amountCents: z.number().int().positive(),
  })
  .openapi("MockPaymentInput");

export const MockPaymentResultSchema = z
  .object({
    approved: z.boolean(),
    authorizationCode: z.string(),
  })
  .openapi("MockPaymentResult");

export type MockPaymentInput = z.infer<typeof MockPaymentInputSchema>;
export type MockPaymentResult = z.infer<typeof MockPaymentResultSchema>;
