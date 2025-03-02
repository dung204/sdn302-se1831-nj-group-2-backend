import { z } from 'zod';

import { createServiceCategory } from './create-serviceCategory.dto';

export const updateServiceCategoryDtoDto = createServiceCategory.partial();

export type UpdateServiceCategoryDto = z.input<
  typeof updateServiceCategoryDtoDto
>;
