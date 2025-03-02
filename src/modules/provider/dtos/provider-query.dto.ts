import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';

export const providerQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'name',
      'description',
      'createTimestamp',
      'deleteTimestamp',
    ]),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type ProviderQueryDto = z.infer<typeof providerQueryDto>;
