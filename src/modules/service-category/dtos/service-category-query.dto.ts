import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';

export const serviceCategoryQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'name',
      'createTimestamp',
      'deleteTimestamp',
    ]),
    name: z.string().optional(),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type ServiceCategoryQueryDto = z.infer<typeof serviceCategoryQueryDto>;
