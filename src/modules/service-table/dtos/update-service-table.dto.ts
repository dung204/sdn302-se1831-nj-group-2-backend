import { z } from 'zod';

import { createServiceTableDto } from './create-service-table.dto';

export const updateServiceTableDto = createServiceTableDto.partial();

export type UpdateServiceTableDto = z.input<typeof updateServiceTableDto>;
