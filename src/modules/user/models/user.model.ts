import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';
import { Role } from '@/modules/user/enums/role.enum';

export interface User extends BaseModel {
  firstName: string;
  lastName: string;
  address: string | null;
  role: Role;
}

const userSchema = new Schema<User>({
  ...baseModelSchemaDefinition,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, default: null, required: false },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER,
    required: false,
  },
});

export const UserModel = model<User>('User', userSchema);
