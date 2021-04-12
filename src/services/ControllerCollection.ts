import {
  injectable,
  inject,
} from 'inversify';

import { TYPES } from '../types';
import {
  Logger,
  Config,
  Db,
} from '../interfaces';

import UserController from '../modules/User/controller';
import NewsletterController from '../modules/Newsletter/controller';
import AuthenticationController from '../modules/Authentication/controller';

type ControllerTypes = (
  UserController |
  NewsletterController |
  AuthenticationController
);

@injectable()
export default class ControllerCollection {
  logger: Logger;
  config: Config;
  db: Db;
  controllers: {
    [x: string]: ControllerTypes,
  };

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Config) config: Config,
    @inject(TYPES.Db) db: Db,
    @inject(TYPES.UserController) userController: UserController,
    @inject(TYPES.NewsletterController) newsletterController: NewsletterController,
    @inject(TYPES.AuthenticationController) authenticationController: AuthenticationController,
  ) {
    this.logger = logger;
    this.config = config;
    this.db = db;

    this.controllers = {
      [userController.userService.schema.name]: userController,
      [newsletterController.newsletterService.schema.name]: newsletterController,
      authentication: authenticationController,
    };
  }

  has (name: string): boolean {
    return Object.hasOwnProperty.call(this.controllers, name);
  }

  get (name: string): undefined | ControllerTypes {
    if (name in this.controllers) {
      return this.controllers[name];
    }

    return undefined;
  }
}
