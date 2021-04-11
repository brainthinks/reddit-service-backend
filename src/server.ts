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
import getRouters from './modules/routers';

/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('../package.json');
/* eslint-enable @typescript-eslint/no-var-requires */

export default function (logger: Logger, config: Config) {
  return class Server {
    server: http.Server;
    app: Express;

    static factory (): Server {
      return new Server();
    }

    private constructor () {
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
          __unsafeExposeStackTraces: !config.isProductionMode,
        },
        onSignal: this.onSignal.bind(this),
        onShutdown: this.onShutdown.bind(this),
        logger: (msg, err) => {
          if (msg) {
            logger.warn(msg);
          }

          if (err) {
            logger.error(err);
          }
        },
      });

      this.app.use(requestLogger(logger));

      const routers = getRouters(logger);

      for (let i = 0; i < routers.length; i++) {
        const router = routers[i];

        this.app.use(router.path, router.router);
      }

      this.app.get('*', (req, res) => {
        res.status(404).send({
          error: `requested path '${req.path}' not found`,
        });
      });

      this.app.use(errorHandler(logger));

      await new Promise<void>((resolve, reject) => {
        this.server.listen(config.port, () => {
          logger.info(`${packageJson.name} listening at ${config.protocol}://${config.host}:${config.port}`);
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
      logger.info('server is shutting down');
      return Promise.all([
        () => this.destroy(),
      ]);
    }

    private async onShutdown () {
      logger.info('server has stopped');
    }

    private async healthCheck () {
      logger.info('healthcheck');
      return { ok: true };
    }
  };
}
