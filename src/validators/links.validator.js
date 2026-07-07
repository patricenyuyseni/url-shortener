import { z } from "zod";

export const createLinkSchema = z.object({
  target_url: z.string().url(),

  code: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional(),

  expires_at: z.string().datetime().optional()
});