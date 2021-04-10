// node imports
import http from 'http';
// 3rd party imports
import express, { Express } from 'express';
import { createTerminus } from '@godaddy/terminus';
// local imports
import { Logger } from './logger';
import { Config } from './config';
import {
  requestLogger,
  errorHandler,
} from './middleware/';
import routers from './modules/routers';

/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('../package.json');
/* eslint-enable @typescript-eslint/no-var-requires */

let server: Server;

export default class Server {
  config: Config;
  logger: Logger;
  server: http.Server;
  app: Express;

  static asSingleton (logger?: Logger, config?: Config): Server {
    if (server) {
      return server;
    }

    if (logger === undefined || config === undefined) {
      throw new Error('Server singleton not yet created');
    }

    return Server.factory(logger, config);
  }

  static factory (logger: Logger, config: Config): Server {
    return new Server(config, logger);
  }

  constructor (config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger;

    this.app = express();
    this.server = http.createServer(this.app);
  }

  async start (): Promise<this> {
    createTerminus(this.server, {
      signals: [
        'SIGTERM',
        'SIGINT',
        'SIGHUP',
      ],
      healthChecks: {
        '/healthcheck': this.healthCheck,
        __unsafeExposeStackTraces: !this.config.isProductionMode,
      },
      onSignal: this.onSignal.bind(this),
      onShutdown: this.onShutdown.bind(this),
      logger: (msg, err) => {
        if (msg) {
          this.logger.warn(msg);
        }

        if (err) {
          this.logger.error(err);
        }
      },
    });

    this.app.use(requestLogger(this.logger));

    for (let i = 0; i < routers.length; i++) {
      const router = routers[i];

      this.app.use(router.path, router.router);
    }

    this.app.get('*', (req, res) => {
      res.status(404).send({
        error: `requested path '${req.path}' not found`,
      });
    });

    this.app.use(errorHandler(this.logger));

    await new Promise<void>((resolve, reject) => {
      this.server.listen(this.config.port, () => {
        this.logger.info(`${packageJson.name} listening at ${this.config.protocol}://${this.config.host}:${this.config.port}`);
        resolve();
      });
    });

    return this;
  }

  // @todo - does http server close have a callback or some other way to know
  // when it's really finished?
  stop (): void {
    this.server.close();
  }

  destroy (): void {
    this.stop();
  }

  private async onSignal () {
    this.logger.info('server is shutting down');
    return Promise.all([
      () => this.destroy(),
    ]);
  }

  private async onShutdown () {
    this.logger.info('server has stopped');
  }

  private async healthCheck () {
    this.logger.info('healthcheck');
    return { ok: true };
  }
}
