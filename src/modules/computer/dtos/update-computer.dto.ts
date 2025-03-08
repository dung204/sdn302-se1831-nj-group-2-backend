import { z } from 'zod';

import { createComputerDto } from './create-computer.dto';

export const updateComputerDto = createComputerDto.partial();

export type UpdateComputerDto = z.input<typeof updateComputerDto>;
