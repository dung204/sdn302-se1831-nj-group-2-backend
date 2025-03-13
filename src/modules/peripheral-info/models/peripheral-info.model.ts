import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface PeripheralInfo extends BaseModel {
  name: string;
  brand: string;
  importPrice: number;
  provider: string;
}

const peripheralInfoSchema = new Schema<PeripheralInfo>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  brand: { type: String, required: true },
  importPrice: { type: Number, required: true },
  provider: { type: String, required: true },
});

// // Add virtual property for populating provider if needed
// peripheralInfoSchema.virtual('providerDetails', {
//   ref: 'Provider',
//   localField: 'provider',
//   foreignField: '_id',
//   justOne: true,
// });

export const PeripheralInfoModel = model<PeripheralInfo>(
  'PeripheralInfo',
  peripheralInfoSchema,
);
