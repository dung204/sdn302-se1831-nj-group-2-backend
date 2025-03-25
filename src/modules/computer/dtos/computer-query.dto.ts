import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';
import { DeviceStatus } from '@/modules/computer/enums';

export const computerQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'name',
      'status',
      'createTimestamp',
      'deleteTimestamp',
    ]),
    name: z.string().optional(),
    branch: z.string().optional(),
    status: z
      .union([
        z
          .enum([
            DeviceStatus.NORMAL,
            DeviceStatus.MAINTENANCE,
            DeviceStatus.ERROR,
          ])
          .transform((value) => value.split(',')),
        z.array(
          z.enum([
            DeviceStatus.NORMAL,
            DeviceStatus.MAINTENANCE,
            DeviceStatus.ERROR,
          ]),
        ),
      ])
      .optional(),
    provider: z.string().optional(),
    fromPricePerHour: z.coerce.number().optional(),
    toPricePerHour: z.coerce.number().optional(),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type ComputerQueryDto = z.infer<typeof computerQueryDto>;
