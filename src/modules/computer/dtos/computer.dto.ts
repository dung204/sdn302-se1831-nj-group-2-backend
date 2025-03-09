import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { DeviceStatus } from '@/modules/computer/enums';
import { positionDto } from '@/modules/position/dtos';
import { providerDto } from '@/modules/provider/dtos';

const baseComputerSchema = z.object({
  _id: z.string(),
  name: z.string(),
  positionId: positionDto,
  status: z.enum([
    DeviceStatus.NORMAL,
    DeviceStatus.MAINTENANCE,
    DeviceStatus.ERROR,
  ]),
  pricePerHour: z.number(),
  cpu: z.string(),
  ram: z.string(),
  storage: z.string(),
  providerId: providerDto,
  peripherals: z.array(
    z.object({
      id: z.string(),
      status: z.string(),
    }),
  ),
});

export const computerDto = baseComputerSchema.transform(
  ({ _id, positionId, providerId, ...data }) => ({
    id: _id,
    position: positionId,
    provider: providerId,
    ...data,
  }),
);

export const deletedComputerDto = baseComputerSchema
  .merge(deleteDto)
  .transform(({ _id, positionId, providerId, ...data }) => ({
    id: _id,
    position: positionId,
    provider: providerId,
    ...data,
  }));

export type DeletedComputerDto = z.infer<typeof deletedComputerDto>;

export type ComputerDto = z.infer<typeof computerDto>;
