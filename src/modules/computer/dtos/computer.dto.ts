import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';

import { DeviceStatus } from '../enums';

const baseComputerSchema = z.object({
  _id: z.string(),
  name: z.string(),
  position: z.string(),
  status: z
    .enum([DeviceStatus.NORMAL, DeviceStatus.MAINTENANCE, DeviceStatus.ERROR])
    .optional(),
  pricePerHour: z.number(),
  cpu: z.string(),
  ram: z.string(),
  storage: z.string(),
  providerId: z.string(),
  peripherals: z.array(
    z.object({
      id: z.string(),
      status: z.string(),
    }),
  ),
});

export const computerDto = baseComputerSchema.transform(({ _id, ...data }) => ({
  id: _id,
  ...data,
}));

export const deletedComputerDto = baseComputerSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type DeletedComputerDto = z.infer<typeof deletedComputerDto>;

export type ComputerDto = z.infer<typeof computerDto>;
