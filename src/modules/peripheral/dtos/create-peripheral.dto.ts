import { z } from 'zod';

import { PeripheralType } from '@/modules/peripheral/enums';

export const createPeripheralDto = z.object({
  name: z.string().nonempty(),
  brand: z.string().nonempty(),
  type: z.nativeEnum(PeripheralType),
  importPrice: z.coerce.number().positive(),
  provider: z.string().nonempty(),
});

export type CreatePeripheralDto = z.infer<typeof createPeripheralDto>;
