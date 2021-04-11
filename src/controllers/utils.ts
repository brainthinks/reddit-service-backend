import express from 'express';

import {
  Schema,
} from '../schemas/types';
import {
  Routes,
  Router,
} from './types';

export function generateRouterFromRoutes (
  pathPrefix: string,
  routes: Routes,
): Router {
  const _router = express.Router();

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    _router[route.method](route.path, route.middleware);
  }

  const router: Router = {
    path: `/${pathPrefix}`,
    router: _router,
  };

  return router;
}
