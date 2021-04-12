import winston, { Logger } from 'winston';
import util from 'util';

// import { isProduction } from './env';

/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('../package.json');
/* eslint-enable @typescript-eslint/no-var-requires */

// since this is constructed prior to the application config, we must read
// directly from the system env vars because we do not yet have access to
// all application config sources (.env, cli args, etc.)
const isProduction = process.env.NODE_ENV === 'production';

const debugFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format((info) => {
    if (typeof info.message === 'object') {
      info.message = util.inspect(info.message, {
        showHidden: false,
        depth: null,
      });
    }

    return info;
  })(),
  winston.format.align(),
  winston.format.printf((info) => {
    let message = `${info.timestamp} ${info.level}: ${info.message}`;
    if (info.stack) {
      message = `${message} \n STACK: \n ${info.stack}`;
    }

    return message;
  }),
);

export type { Logger };

export default function createLogger (): winston.Logger {
  const logger = winston.createLogger({
    level: isProduction
      ? 'info'
      : 'debug',
    format: isProduction
      ? winston.format.json()
      : debugFormat,
    defaultMeta: { service: packageJson.name },
    transports: [],
  });

  logger.add(new winston.transports.Console());

  return logger;
}
