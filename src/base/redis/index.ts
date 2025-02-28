import { Redis as RedisClient } from 'ioredis';

import { Logger, envVariables } from '@/base/common/utils';

class Redis {
  private logger: Logger = new Logger(Redis.name);
  private instance: RedisClient;
  private appCrashTimeoutId!: NodeJS.Timeout;
  private readonly TIMEOUT = 10000;

  constructor() {
    this.instance = new RedisClient({
      host: envVariables.REDIS_HOST,
      port: envVariables.REDIS_PORT,
      password: envVariables.REDIS_PASSWORD,
      lazyConnect: true,
    });

    this.instance.once('connecting', () => {
      this.logger.info('Connecting to redis...');
    });

    this.instance.on('connect', () => {
      this.logger.info('Connected to redis successfully!');
      if (this.appCrashTimeoutId) {
        clearTimeout(this.appCrashTimeoutId);
      }
    });

    this.instance.on('reconnecting', () => {
      this.logger.info('Reconnecting to redis...');
    });

    this.instance.on('error', (err) => {
      this.logger.error(err);
    });
  }

  async connect() {
    try {
      await this.instance.connect();
    } catch (err) {
      this.logger.error(err);
      this.appCrashTimeoutId = setTimeout(() => {
        this.logger.fatal(err);
      }, this.TIMEOUT);
    }
  }

  public getInstance() {
    return this.instance;
  }
}

export const redis = new Redis();
