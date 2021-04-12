import {
  Route,
  RouteMethods,
} from '../../types';

import UserController from './controller';

export default function getUserRoutes (userController: UserController): Route[] {
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
        userController.signUp.bind(userController),
      ],
    },
    {
      method: RouteMethods.post,
      path: '/',
      middleware: [
        userController.createOne.bind(userController),
      ],
    },
    {
      method: RouteMethods.put,
      path: '/:userId',
      middleware: [
        userController.updateOne.bind(userController),
      ],
    },
    {
      method: RouteMethods.patch,
      path: '/:userId',
      middleware: [
        userController.updateOne.bind(userController),
      ],
    },
    {
      method: RouteMethods.delete,
      path: '/:userId',
      middleware: [
        userController.deleteOne.bind(userController),
      ],
    },
  ];

  return routes;
}
