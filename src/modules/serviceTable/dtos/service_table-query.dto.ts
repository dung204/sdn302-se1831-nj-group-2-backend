import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';

export const serviceTableQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'name',
      'description',
      'price',
      'category',
      'createTimestamp',
      'deleteTimestamp',
    ]),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type ServiceTableQueryDto = z.infer<typeof serviceTableQueryDto>;
