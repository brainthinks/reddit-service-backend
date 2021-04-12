import {
  Route,
  RouteMethods,
} from '../../types';
import AuthenticationController from './controller';

export default function getAuthenticationRoutes (authenticationController: AuthenticationController): Route[] {
  const routes: Route[] = [
    {
      method: RouteMethods.post,
      path: '/login',
      middleware: [
        authenticationController.login.bind(authenticationController),
      ],
    },
    {
      method: RouteMethods.post,
      path: '/logout',
      middleware: [
        authenticationController.logout.bind(authenticationController),
      ],
    },
  ];

  return routes;
}
