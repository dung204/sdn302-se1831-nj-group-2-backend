import {
  Logger as WinstonLogger,
  addColors,
  createLogger,
  format,
  transports,
} from 'winston';

import {
  logLevelColor,
  logLevelNumber,
  logLevelString,
} from '@/base/common/enums';

export class Logger {
  private readonly instance: WinstonLogger;
  private readonly loggerName: string;

  constructor(name: string) {
    addColors(logLevelColor);

    const loggerFormat = format.combine(
      format.colorize({
        all: true,
      }),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(
        ({ level, message, timestamp, loggerName }) =>
          `[${timestamp}] [${loggerName}] [${level}]: ${message}`,
      ),
    );

    this.loggerName = name;
    this.instance = createLogger({
      format: loggerFormat,
      level: logLevelString.INFO,
      levels: logLevelNumber,
      transports: [new transports.Console()],
    });
  }

  public trace(msg: unknown) {
    this.instance.log(logLevelString.TRACE, this.stringify(msg), {
      loggerName: this.loggerName,
    });
  }

  public debug(msg: unknown) {
    this.instance.log(logLevelString.DEBUG, this.stringify(msg), {
      loggerName: this.loggerName,
    });
  }

  public info(msg: unknown) {
    this.instance.log(logLevelString.INFO, this.stringify(msg), {
      loggerName: this.loggerName,
    });
  }

  public warn(msg: unknown) {
    this.instance.log(logLevelString.WARN, this.stringify(msg), {
      loggerName: this.loggerName,
    });
  }

  public error(msg: unknown) {
    this.instance.log(logLevelString.ERROR, this.stringify(msg), {
      loggerName: this.loggerName,
    });
  }

  public fatal(msg: unknown) {
    this.instance.log(logLevelString.FATAL, this.stringify(msg), {
      loggerName: this.loggerName,
    });
    process.exit(1);
  }

  private stringify(value: unknown): string {
    if (value instanceof Error) {
      return `${value.stack}`;
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return `${value}`;
  }
}
