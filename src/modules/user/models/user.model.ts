import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';
import { Role } from '@/modules/user/enums/role.enum';

export interface User extends BaseModel {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string | null;
  role: Role;
  citizenNumber: string | null;
  phoneNumber: string | null;
  availableTime: number | null; // in seconds
}

const userSchema = new Schema<User>({
  ...baseModelSchemaDefinition,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, default: null, required: false },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.GUEST,
    required: false,
  },
  citizenNumber: {
    type: String,
    default: null,
    required: false,
  },
  phoneNumber: {
    type: String,
    default: null,
    required: false,
  },
  availableTime: {
    type: Number,
    default: null,
    required: false,
  },
});

export const UserModel = model<User>('Users', userSchema);
