import { Schema, model } from 'mongoose';

import { BaseModel, baseModelSchemaDefinition } from '@/base/common/models';

export interface UsageTracking extends BaseModel {
  user: string;
  computer: string;
  startTimeStamp: Date;
  endTimeStamp: Date;
}

const usageTrackingSchema = new Schema<UsageTracking>({
  ...baseModelSchemaDefinition,
  user: { type: String, ref: 'User', required: true },
  computer: { type: String, ref: 'Computer', required: true },
  startTimeStamp: { type: Date, required: true },
  endTimeStamp: { type: Date, required: true },
});

export const UsageTrackingModel = model<UsageTracking>(
  'Usage_Trackings',
  usageTrackingSchema,
);
