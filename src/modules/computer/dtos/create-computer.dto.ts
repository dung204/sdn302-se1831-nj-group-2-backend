import { z } from 'zod';

import { DeviceStatus } from '@/modules/computer/enums';

export const createComputerDto = z.object({
  name: z.string(),
  position: z.string(),
  status: z.enum([
    DeviceStatus.NORMAL,
    DeviceStatus.MAINTENANCE,
    DeviceStatus.ERROR,
  ]),
  pricePerHour: z.coerce.number(),
  cpu: z.string(),
  ram: z.string(),
  storage: z.string(),
  provider: z.string(),
  peripherals: z.array(
    z.object({
      id: z.string(),
      status: z.enum([
        DeviceStatus.ERROR,
        DeviceStatus.MAINTENANCE,
        DeviceStatus.NORMAL,
      ]),
    }),
  ),
});

export type CreateComputerDto = z.input<typeof createComputerDto>;
