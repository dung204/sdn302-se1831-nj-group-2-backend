import { z } from 'zod';

export const createServiceTableDto = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  categoryId: z.string(),
});

export type CreateServiceTableDto = z.input<typeof createServiceTableDto>;
