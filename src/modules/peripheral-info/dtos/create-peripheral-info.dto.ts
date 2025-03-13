import { z } from 'zod';

export const createPeripheralInfoDto = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  brand: z.string().trim().min(1, 'Brand is required'),
  importPrice: z
    .union([z.string().transform((val) => parseFloat(val)), z.number()])
    .refine((val) => val > 0, 'Import price must be a positive number'),
  provider: z.string().trim().min(1, 'Provider is required'),
});

export type CreatePeripheralInfoDto = z.infer<typeof createPeripheralInfoDto>;
