import { z } from 'zod';

import { createServiceCategoryDto } from './create-service-category.dto';

export const updateServiceCategoryDto = createServiceCategoryDto.partial();

export type UpdateServiceCategoryDto = z.input<typeof updateServiceCategoryDto>;
