import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';

const baseUsageTrackingSchema = z.object({
  _id: z.string(),
  user: z.string(),
  computer: z.string(),
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
