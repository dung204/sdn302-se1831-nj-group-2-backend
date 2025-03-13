import { z } from 'zod';

import { deleteDto } from '@/base/common/dtos';
import { providerDto } from '@/modules/provider/dtos/provider.dto';

const basePeripheralInfoSchema = z.object({
  _id: z.string(),
  name: z.string(),
  brand: z.string(),
  importPrice: z.number(),
  provider: z.string().or(providerDto),
  createTimestamp: z.date(),
});

export const peripheralInfoDto = basePeripheralInfoSchema.transform(
  ({ _id, ...data }) => ({
    id: _id,
    ...data,
  }),
);

export const deletedPeripheralInfoDto = basePeripheralInfoSchema
  .merge(deleteDto)
  .transform(({ _id, ...data }) => ({
    id: _id,
    ...data,
  }));

export type PeripheralInfoDto = z.infer<typeof peripheralInfoDto>;

export type DeletedPeripheralInfoDto = z.infer<typeof deletedPeripheralInfoDto>;
