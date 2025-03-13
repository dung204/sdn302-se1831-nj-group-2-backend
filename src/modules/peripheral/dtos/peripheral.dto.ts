import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { providerDto } from '@/modules/provider/dtos/provider.dto';

const basePeripheralSchema = z.object({
  _id: z.string(),
  name: z.string(),
  brand: z.string(),
  importPrice: z.number(),
  provider: z.string().or(providerDto),
  createTimestamp: z.date(),
});

export const peripheralDto = basePeripheralSchema.transform(
  ({ _id, ...data }) => ({
    id: _id,
    ...data,
  }),
);

export const deletedPeripheralDto = basePeripheralSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type PeripheralDto = z.infer<typeof peripheralDto>;

export type DeletedPeripheralDto = z.infer<typeof deletedPeripheralDto>;
