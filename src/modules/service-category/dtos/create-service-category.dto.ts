import { z } from 'zod';

export const createServiceCategoryDto = z.object({
  name: z.string(),
  description: z.string(),
});

export type CreateServiceCategoryDto = z.input<typeof createServiceCategoryDto>;
