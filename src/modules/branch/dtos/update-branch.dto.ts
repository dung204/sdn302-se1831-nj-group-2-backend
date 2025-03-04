import { z } from 'zod';

export const updateBranchDtoSchema = z.object({
  name: z.string().optional(),
  address: z.string().nullable().optional(),
  admin: z.string().optional(),
  services: z.array(z.string()).optional(),
});

export const updateBranchDto = updateBranchDtoSchema;
export type UpdateBranchDto = z.infer<typeof updateBranchDtoSchema>;
