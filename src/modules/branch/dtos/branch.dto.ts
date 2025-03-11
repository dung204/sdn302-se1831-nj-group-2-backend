import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
// import { serviceDto } from '@/modules/service/dtos/service.dto';
import { userDto } from '@/modules/user/dtos/user.dto';

const baseBranchSchema = z.object({
  _id: z.string(),
  name: z.string(),
  address: z.string().nullable(),
  admin: z.string().or(userDto),
  // services: z.array(z.string().or(serviceDto)),
  createTimestamp: z.date(),
});

export const branchDto = baseBranchSchema.transform(({ _id, ...data }) => ({
  id: _id,
  ...data,
}));

export const deletedBranchDto = baseBranchSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type BranchDto = z.infer<typeof branchDto>;

export type DeletedBranchDto = z.infer<typeof deletedBranchDto>;
