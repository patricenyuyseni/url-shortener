import { z } from "zod";


const httpUrl = z
    .string()
    .url()
    .refine(
        (value) => {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        },
        {
            message: "Only HTTP and HTTPS URLs are allowed"
        }
    );


export const createLinkSchema = z.object({
    target_url: httpUrl,

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