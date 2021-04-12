import {
  Route,
  RouteMethods,
} from '../../types';
import AuthenticationController from '../Authentication/controller';
import UserController from './controller';

export default function getUserRoutes (
  authenticationController: AuthenticationController,
  userController: UserController,
): Route[] {
  const routes: Route[] = [
    {
      method: RouteMethods.get,
      path: '/:userId',
      middleware: [
        userController.getOne.bind(userController),
      ],
    },
    {
      method: RouteMethods.get,
      path: '/',
      middleware: [
        userController.getMany.bind(userController),
      ],
    },
    {
      method: RouteMethods.post,
      path: '/signUp',
      middleware: [
        authenticationController.ensureUnauthenticated.bind(authenticationController),
        userController.signUp.bind(userController),
      ],
    },
    {
      method: RouteMethods.post,
      path: '/',
      middleware: [
        authenticationController.ensureAuthenticated.bind(authenticationController),
        userController.createOne.bind(userController),
      ],
    },
    {
      method: RouteMethods.put,
      path: '/:userId',
      middleware: [
        authenticationController.ensureAuthenticated.bind(authenticationController),
        userController.updateOne.bind(userController),
      ],
    },
    {
      method: RouteMethods.patch,
      path: '/:userId',
      middleware: [
        authenticationController.ensureAuthenticated.bind(authenticationController),
        userController.updateOne.bind(userController),
      ],
    },
    {
      method: RouteMethods.delete,
      path: '/:userId',
      middleware: [
        authenticationController.ensureAuthenticated.bind(authenticationController),
        userController.deleteOne.bind(userController),
      ],
    },
    {
      method: RouteMethods.get,
      path: '/utils/supportedTimeZones',
      middleware: [
        userController.supportedTimeZones.bind(userController),
      ],
    },
  ];

  return routes;
}
