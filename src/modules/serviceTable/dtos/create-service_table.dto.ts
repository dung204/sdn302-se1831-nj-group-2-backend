import { z } from 'zod';

export const createServiceTable = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
  categoryId: z.string(),
});

export type CreateServiceTableDto = z.input<typeof createServiceTable>;
