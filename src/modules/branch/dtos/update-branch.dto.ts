import { z } from 'zod';

// Make sure the DTO matches what the service expects
export const updateBranchDto = z
  .object({
    name: z.string().optional(),
    address: z.string().nullable().optional(),
    admin: z.string().optional(),
    services: z.array(z.string()).optional(),
  })
  .partial();

// Type export for TypeScript
export type UpdateBranchDto = z.infer<typeof updateBranchDto>;
