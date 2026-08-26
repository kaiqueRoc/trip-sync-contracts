import { z } from "./z.js";

export const RegisterInputSchema = z
  .object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(72),
  })
  .openapi("RegisterInput");

export const LoginInputSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .openapi("LoginInput");

export const AuthUserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })
  .openapi("AuthUser");

export const AuthResponseSchema = z
  .object({
    token: z.string(),
    user: AuthUserSchema,
  })
  .openapi("AuthResponse");

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
