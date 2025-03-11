import { z } from 'zod';

import { createBranchDto } from '@/modules/branch/dtos/create-branch.dto';

export const updateBranchDtoSchema = createBranchDto.partial();

export const updateBranchDto = updateBranchDtoSchema;
export type UpdateBranchDto = z.infer<typeof updateBranchDtoSchema>;
