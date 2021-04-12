// node imports
import http from 'http';
// 3rd party imports
import { Express } from 'express';
// local imports
import { Logger } from './logger';
import { Config } from './config';
import {
  Db,
  Service,
  ServiceCollectionForEachCallback,
  Router,
  RouterCollectionForEachCallback,
} from './types';

export type { Logger };
export type { Config };
export type { Db };
export type { Service };

export interface ServiceCollection {
  logger: Logger;
  config: Config;
  db: Db;
}

export interface RouterCollection {
  logger: Logger;
  config: Config;
  routers: Router[];
  forEach(fn: RouterCollectionForEachCallback): void;
}

export interface Server {
  server: http.Server;
  app: Express;
  start(): Promise<this>;
  stop(): Promise<this>;
  destroy(): Promise<this>;
}
