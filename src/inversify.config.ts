import { Container } from 'inversify';

import {
  TYPES,
  Route,
} from './types';
import {
  Logger,
  Config,
  Db as DbInterface,
  Server as ServerInterface,
} from './interfaces';
import Db from './services/Db';
import Router from './lib/controllers/Router';

// Services
import UserService from './modules/User/service';
import NewsletterService from './modules/Newsletter/service';
import AuthenticationService from './modules/Authentication/service';
// Services Collection
import ServiceCollection from './services/ServiceCollection';
// Controllers
import UserController from './modules/User/controller';
import NewsletterController from './modules/Newsletter/controller';
import AuthenticationController from './modules/Authentication/controller';
// Controllers Collection
import ControllerCollection from './services/ControllerCollection';
// Routes
import getUserRoutes from './modules/User/routes';
import getNewsletterRoutes from './modules/Newsletter/routes';
import getAuthenticationRoutes from './modules/Authentication/routes';
// Routers
// Routers Collection
import RouterCollection from './services/RouterCollection';
// Server
import Server from './services/Server';
import getUserRouter from './modules/User/router';
import getNewsletterRouter from './modules/Newsletter/router';
import getAuthenticationRouter from './modules/Authentication/router';

export default async function getContainer (logger: Logger, config: Config): Promise<Container> {
  const container = new Container({ defaultScope: 'Singleton' });

  // Bootstrapping
  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
  container.bind<Config>(TYPES.Config).toConstantValue(config);

  // Db
  container.bind<DbInterface>(TYPES.Db).to(Db);
  // @todo - use inversify factory or provider
  await container.get<DbInterface>(TYPES.Db).connect();

  // Services
  container.bind<UserService>(TYPES.UserService).to(UserService);
  container.bind<NewsletterService>(TYPES.NewsletterService).to(NewsletterService);
  container.bind<AuthenticationService>(TYPES.AuthenticationService).to(AuthenticationService);
  // Services Collection
  container.bind<ServiceCollection>(TYPES.ServiceCollection).to(ServiceCollection);

  // Controllers
  container.bind<UserController>(TYPES.UserController).to(UserController);
  container.bind<NewsletterController>(TYPES.NewsletterController).to(NewsletterController);
  container.bind<AuthenticationController>(TYPES.AuthenticationController).to(AuthenticationController);
  // Controllers Collection
  container.bind<ControllerCollection>(TYPES.ControllerCollection).to(ControllerCollection);

  // Routes
  container
    .bind<Route[]>(TYPES.UserRoutes)
    .toConstantValue(getUserRoutes(
      container.resolve(AuthenticationController),
      container.resolve(UserController),
    ));
  container
    .bind<Route[]>(TYPES.NewsletterRoutes)
    .toConstantValue(getNewsletterRoutes(
      container.resolve(AuthenticationController),
      container.resolve(NewsletterController),
    ));
  container
    .bind<Route[]>(TYPES.AuthenticationRoutes)
    .toConstantValue(getAuthenticationRoutes(
      container.resolve(AuthenticationController),
    ));

  // Routers
  container
    .bind<Router>(TYPES.UserRouter)
    .toConstantValue(getUserRouter(
      container.resolve(UserService),
      container.get<Route[]>(TYPES.UserRoutes),
    ));
  container
    .bind<Router>(TYPES.NewsletterRouter)
    .toConstantValue(getNewsletterRouter(
      container.resolve(NewsletterService),
      container.get<Route[]>(TYPES.NewsletterRoutes),
    ));
  container
    .bind<Router>(TYPES.AuthenticationRouter)
    .toConstantValue(getAuthenticationRouter(
      container.resolve(AuthenticationService),
      container.get<Route[]>(TYPES.AuthenticationRoutes),
    ));

  // Routers Collection
  container.bind<RouterCollection>(TYPES.RouterCollection).to(RouterCollection);

  // Now that all services have been created, the server is ready to be
  // instantiated
  container.bind<ServerInterface>(TYPES.Server).to(Server);

  return container;
}
