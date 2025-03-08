// models/computer.model.ts
import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

import { DeviceStatus } from '../enums';

export interface Computer extends BaseModel {
  name: string;
  position: string;
  status: DeviceStatus;
  pricePerHour: number;
  cpu: string;
  ram: string;
  storage: string;
  providerId: string;
  peripherals: { id: string; status: string }[];
}

const ComputerSchema = new Schema<Computer>({
  ...baseModelSchemaDefinition,
  name: { type: String, required: true },
  // position: { type: String,ref: 'Position', required: true },
  position: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(DeviceStatus),
    default: DeviceStatus.NORMAL,
    required: true,
  },
  pricePerHour: { type: Number, required: true },
  cpu: { type: String, required: true },
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  // providerId: { type: String, ref: 'Provider', required: true },
  providerId: { type: String, required: true },
  // peripherals: [{ id: String, ref:"peripheral-info",status: String }],
  peripherals: [{ id: String, status: String }],
});

export const ComputerModel = model<Computer>('Computer', ComputerSchema);
