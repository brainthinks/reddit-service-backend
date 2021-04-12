// node imports
import http from 'http';
// 3rd party imports
import { injectable, inject } from 'inversify';
import express, { Express } from 'express';
import { createTerminus } from '@godaddy/terminus';
// local imports
import {
  Logger,
  Config,
  Db,
  Server as ServerInterface,
} from '../interfaces';
import {
  TYPES,
} from '../types';
import RouterCollection from './RouterCollection';
import {
  requestLogger,
  errorHandler,
} from '../middleware';
import AuthenticationController from '../modules/Authentication/controller';

/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('../../package.json');
/* eslint-enable @typescript-eslint/no-var-requires */

@injectable()
export default class Server implements ServerInterface {
  logger: Logger;
  config: Config;
  db: Db;
  authenticationController: AuthenticationController;
  routerCollection: RouterCollection;
  server: http.Server;
  app: Express;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Config) config: Config,
    @inject(TYPES.Db) db: Db,
    @inject(TYPES.AuthenticationController) authenticationController: AuthenticationController,
    @inject(TYPES.RouterCollection) routerCollection: RouterCollection,
  ) {
    this.logger = logger;
    this.config = config;
    this.db = db;
    this.authenticationController = authenticationController;
    this.routerCollection = routerCollection;

    this.app = express();
    this.server = http.createServer(this.app);

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
          this.logger.warn(msg);
        }

        if (err) {
          this.logger.error(err);
        }
      },
    });

    this.app.use(requestLogger(this.logger));

    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());

    this.authenticationController.initializeApp(this.app);

    this.routerCollection.forEach((router) => {
      this.app.use(router.path, router.router);
    });

    this.app.get('*', (req, res) => {
      res.status(404).send({
        error: `requested path '${req.path}' not found`,
      });
    });

    this.app.use(errorHandler(this.logger));
  }

  async start (): Promise<this> {
    await new Promise<void>((resolve, reject) => {
      this.server.listen(this.config.port, () => {
        this.logger.info(`${packageJson.name} listening at ${this.config.protocol}://${this.config.hostname}:${this.config.port}`);
        resolve();
      });
    });

    return this;
  }

  // @todo - does http server close have a callback or some other way to know
  // when it's really finished?
  async stop (): Promise<this> {
    this.server.close();

    return this;
  }

  async destroy (): Promise<this> {
    this.stop();

    return this;
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
