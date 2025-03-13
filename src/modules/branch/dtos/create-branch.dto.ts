import { z } from 'zod';

export const createBranchDto = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().nullable().optional(),
});

export type CreateBranchDto = z.infer<typeof createBranchDto>;
