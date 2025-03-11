import { z } from 'zod';

import { PositionStatus } from '@/modules/position/enums';

export const createPositionDto = z.object({
  name: z.string(),
  branch: z.string(),
  status: z.enum([PositionStatus.AVAILABLE, PositionStatus.IN_USE]).optional(),
});

export type CreatePositionDto = z.input<typeof createPositionDto>;
