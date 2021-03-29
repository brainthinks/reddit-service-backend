import winston from 'winston';

/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('../package.json');
/* eslint-enable @typescript-eslint/no-var-requires */

export default function createLogger (): winston.Logger {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: packageJson.name },
    transports: [],
  });

  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));

  return logger;
}
