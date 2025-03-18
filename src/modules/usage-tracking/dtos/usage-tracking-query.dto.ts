import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';

export const usageTrackingQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'user',
      'computer',
      'startTimeStamp',
      'endTimeStamp',
      'createTimestamp',
      'deleteTimestamp',
    ]),
    // filter => user, computer, startTimeStamp, endTimeStamp => optionals
    user: z.string().optional(),
    computer: z.string().optional(),
    startTimeStamp: z.coerce.date().optional(),
    endTimeStamp: z.coerce.date().optional(),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type UsageTrackingQueryDto = z.infer<typeof usageTrackingQueryDto>;
