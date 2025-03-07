import { z } from 'zod';

import { createPositionDto } from './create-position.dto';

export const updatePositionDto = createPositionDto.partial();

export type UpdatePositionDto = z.input<typeof updatePositionDto>;
