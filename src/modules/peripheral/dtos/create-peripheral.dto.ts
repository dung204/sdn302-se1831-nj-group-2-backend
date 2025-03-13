import { z } from 'zod';

export const createPeripheralDto = z.object({
  name: z.string().nonempty(),
  brand: z.string().nonempty(),
  importPrice: z.coerce.number().positive(),
  provider: z.string().nonempty(),
});

export type CreatePeripheralDto = z.infer<typeof createPeripheralDto>;
