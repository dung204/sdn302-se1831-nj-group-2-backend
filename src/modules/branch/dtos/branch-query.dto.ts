import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';

export const branchQueryDto = commonQueryDto
  .extend({
    name: z.string().optional(),
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'name',
      'createTimestamp',
      'deleteTimestamp',
    ]),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type BranchQueryDto = z.infer<typeof branchQueryDto>;
