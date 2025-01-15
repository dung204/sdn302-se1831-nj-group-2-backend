import express from 'express';

import { HttpExceptionHandler } from '@/base/common/handlers';
import { Logger, envVariables } from '@/base/common/utils';
import { database } from '@/base/database';
import { appRouter } from '@/base/router';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = express();

  await database.connect();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1', appRouter);

  app.use(HttpExceptionHandler);

  app.listen(envVariables.APP_PORT, () => {
    logger.info(`Server is listening at port ${envVariables.APP_PORT}`);
    logger.info(`Current environment: ${envVariables.NODE_ENV}`);
  });
}

bootstrap();
