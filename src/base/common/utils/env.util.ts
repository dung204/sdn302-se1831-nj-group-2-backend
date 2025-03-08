import { config } from 'dotenv';
import { existsSync } from 'fs';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

import { Logger } from './logger.util';

const logger = new Logger('EnvUtil');

config({
  path: ['.env.local', '.env'],
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  APP_PORT: z.coerce.number().int().positive(),
  DB_HOST: z.string().nonempty(),
  DB_PORT: z.coerce.number().int().positive(),
  DB_DATABASE_NAME: z.string().nonempty(),
  JWT_ACCESS_SECRET: z.string().nonempty(),
  JWT_REFRESH_SECRET: z.string().nonempty(),
  JWT_ACCESS_EXPIRATION: z.coerce.number().int().positive(),
  JWT_REFRESH_EXPIRATION: z.coerce.number().int().positive(),
  REDIS_HOST: z.string().nonempty(),
  REDIS_PORT: z.coerce.number().int().positive(),
  REDIS_PASSWORD: z.string().nonempty(),
  INITIAL_OWNER_USERNAME: z.string().nonempty(),
  INITIAL_OWNER_PASSWORD: z.string().nonempty(),
});

// eslint-disable-next-line no-process-env
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  const validationError = fromZodError(parseResult.error);
  logger.fatal(validationError);
  process.exit(1);
}

logger.info(
  `Loaded environment variables from: ${existsSync('.env.local') ? '.env.local' : '.env'}`,
);
export const envVariables = parseResult.data;
