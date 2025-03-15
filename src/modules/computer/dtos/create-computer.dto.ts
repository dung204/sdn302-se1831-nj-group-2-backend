import { z } from 'zod';

import { DeviceStatus } from '@/modules/computer/enums';

export const createComputerDto = z.object({
  name: z.string(),
  position: z.string(),
  status: z.nativeEnum(DeviceStatus),
  pricePerHour: z.coerce.number(),
  cpu: z.string(),
  ram: z.string(),
  storage: z.string(),
  provider: z.string(),
  peripherals: z
    .union([
      z.string().transform((value) => value.split(',')),
      z.array(z.string()),
    ])
    .optional()
    .default([]),
});

export type CreateComputerDto = z.infer<typeof createComputerDto>;
