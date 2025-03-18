import { z } from 'zod';

import { createPeripheralDto } from './create-peripheral.dto';

export const updatePeripheralDto = createPeripheralDto.partial();

export type UpdatePeripheralDto = z.infer<typeof updatePeripheralDto>;
