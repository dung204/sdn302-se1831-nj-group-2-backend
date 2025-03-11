import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { branchDto } from '@/modules/branch/dtos';
import { PositionStatus } from '@/modules/position/enums';

export const basePositionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  branch: branchDto,
  status: z.enum([PositionStatus.AVAILABLE, PositionStatus.IN_USE]),
  createTimestamp: z.date(),
});

export const positionDto = basePositionSchema.transform(({ _id, ...data }) => ({
  id: _id,
  ...data,
}));

export const deletedPositionDto = basePositionSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type PositionDto = z.infer<typeof positionDto>;

export type DeletedPositionDto = z.infer<typeof deletedPositionDto>;
