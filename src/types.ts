import { Router as ExpressRouter } from 'express';
import {
  MongoClient,
  Db as MongoDb,
  Collection,
} from 'mongodb';

import { Logger } from './logger';
import { Config } from './config';

const TYPES = {
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  Db: Symbol.for('Db'),
  // Services
  UserService: Symbol.for('UserService'),
  NewsletterService: Symbol.for('NewsletterService'),
  AuthenticationService: Symbol.for('AuthenticationService'),
  // Services Collection
  ServiceCollection: Symbol.for('ServiceCollection'),
  // Controllers
  UserController: Symbol.for('UserController'),
  NewsletterController: Symbol.for('NewsletterController'),
  AuthenticationController: Symbol.for('AuthenticationController'),
  // Controllers Collection
  ControllerCollection: Symbol.for('ControllerCollection'),
  // Routes
  UserRoutes: Symbol.for('UserRoutes'),
  NewsletterRoutes: Symbol.for('NewsletterRoutes'),
  AuthenticationRoutes: Symbol.for('AuthenticationRoutes'),
  // Routers
  UserRouter: Symbol.for('UserRouter'),
  NewsletterRouter: Symbol.for('NewsletterRouter'),
  AuthenticationRouter: Symbol.for('AuthenticationRouter'),
  // Routers Collection
  RouterCollection: Symbol.for('RouterCollection'),
  // Server
  Server: Symbol.for('Server'),
};

export { TYPES };

// Db -------------------------------------------------------------------------

export interface Db {
  logger: Logger;
  config: Config;
  url: URL;
  safeUrl: URL;
  client: MongoClient;
  dbName: string;
  db: MongoDb;
  connect(): Promise<this>;
  disconnect(): Promise<this>;
}

// Schema ---------------------------------------------------------------------

export interface SchemaFieldItem {
  type: string,
}

export interface SchemaFieldRules {
  [key: string]: unknown,
}

export interface SchemaField {
  name: string,
  title: string,
  description: string,
  type: string,
  default?: unknown,
  unique?: boolean,
  required?: boolean,
  reference?: string,
  items?: SchemaFieldItem,
  rules?: SchemaFieldRules,
  fields?: SchemaFields,
}

export interface SchemaFields {
  [name: string]: SchemaField,
}

export interface Schema {
  name: string,
  title: string,
  pluralName: string,
  pluralTitle: string,
  description: string,
  collectionName: string,
  fields: SchemaFields,
}

// Services -------------------------------------------------------------------

export interface Service {
  logger: Logger,
  db: Db,
  schema: Schema,
  collection: Collection,
}

export type ServiceCollectionForEachCallback = (service: Service, i: number) => void;

// Routes ---------------------------------------------------------------------

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

export interface Router {
  path: string,
  router: ExpressRouter,
}

export type RouterCollectionForEachCallback = (router: Router, i: number) => void;
