// node imports
import http from 'http';
// 3rd party imports
import express from 'express';
import { createTerminus } from '@godaddy/terminus';
// local imports
import createLogger from './logger';
import {
  isProductionMode,
  protocol,
  hostname,
  port,
} from './env';

const logger = createLogger();
const app = express();
const server = http.createServer(app);

async function onSignal () {
  logger.info('server is starting cleanup');
  return Promise.all([
    () => server.close(),
  ]);
}

async function onShutdown () {
  logger.info('cleanup finished, server is shutting down');
}

async function healthCheck () {
  logger.info('healthcheck');
  return { ok: true };
}

createTerminus(server, {
  signals: [
    'SIGTERM',
    'SIGINT',
    'SIGHUP',
  ],
  healthChecks: {
    '/healthcheck': healthCheck,
    __unsafeExposeStackTraces: !isProductionMode,
  },
  onSignal,
  onShutdown,
  logger: (msg, err) => {
    if (msg) {
      logger.warn(msg);
    }

    if (err) {
      logger.error(err);
    }
  },
});

server.listen(port, () => {
  logger.info(`Example app listening at ${protocol}://${hostname}:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// to make typescript happy
export {};
