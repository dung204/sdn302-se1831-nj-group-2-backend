import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';

export const userQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'firstName',
      'lastName',
      'createTimestamp',
      'deleteTimestamp',
    ]),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type UserQueryDto = z.infer<typeof userQueryDto>;
