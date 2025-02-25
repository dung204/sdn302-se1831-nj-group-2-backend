import { Express } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

import { envVariables } from '@/base/common/utils';

interface SwaggerDocument {
  servers?: {
    url: string;
    description?: string;
  }[];
  [key: string]: unknown;
}

export function configSwagger(app: Express) {
  const filePath = './docs/openapi.yml';
  const swaggerFile = readFileSync(filePath, 'utf8');
  const swaggerDocument = YAML.parse(swaggerFile) as SwaggerDocument;

  if (envVariables.NODE_ENV === 'development') {
    if (!swaggerDocument.servers || swaggerDocument.servers.length === 0) {
      swaggerDocument.servers = [
        {
          url: `http://localhost:${envVariables.APP_PORT}`,
          description: 'Development server',
        },
      ];
    } else {
      swaggerDocument.servers?.map((server) => {
        if (server.url.startsWith('http://localhost')) {
          server.url = `http://localhost:${envVariables.APP_PORT}`;
        }
        return server;
      });
    }

    writeFileSync(
      filePath,
      YAML.stringify(swaggerDocument, { singleQuote: true }),
    );
  }

  if (envVariables.NODE_ENV === 'production') {
    delete swaggerDocument.servers;
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
