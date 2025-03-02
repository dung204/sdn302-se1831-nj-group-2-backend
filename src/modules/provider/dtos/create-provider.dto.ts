import { z } from 'zod';

export const createProviderDto = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type CreateProviderDto = z.input<typeof createProviderDto>;
