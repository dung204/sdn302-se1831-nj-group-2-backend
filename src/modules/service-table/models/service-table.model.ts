import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface ServiceTable extends BaseModel {
  name: string;
  description: string;
  price: number;
  category: string;
  branches: string[];
}

const serviceTableSchema = new Schema<ServiceTable>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, ref: 'ServiceCategory', required: true },
  branches: { type: [String], ref: 'Branch', default: [], required: true },
});

serviceTableSchema.pre(
  ['find', 'findOne', 'findOneAndUpdate'],
  function (next) {
    this.populate(['category']);
    next();
  },
);

export const ServiceTableModel = model<ServiceTable>(
  'Service',
  serviceTableSchema,
  'services',
);
