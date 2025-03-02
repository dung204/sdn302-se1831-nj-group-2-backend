import { Express, NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

import { envVariables } from '@/base/common/utils';

const filePath = './docs/openapi.yml';

export function configSwagger(app: Express) {
  let swaggerDocument = readSwaggerFile();

  app.use(
    '/api-docs',
    swaggerUi.serve,
    (req: Request, res: Response, next: NextFunction) => {
      if (envVariables.NODE_ENV === 'development') {
        swaggerDocument = readSwaggerFile();
      }

      return swaggerUi.setup(swaggerDocument)(req, res, next);
    },
  );
}

function readSwaggerFile() {
  const swaggerFile = readFileSync(filePath, 'utf8');
  const swaggerDocument = YAML.parse(swaggerFile);
  delete swaggerDocument.servers;
  return swaggerDocument;
}
