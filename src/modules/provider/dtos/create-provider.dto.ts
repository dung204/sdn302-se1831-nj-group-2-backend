import { z } from 'zod';

export const createProviderDto = z.object({
  name: z.string(),
  description: z.string(),
});

export type CreateProviderDto = z.input<typeof createProviderDto>;
