import { z } from 'zod';

export const commonQueryDto = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  pageSize: z.coerce.number().int().positive().catch(10).default(10),
});

export type CommonQueryDto = z.infer<typeof commonQueryDto>;
