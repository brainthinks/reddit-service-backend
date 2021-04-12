import {
  injectable,
  inject,
} from 'inversify';

import { TYPES } from '../types';
import {
  Logger,
  Config,
  Db,
  ServiceCollection as ServiceCollectionInterface,
} from '../interfaces';

import UserService from '../modules/User/service';
import NewsletterService from '../modules/Newsletter/service';
import AuthenticationService from '../modules/Authentication/service';

type ServiceTypes = (
  UserService |
  NewsletterService |
  AuthenticationService
);

@injectable()
export default class ServiceCollection implements ServiceCollectionInterface {
  logger: Logger;
  config: Config;
  db: Db;
  services: {
    [x: string]: ServiceTypes,
  };

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Config) config: Config,
    @inject(TYPES.Db) db: Db,
    @inject(TYPES.UserService) userService: UserService,
    @inject(TYPES.NewsletterService) newsletterService: NewsletterService,
    @inject(TYPES.AuthenticationService) authenticationService: AuthenticationService,
  ) {
    this.logger = logger;
    this.config = config;
    this.db = db;

    this.services = {
      [userService.schema.name]: userService,
      [newsletterService.schema.name]: newsletterService,
      authentication: authenticationService,
    };
  }

  has (name: string): boolean {
    return Object.hasOwnProperty.call(this.services, name);
  }

  get (name: string): undefined | ServiceTypes {
    if (name in this.services) {
      return this.services[name];
    }

    return undefined;
  }
}
