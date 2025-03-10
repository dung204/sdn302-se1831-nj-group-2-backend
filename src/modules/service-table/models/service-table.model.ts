import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface ServiceTable extends BaseModel {
  name: string;
  description: string;
  price: number;
  categoryId: string;
}

const ServiceTableSchema = new Schema<ServiceTable>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: String, ref: 'ServiceCategory', required: true },
});

export const ServiceTableModel = model<ServiceTable>(
  'ServiceTable',
  ServiceTableSchema,
);
