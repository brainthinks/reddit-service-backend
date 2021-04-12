import { Route } from '../../types';
import Router from '../../lib/controllers/Router';
import AuthenticationService from './service';

export default function getAuthenticationRouter (
  authenticationService: AuthenticationService,
  routes: Route[],
): Router {
  const router = new Router('auth', routes);

  return router;
}
