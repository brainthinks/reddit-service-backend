import { Route } from '../../types';
import Router from '../../lib/controllers/Router';
import UserService from './service';

export default function getUserRouter (
  userService: UserService,
  routes: Route[],
): Router {
  const router = new Router(userService.schema.pluralName, routes);

  return router;
}
