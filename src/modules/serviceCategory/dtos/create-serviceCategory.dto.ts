import { z } from 'zod';

export const createServiceCategory = z.object({
  name: z.string(),
  description: z.string(),
});

export type CreateServiceCategoryDto = z.input<typeof createServiceCategory>;
