import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';
import { PositionStatus } from '@/modules/position/enums';

export const positionQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'name',
      'status',
      'createTimestamp',
      'deleteTimestamp',
    ]),
    name: z.string().optional(),
    status: z
      .union([
        z
          .enum([PositionStatus.AVAILABLE, PositionStatus.IN_USE])
          .transform((value) => [value]),
        z.array(z.enum([PositionStatus.AVAILABLE, PositionStatus.IN_USE])),
      ])
      .optional(),
    branch: z.string().optional(),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type PositionQueryDto = z.infer<typeof positionQueryDto>;
