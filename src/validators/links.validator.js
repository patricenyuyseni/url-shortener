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

export const codeParamSchema = z.object({
    code: z
        .string()
        .min(3)
        .max(16)
        .regex(/^[A-Za-z0-9_-]+$/)
});

export const clicksQuerySchema = z.object({
    after_clicked_at: z.string().datetime().optional(),

    after_id: z.coerce
        .number()
        .int()
        .positive()
        .optional(),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
});