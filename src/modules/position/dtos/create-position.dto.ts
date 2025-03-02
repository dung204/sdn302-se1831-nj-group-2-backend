import { z } from 'zod';

import { PositionStatus } from '../enums';

export const createPositionDto = z.object({
  name: z.string(),
  branch: z.string(),
  status: z
    .enum(Object.values(PositionStatus) as [string, ...string[]])
    .optional(),
});

export type createPositionDto = z.input<typeof createPositionDto>;
