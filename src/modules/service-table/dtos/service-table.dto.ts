import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { serviceCategoryDto } from '@/modules/service-category/dtos';

const baseServiceTableSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.coerce.number(),
  categoryId: serviceCategoryDto,
  description: z.string(),
  createTimestamp: z.date(),
});

export const serviceTableDto = baseServiceTableSchema.transform(
  ({ _id, categoryId, ...data }) => ({
    id: _id,
    category: categoryId,
    ...data,
  }),
);

export const deletedServiceTableDto = baseServiceTableSchema
  .merge(deleteDto)
  .transform(({ _id, categoryId, ...data }) => ({
    id: _id,
    category: categoryId,
    ...data,
  }));

export type DeletedServiceTableDto = z.infer<typeof deletedServiceTableDto>;

export type ServiceTableDto = z.infer<typeof serviceTableDto>;
