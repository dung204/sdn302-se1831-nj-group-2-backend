import { z } from 'zod';

import { DeviceStatus } from '../enums';

export const createComputerDto = z.object({
  name: z.string(),
  positionId: z.string(),
  status: z.enum([
    DeviceStatus.NORMAL,
    DeviceStatus.MAINTENANCE,
    DeviceStatus.ERROR,
  ]),
  pricePerHour: z.coerce.number(),
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

export type CreateComputerDto = z.input<typeof createComputerDto>;
