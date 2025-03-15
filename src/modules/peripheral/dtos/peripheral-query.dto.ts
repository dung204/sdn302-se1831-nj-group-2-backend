import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';

export const peripheralQueryDto = commonQueryDto
  .extend({
    name: z.string().optional(),
    brand: z.string().optional(),
    provider: z.string().optional(),
    type: z
      .union([
        z.string().transform((value) => value.split(',')),
        z.array(z.string()),
      ])
      .optional(),
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'name',
      'brand',
      'importPrice',
      'provider',
      'createTimestamp',
      'deleteTimestamp',
    ]),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type PeripheralQueryDto = z.infer<typeof peripheralQueryDto>;
