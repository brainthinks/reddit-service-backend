import { injectable, inject } from 'inversify';
import { MongoClient, Db as MongoDb } from 'mongodb';

import {
  Logger,
  Config,
  Db as DbInterface,
} from '../interfaces';

import { TYPES } from '../types';

/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('../../package.json');
/* eslint-enable @typescript-eslint/no-var-requires */

@injectable()
export default class Db implements DbInterface {
  logger: Logger;
  config: Config;
  url: URL;
  safeUrl: URL;
  client: MongoClient;
  dbName: string;
  db!: MongoDb;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Config) config: Config,
  ) {
    this.logger = logger;
    this.config = config;

    this.url = this.getConnectionStringWhatwgUrl();

    this.safeUrl = this.getConnectionStringWhatwgUrl();
    this.safeUrl.username = this.url.username
      ? '***'
      : '';
    this.safeUrl.password = this.url.password
      ? '***'
      : '';

    this.client = new MongoClient(this.url.href, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.dbName = packageJson.name;
  }

  getConnectionStringWhatwgUrl (): URL {
    const url = new URL(`${this.config.mongoProtocol}://`);

    url.hostname = this.config.mongoHostname;
    url.port = this.config.mongoPort.toString();
    url.username = this.config.mongoUsername;
    url.password = this.config.mongoPassword;
    url.searchParams.append('connectTimeoutMS', `${this.config.mongoConnectionTimeoutSeconds * 1000}`);

    return url;
  }

  async connect (): Promise<this> {
    try {
      await this.client.connect();

      this.db = this.client.db(this.dbName);

      await this.db.command({ ping: 1 });
      this.logger.info(`DB: connected successfully to ${this.safeUrl.href}`);

      return this;
    }
    catch (error) {
      await this.disconnect();

      throw error;
    }
  }

  async disconnect (): Promise<this> {
    await this.client.close();

    return this;
  }
}
