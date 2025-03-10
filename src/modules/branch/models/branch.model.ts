import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface Branch extends BaseModel {
  name: string;
  address: string | null;
  admin: string;
  services: string[];
}

const branchSchema = new Schema<Branch>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  address: { type: String, default: null, required: false },
  admin: { type: String, ref: 'User', required: true },
  services: { type: [String], ref: 'Service', default: [], required: true },
});

branchSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.populate(['admin', 'services']);
  next();
});

export const BranchModel = model<Branch>('Branch', branchSchema);
