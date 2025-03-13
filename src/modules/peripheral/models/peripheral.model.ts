import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface Peripheral extends BaseModel {
  name: string;
  brand: string;
  importPrice: number;
  provider: string;
}

const peripheralInfoSchema = new Schema<Peripheral>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  brand: { type: String, required: true },
  importPrice: { type: Number, required: true },
  provider: { type: String, ref: 'Provider', required: true },
});

export const PeripheralModel = model<Peripheral>(
  'PeripheralInfo',
  peripheralInfoSchema,
);
