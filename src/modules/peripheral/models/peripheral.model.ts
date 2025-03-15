import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';
import { PeripheralType } from '@/modules/peripheral/enums';

export interface Peripheral extends BaseModel {
  name: string;
  brand: string;
  type: PeripheralType;
  importPrice: number;
  provider: string;
}

const peripheralSchema = new Schema<Peripheral>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, enum: PeripheralType, required: true },
  importPrice: { type: Number, required: true },
  provider: { type: String, ref: 'Provider', required: true },
});

peripheralSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.populate(['provider']);
  next();
});

export const PeripheralModel = model<Peripheral>(
  'Peripheral',
  peripheralSchema,
);
