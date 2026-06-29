import {z} from 'zod';

export const createLinkSchema = z.object({
    target_url: z.url(),
    code: z
    .string()
    .regex(/^[a-Za-z0-9_-]{3,16}$/)
    .optional(),

    expires_at: z.string().datetime().optional()
});