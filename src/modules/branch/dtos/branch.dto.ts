import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { serviceTableDto } from '@/modules/service-table/dtos';

const baseBranchSchema = z.object({
  _id: z.string(),
  name: z.string(),
  address: z.string().nullable(),
  services: z.array(serviceTableDto),
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
