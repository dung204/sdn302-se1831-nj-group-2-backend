import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

import { PositionStatus } from '../enums';

export interface Position extends BaseModel {
  name: string;
  branch: string;
  status: PositionStatus;
}

const positionSchema = new Schema<Position>({
  ...baseModelSchemaDefinition,
  name: {
    type: String,
    required: true,
  },
  branch: {
    // type: Schema.Types.ObjectId,
    // ref: 'Branch',
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(PositionStatus),
    default: PositionStatus.AVAILABLE,
    required: false,
  },
});

export const PositionModel = model<Position>(
  'Position',
  positionSchema,
  'positions',
);
