import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface Branch extends BaseModel {
  name: string;
  address: string | null;
}

const branchSchema = new Schema<Branch>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  address: { type: String, default: null, required: false },
});

export const BranchModel = model<Branch>('Branch', branchSchema);
