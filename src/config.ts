import path from 'path';

import dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { Logger } from './logger';

enum Protocol {
  https = 'https',
  http = 'http',
}

interface Argv {
  [x: string]: unknown,
  NODE_ENV: string,
  ENABLE_SSL: boolean,
  HOST: string,
  PORT: number,
}

export interface Config {
  isProductionMode: boolean,
  protocol: Protocol,
  host: string,
  port: number,
}

function getStringValue (value: any): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined) {
    return '';
  }

  if (!value.toString) {
    return '';
  }

  return value.toString();
}

function getRawConfig (logger: Logger): any {
  let runtimeConfig = dotenv.config({
    path: path.join(__dirname, '..', '.env'),
    debug: true,
  }).parsed;

  if (!runtimeConfig) {
    logger.info('No `.env` file was found');
    runtimeConfig = {};
  }

  // NOTE: if we ever start expecting anything more complicated than strings
  // or numbers, we may have to add rules/options to this parser
  //
  // disable help and version here to prevent yargs from processing those args,
  // which will show "empty" help usage info
  const cliArgs = yargs(hideBin(process.argv))
    .help(false)
    .version(false)
    .argv;

  return {
    ...process.env,
    ...runtimeConfig,
    // @todo - `_` and `$0` are captured here...
    ...cliArgs,
  };
}

export default function getConfig (logger: Logger): Config {
  const rawConfig = getRawConfig(logger);

  const envAsArgs: string[] = [];

  for (const [
    key,
    value,
  ] of Object.entries(rawConfig)) {
    envAsArgs.push(`--${key}`, getStringValue(value));
  }

  // Note that `process.env` is not used here
  /* eslint-disable-next-line */
  // @ts-ignore
  const argv = yargs()
    .usage('')
    .usage('Usage: $0 [options]')
    .usage('')
    .usage('Note that all options may be defined as env vars.')
    .option('NODE_ENV', {
      type: 'string',
      description: 'node environment',
      nargs: 1,
      demandOption: true,
    })
    .option('ENABLE_SSL', {
      type: 'boolean',
      description: 'serve the application over https',
      choices: [
        true,
        false,
      ],
      coerce: (arg: any) => arg === '1',
      nargs: 1,
      demandOption: true,
    })
    .option('HOST', {
      type: 'string',
      description: 'host name where the application will be served',
      nargs: 1,
      demandOption: true,
    })
    .option('PORT', {
      type: 'number',
      description: 'port where the application will be served',
      nargs: 1,
      demandOption: true,
    })
    .epilogue('by Brian Andress')
    .parse(envAsArgs) as Argv;

  const config: Config = {
    isProductionMode: argv.NODE_ENV === 'production',
    protocol: argv.ENABLE_SSL
      ? Protocol.https
      : Protocol.http,
    host: argv.HOST,
    port: argv.PORT,
  };

  logger.debug([
    'Runtime Config: ',
    config,
  ]);

  return config;
}
