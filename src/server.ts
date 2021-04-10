// node imports
import http from 'http';
// 3rd party imports
import express, { Express } from 'express';
import { createTerminus } from '@godaddy/terminus';
// local imports
import { Logger } from './logger';
import { Config } from './config';

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

  start (): this {
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
      onSignal: this.onSignal,
      onShutdown: this.onShutdown,
      logger: (msg, err) => {
        if (msg) {
          this.logger.warn(msg);
        }

        if (err) {
          this.logger.error(err);
        }
      },
    });

    this.server.listen(this.config.port, () => {
      this.logger.info(`Example app listening at ${this.config.protocol}://${this.config.host}:${this.config.port}`);
    });

    this.app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    return this;
  }

  private async onSignal () {
    this.logger.info('server is starting cleanup');
    return Promise.all([
      () => this.server.close(),
    ]);
  }

  private async onShutdown () {
    this.logger.info('cleanup finished, server is shutting down');
  }

  private async healthCheck () {
    this.logger.info('healthcheck');
    return { ok: true };
  }
}
