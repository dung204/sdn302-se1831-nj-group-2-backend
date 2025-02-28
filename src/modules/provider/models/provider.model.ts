import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface Provider extends BaseModel {
  name?: string;
  description?: string;
}

const providerSchema = new Schema<Provider>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  ...baseModelSchemaDefinition,
});

export const ProviderModel = model<Provider>('Provider', providerSchema);
