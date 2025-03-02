import { z } from 'zod';

import { createServiceTable } from './create-service_table.dto';

export const updateServiceTableDto = createServiceTable.partial();

export type UpdateServiceTableDto = z.input<typeof updateServiceTableDto>;
