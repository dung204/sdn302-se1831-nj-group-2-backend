import { randomUUID } from 'crypto';
import { SchemaDefinition, SchemaDefinitionType } from 'mongoose';

export interface BaseModel {
  _id: string;
  createTimestamp: Date;
  deleteTimestamp: Date;
}

export const baseModelSchemaDefinition = {
  _id: { type: String, default: randomUUID, required: true },
  createTimestamp: { type: Date, default: Date.now, required: true },
  deleteTimestamp: { type: Date, default: null, required: false },
} satisfies SchemaDefinition<SchemaDefinitionType<BaseModel>, BaseModel>;
