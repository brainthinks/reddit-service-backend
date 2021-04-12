import { injectable, inject } from 'inversify';

import {
  TYPES,
  Router,
  RouterCollectionForEachCallback,
} from '../types';
import {
  Logger,
  Config,
  RouterCollection as RouterCollectionInterface,
} from '../interfaces';

@injectable()
export default class RouterCollection implements RouterCollectionInterface {
  logger: Logger;
  config: Config;
  routers: Router[];

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Config) config: Config,
    @inject(TYPES.UserRouter) userRouter: Router,
    @inject(TYPES.NewsletterRouter) newsletterRouter: Router,
    @inject(TYPES.AuthenticationRouter) authenticationRouter: Router,
  ) {
    this.logger = logger;
    this.config = config;

    this.routers = [
      userRouter,
      newsletterRouter,
      authenticationRouter,
    ];
  }

  forEach (fn: RouterCollectionForEachCallback): void {
    for (let i = 0; i < this.routers.length; i++) {
      const router = this.routers[i];

      fn(router, i);
    }
  }
}
