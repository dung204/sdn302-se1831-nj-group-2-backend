export const logLevelNumber = {
  FATAL: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5,
} as const;

export const logLevelString = {
  FATAL: 'FATAL',
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  TRACE: 'TRACE',
} as const;

export const logLevelColor = {
  FATAL: 'bold red',
  ERROR: 'red',
  WARN: 'yellow',
  INFO: 'blue',
  DEBUG: 'green',
  TRACE: 'grey',
} as const;
