import { z } from 'zod';

export const createServiceTableDto = z.object({
  name: z.string(),
  description: z.string(),
  price: z.coerce.number().positive(),
  category: z.string(),
  branches: z
    .union([
      z.string().transform((value) => value.split(',')),
      z.array(z.string()),
    ])
    .transform((value) => [...new Set(value)])
    .optional()
    .default([]),
});

export type CreateServiceTableDto = z.input<typeof createServiceTableDto>;
