/*
  eslint-disable

  no-console,
  no-process-exit
*/

import createLogger from './logger';
import Server from './server';
import getConfig from './config';
import { Logger } from './logger';

let logger: Logger;

async function main () {
  logger = createLogger();

  const config = getConfig(logger);

  if (config.protocol === 'https') {
    throw new Error('https not yet supported :(');
  }

  const server = Server.asSingleton(logger, config);

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
