import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface ServiceCategory extends BaseModel {
  name: string;
  description: string;
}

const ServiceCategorySchema = new Schema<ServiceCategory>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export const ServiceCategoryModel = model<ServiceCategory>(
  'ServiceCategory',
  ServiceCategorySchema,
  'service_category',
);
