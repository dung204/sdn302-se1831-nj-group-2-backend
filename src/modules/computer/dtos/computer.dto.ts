import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { DeviceStatus } from '@/modules/computer/enums';
import { peripheralDto } from '@/modules/peripheral/dtos';
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
    z.object({
      _id: peripheralDto,
      status: z.nativeEnum(DeviceStatus),
    }),
  ),
  createTimestamp: z.date(),
});

export const computerDto = baseComputerSchema.transform(
  ({ _id, peripherals, ...data }) => ({
    id: _id,
    peripherals: peripherals.map(({ _id, status }) => ({
      ..._id,
      status,
    })),
    ...data,
  }),
);

export const deletedComputerDto = baseComputerSchema
  .merge(deleteDto)
  .transform(({ _id, peripherals, ...data }) => ({
    id: _id,
    peripherals: peripherals.map(({ _id, status }) => ({
      ..._id,
      status,
    })),
    ...data,
  }));

export type DeletedComputerDto = z.infer<typeof deletedComputerDto>;

export type ComputerDto = z.infer<typeof computerDto>;
