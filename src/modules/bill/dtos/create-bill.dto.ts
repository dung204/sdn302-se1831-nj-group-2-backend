import { z } from 'zod';

import { ServiceStatus } from '@/modules/bill/enums';

const createServiceSchema = z.object({
  _id: z.string(),
  quantity: z.number(),
  status: z
    .enum([
      ServiceStatus.PENDING,
      ServiceStatus.COMPLETED,
      ServiceStatus.CANCELLED,
      ServiceStatus.PENDING,
    ])
    .optional(),
});

export const createBillDto = z.object({
  user: z.string(),
  computer: z.string(),
  services: z.array(createServiceSchema).optional(),
  startTimestamp: z.date().optional().nullable(),
  endTimestamp: z.date().optional().nullable(),
  maxEndTimestamp: z.date().optional().nullable(),
  maxHoldingTimestamp: z.date().optional(),
});

export type CreateBillDto = z.input<typeof createBillDto>;
