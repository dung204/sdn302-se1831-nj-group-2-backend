import { z } from 'zod';

export const createUsageTrackingDto = z.object({
  user: z.string(),
  computer: z.string(),
  startTimeStamp: z.coerce.date(), // z.coerce => is used to convert from string to other type variables => ex: string -> date
  endTimeStamp: z.coerce.date(),
});

export type CreateUsageTrackingDto = z.input<typeof createUsageTrackingDto>;
