import { z } from 'zod';

export const createBranchDto = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().nullable().optional(),
  admin: z.string(),
  services: z
    .union([
      z.string().transform((value) => value.split(',')),
      z.array(z.string()),
    ])
    .transform((value) => [...new Set(value)]),
});

export type CreateBranchDto = z.infer<typeof createBranchDto>;
