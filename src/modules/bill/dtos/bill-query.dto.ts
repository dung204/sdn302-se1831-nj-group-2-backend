import { z } from 'zod';

import { commonQueryDto } from '@/base/common/dtos';
import { SortingUtils } from '@/base/common/utils';
import { ServiceStatus } from '@/modules/bill/enums';

export const billQueryDto = commonQueryDto
  .extend({
    sorting: SortingUtils.getSortingValueSchema([
      'id',
      'totalPrice',
      'startTimestamp',
      'endTimestamp',
      'createTimestamp',
      'deleteTimestamp',
    ]),
    user: z.string().optional(),
    computer: z.string().optional(),
    minTotalPrice: z.coerce.number().optional(),
    maxTotalPrice: z.coerce.number().optional(),
    fromStartTimestamp: z.coerce.date().optional(),
    toStartTimestamp: z.coerce.date().optional(),
    fromEndTimestamp: z.coerce.date().optional(),
    toEndTimestamp: z.coerce.date().optional(),
    fromMaxHoldingTimestamp: z.coerce.date().optional(),
    toMaxHoldingTimestamp: z.coerce.date().optional(),
    fromMaxEndTimestamp: z.coerce.date().optional(),
    toMaxEndTimestamp: z.coerce.date().optional(),
    serviceStatus: z
      .union([
        z
          .enum([
            ServiceStatus.PENDING,
            ServiceStatus.IN_PROGRESS,
            ServiceStatus.COMPLETED,
            ServiceStatus.CANCELLED,
          ])
          .transform((value) => [value]),
        z.array(
          z.enum([
            ServiceStatus.PENDING,
            ServiceStatus.IN_PROGRESS,
            ServiceStatus.COMPLETED,
            ServiceStatus.CANCELLED,
          ]),
        ),
      ])
      .optional(),
  })
  .transform((payload) => SortingUtils.transformSorting(payload));

export type BillQueryDto = z.infer<typeof billQueryDto>;
