import { Router as ExpressRouter } from 'express';

export enum RouteMethods {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
  delete = 'delete',
}

export interface Route {
  method: RouteMethods,
  path: string,
  // @todo
  middleware: any[],
}

export type Routes = Route[];

export interface Router {
  path: string,
  router: ExpressRouter,
}

export type Routers = Router[];
