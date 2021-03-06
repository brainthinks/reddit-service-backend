import { injectable, inject } from 'inversify';
import {
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import { TYPES } from '../../types';
import {
  Logger,
  Config,
} from '../../interfaces';
import AuthenticationService from './service';

@injectable()
export default class AuthenticationController {
  logger: Logger;
  config: Config;
  authenticationService: AuthenticationService;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Config) config: Config,
    @inject(TYPES.AuthenticationService) authenticationService: AuthenticationService,
  ) {
    this.logger = logger;
    this.config = config;
    this.authenticationService = authenticationService;
  }

  // @see https://github.com/passport/express-4.x-local-example/blob/master/server.js
  initializeApp (app: Express): void {
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({
      host: this.config.redisHostname,
      port: this.config.redisPort,
    });

    redisClient.on('error', (error) => {
      this.logger.error([
        'Redis Session Error:',
        error,
      ]);
    });

    const strategyOptions = {
      usernameField: 'username',
      passwordField: 'username',
    };

    passport.use(new passportLocal.Strategy(strategyOptions, async (username, password, cb) => {
      try {
        const user = await this.authenticationService.authenticate(username, password);

        cb(null, user);
      }
      catch (error) {
        cb(null, false);
      }
    }));

    passport.serializeUser((user: any, cb) => {
      const serializedUser = this.authenticationService.serializeUser(user);

      cb(null, serializedUser);
    });

    passport.deserializeUser(async (serializedUser: string, cb) => {
      try {
        const user = await this.authenticationService.deserializeUser(serializedUser);

        cb(null, user);
      }
      catch (error) {
        cb(error);
      }
    });

    app.use(session({
      store: new RedisStore({ client: redisClient }),
      // @todo - change this secret, put it in .env
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());
  }

  ensureAuthenticated (req: Request, res: Response, next: NextFunction): void {
    try {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        res.status(401).send('401 Not Authenticated');
        return;
      }

      next();
    }
    catch (error) {
      next(error);
    }
  }

  ensureUnauthenticated (req: Request, res: Response, next: NextFunction): void {
    try {
      if (req.isAuthenticated && req.isAuthenticated()) {
        res.status(403).send('403 Forbidden - to access the requested resource, you must not be authenticated');
        return;
      }

      next();
    }
    catch (error) {
      next(error);
    }
  }

  async login (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        passport.authenticate('local')(req, res, (error: Error) => {
          if (error) {
            return reject(error);
          }

          resolve();
        });
      });

      res.status(200).send(req.user);
    }
    catch (error) {
      next(error);
    }
  }

  async logout (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      req.logout();
      res.status(200).send({ loggedOut: true });
    }
    catch (error) {
      next(error);
    }
  }
}
