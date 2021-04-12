import express, { Router as ExpressRouter } from 'express';
import {
  Route,
  Router as RouterType,
} from '../../types';

export default class Router implements RouterType {
  path: string;
  router: ExpressRouter;

  constructor (pathPrefix: string, routes: Route[]) {
    this.path = `/${pathPrefix}`;
    this.router = express.Router();

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      this.router[route.method](route.path, route.middleware);
    }
  }
}
