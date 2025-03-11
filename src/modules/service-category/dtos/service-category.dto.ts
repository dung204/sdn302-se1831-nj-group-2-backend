import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';

const baseServiceCategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  createTimestamp: z.date(),
});

export const serviceCategoryDto = baseServiceCategorySchema.transform(
  ({ _id, ...data }) => ({
    id: _id,
    ...data,
  }),
);

export const deletedServiceCategoryDto = baseServiceCategorySchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type DeletedServiceCategoryDto = z.infer<
  typeof deletedServiceCategoryDto
>;

export type ServiceCategoryDto = z.infer<typeof serviceCategoryDto>;
