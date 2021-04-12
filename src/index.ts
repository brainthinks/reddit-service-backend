/*
  eslint-disable

  no-console,
  no-process-exit
*/

import 'reflect-metadata';

import createLogger, { Logger } from './logger';
import getConfig from './config';
import getContainer from './inversify.config';
import { TYPES } from './types';
import {
  Server as ServerInterface,
} from './interfaces';

let logger: Logger;

async function main () {
  logger = createLogger();

  const config = getConfig(logger);

  if (config.protocol === 'https') {
    throw new Error('https not yet supported :(');
  }

  const iocContainer = await getContainer(logger, config);

  const server = iocContainer.get<ServerInterface>(TYPES.Server);

  await server.start();
}

main().catch((error) => {
  if (logger === undefined) {
    console.error(error);
    console.error('Fatal error during bootstrap');
    process.exit(1);
  }

  logger.error(error);
  logger.error('Fatal error');
  process.exit(1);
});

// to make typescript happy
export {};
