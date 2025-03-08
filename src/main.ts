import cors from 'cors';
import express from 'express';

import { HttpExceptionHandler } from '@/base/common/handlers';
import { Logger, envVariables } from '@/base/common/utils';
import { database } from '@/base/database';
import { redis } from '@/base/redis';
import { appRouter } from '@/base/router';
import { configSwagger } from '@/base/swagger';
import { userService } from '@/modules/user/services';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = express();

  // Try to connect to mongodb & redis simultaneously
  await Promise.all([database.connect(), redis.connect()]);

  await userService.insertInitialOwner();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1', appRouter);
  configSwagger(app);

  app.use(HttpExceptionHandler);

  app.listen(envVariables.APP_PORT, () => {
    logger.info(`Server is listening at port ${envVariables.APP_PORT}`);
    logger.info(`Current environment: ${envVariables.NODE_ENV}`);
  });
}

bootstrap();
