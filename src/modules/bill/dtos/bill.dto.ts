import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { ServiceStatus } from '@/modules/bill/enums';
import { userDto } from '@/modules/user/dtos';

// Service with status schema for the bill
const serviceWithStatusSchema = z.object({
  _id: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  status: z.enum([
    ServiceStatus.PENDING,
    ServiceStatus.COMPLETED,
    ServiceStatus.CANCELLED,
  ]),
});

// Computer schema within a bill
const computerSchema = z.object({
  _id: z.string(),
  name: z.string(),
  pricePerHour: z.number(),
  holdingFee: z.number(),
});

export const baseBillSchema = z.object({
  _id: z.string(),
  user: userDto,
  computer: computerSchema,
  services: z.array(serviceWithStatusSchema),
  startTimestamp: z.date().nullable(),
  endTimestamp: z.date().nullable(),
  maxEndTimestamp: z.date().nullable(),
  maxHoldingTimestamp: z.date(),
  totalPrice: z.number(),
  createTimestamp: z.date(),
});

export const billDto = baseBillSchema.transform(({ _id, ...data }) => ({
  id: _id,
  ...data,
}));

export const deletedBillDto = baseBillSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type BillDto = z.infer<typeof billDto>;
export type DeletedBillDto = z.infer<typeof deletedBillDto>;
