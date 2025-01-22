import { z } from 'zod';

export const deleteDto = z.object({
  deleteTimestamp: z.date(),
});

export type DeleteDto = z.infer<typeof deleteDto>;
