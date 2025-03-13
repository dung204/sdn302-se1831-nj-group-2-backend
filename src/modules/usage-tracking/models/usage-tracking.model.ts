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

usageTrackingSchema.pre(
  ['find', 'findOne', 'findOneAndUpdate'],
  function (next) {
    this.populate(['user', 'computer']);
    next();
  },
);

export const UsageTrackingModel = model<UsageTracking>(
  'UsageTracking',
  usageTrackingSchema,
  'usage_tracking',
);
