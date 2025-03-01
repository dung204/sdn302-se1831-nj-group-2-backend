import { z } from 'zod';

export const createUsageTrackingDto = z.object({
  user: z.string(),
  computer: z.string(),
  startTimeStamp: z.date(),
  endTimeStamp: z.date(),
});

export type CreateUsageTrackingDto = z.input<typeof createUsageTrackingDto>;
