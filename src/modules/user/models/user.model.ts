import { randomUUID } from 'crypto';
import { Schema, model } from 'mongoose';

import { Role } from '@/modules/user/enums/role.enum';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  address: string | null;
  role: Role;
  createTimestamp: Date;
  deleteTimestamp: Date | null;
}

const userSchema = new Schema<User>({
  _id: { type: String, default: randomUUID, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, default: null, required: false },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER,
    required: false,
  },
  createTimestamp: { type: Date, default: Date.now, required: true },
  deleteTimestamp: { type: Date, default: null, required: false },
});

export const UserModel = model<User>('User', userSchema);
