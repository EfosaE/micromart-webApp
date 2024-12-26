import { z } from 'zod';

export const authSchema = z.object({
  name: z
    .string()
    .min(3, 'Must contain at least 3 chars')
    .max(24, 'Must contain 24 chars max'),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Must contain at least 8 chars')
    .max(48, 'Must contain at most 48 chars'),
});

export type RegisterAccountAuth = z.infer<typeof authSchema>;

export const authSchemaWithoutName = authSchema.omit({ name: true });

export type GetUserByEmailAuth = z.infer<typeof authSchemaWithoutName>;
