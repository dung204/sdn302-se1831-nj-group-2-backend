import { Schema, Types, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

// import { Service } from '@/modules/service/models';

export interface Branch extends BaseModel {
  name: string;
  address: string | null;
  admin: string | Types.ObjectId;
  //   services: Types.ObjectId[] | Service[];
}

const branchSchema = new Schema<Branch>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  address: { type: String, default: null, required: false },
  admin: { type: String, ref: 'User', required: true },
  //   services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
});

export const BranchModel = model<Branch>('Branch', branchSchema);
