import { z } from 'zod';

import { PositionStatus } from '@/modules/position/enums';

export const createPositionDto = z.object({
  name: z.string(),
  branch: z.string(),
  status: z
    .enum(Object.values(PositionStatus) as [string, ...string[]])
    .optional(),
});

export type CreatePositionDto = z.input<typeof createPositionDto>;
