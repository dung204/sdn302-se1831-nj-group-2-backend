import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';
import { DeviceStatus } from '@/modules/computer/enums';

export interface Computer extends BaseModel {
  name: string;
  positionId: string;
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
  positionId: { type: String, ref: 'Position', required: true }, // Tham chiếu Position
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
  providerId: { type: String, ref: 'Provider', required: true }, // Tham chiếu Provider
  peripherals: [{ id: String, status: String }],
});

export const ComputerModel = model<Computer>('Computer', ComputerSchema);
