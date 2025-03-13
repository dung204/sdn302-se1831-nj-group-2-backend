import { z } from 'zod';

export const updatePeripheralInfoDto = z.object({
  name: z.string().trim().min(1, 'Name is required').optional(),
  brand: z.string().trim().min(1, 'Brand is required').optional(),
  importPrice: z
    .number()
    .positive('Import price must be a positive number')
    .optional(),
  provider: z.string().trim().min(1, 'Provider is required').optional(),
});

export type UpdatePeripheralInfoDto = z.infer<typeof updatePeripheralInfoDto>;
