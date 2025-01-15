import mongoose from 'mongoose';

import { Logger, envVariables } from '@/base/common/utils';

class Database {
  private readonly logger = new Logger(Database.name);

  constructor() {
    mongoose.connection.on('connecting', () =>
      this.logger.info('Connecting to database...'),
    );
    mongoose.connection.on('connected', () =>
      this.logger.info('Connected to database successfully!'),
    );
    mongoose.connection.on('reconnected', () =>
      this.logger.info('Connected to database successfully!'),
    );
  }

  async connect() {
    try {
      await mongoose.connect(
        `mongodb://${envVariables.DB_HOST}:${envVariables.DB_PORT}/${envVariables.DB_DATABASE_NAME}`,
      );
    } catch (err) {
      this.logger.fatal(err);
    }
  }
}

export const database = new Database();
