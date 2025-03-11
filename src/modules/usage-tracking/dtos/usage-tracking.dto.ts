import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { computerDto } from '@/modules/computer/dtos';
import { userDto } from '@/modules/user/dtos';

const baseUsageTrackingSchema = z.object({
  _id: z.string(),
  user: userDto,
  computer: computerDto,
  startTimeStamp: z.date(),
  endTimeStamp: z.date(),
  createTimestamp: z.date(),
});

export const usageTrackingDto = baseUsageTrackingSchema.transform(
  ({ _id, ...data }) => ({
    id: _id,
    ...data,
  }),
);

export const deletedUsageTrackingDto = baseUsageTrackingSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type UsageTrackingDto = z.infer<typeof usageTrackingDto>;

export type DeletedUsageTrackingDto = z.infer<typeof deletedUsageTrackingDto>;
