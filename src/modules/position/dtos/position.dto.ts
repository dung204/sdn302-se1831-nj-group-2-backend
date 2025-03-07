import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { PositionStatus } from '@/modules/position/enums';

export const basePositionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  branch: z.string(),
  status: z.enum(Object.values(PositionStatus) as [string, ...string[]]),
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
