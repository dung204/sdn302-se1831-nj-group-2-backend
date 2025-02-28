import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';

const baseProviderSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  createTimestamp: z.date(),
});

export const providerDto = baseProviderSchema.transform(({ _id, ...data }) => ({
  id: _id,
  ...data,
}));

export const deletedProviderDto = baseProviderSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type ProviderDto = z.infer<typeof providerDto>;

export type DeletedProviderDto = z.infer<typeof deletedProviderDto>;
