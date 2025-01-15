import { config } from 'dotenv';
import { z } from 'zod';

config({
  path: ['.env.local', '.env'],
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  APP_PORT: z.coerce.number().int().positive(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().int().positive(),
  DB_DATABASE_NAME: z.string(),
});

// eslint-disable-next-line no-process-env
export const envVariables = envSchema.parse(process.env);
