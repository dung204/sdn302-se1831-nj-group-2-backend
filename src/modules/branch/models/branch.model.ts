import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

// import { Service } from '@/modules/service/models';

export interface Branch extends BaseModel {
  name: string;
  address: string | null;
  adminId: string;
  //   services: Types.ObjectId[] | Service[];
}

const branchSchema = new Schema<Branch>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  address: { type: String, default: null, required: false },
  adminId: { type: String, ref: 'User', required: true },
  //   services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
});

// Add virtual property for populating admin
branchSchema.virtual('admin', {
  ref: 'User',
  localField: 'adminId',
  foreignField: '_id',
  justOne: true,
});

export const BranchModel = model<Branch>('Branch', branchSchema);
