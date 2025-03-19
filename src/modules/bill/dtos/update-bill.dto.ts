import { z } from 'zod';

import { createBillDto } from '@/modules/bill/dtos/create-bill.dto';

export const updateBillDto = createBillDto.partial();

export type UpdateBillDto = z.input<typeof updateBillDto>;
