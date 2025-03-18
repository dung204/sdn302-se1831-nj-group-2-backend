import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { DeviceStatus } from '@/modules/computer/enums';
import { basePeripheralSchema } from '@/modules/peripheral/dtos';
import { positionDto } from '@/modules/position/dtos';
import { providerDto } from '@/modules/provider/dtos';

const baseComputerSchema = z.object({
  _id: z.string(),
  name: z.string(),
  position: positionDto,
  status: z.nativeEnum(DeviceStatus),
  pricePerHour: z.number(),
  cpu: z.string(),
  ram: z.string(),
  storage: z.string(),
  provider: providerDto,
  peripherals: z.array(
    basePeripheralSchema
      .extend({
        status: z.nativeEnum(DeviceStatus),
      })
      .transform(({ _id, ...data }) => ({
        id: _id,
        ...data,
      })),
  ),
  createTimestamp: z.date(),
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
