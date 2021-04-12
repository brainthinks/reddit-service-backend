import { injectable, inject } from 'inversify';
import { Collection } from 'mongodb';

import {
  TYPES, Schema, Service,
} from '../../types';
import { Logger } from '../../logger';
import Db from '../../services/Db';
import schema from './schema';

@injectable()
export default class UserService implements Service {
  logger: Logger;
  db: Db;
  schema: Schema;
  collection: Collection;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Db) db: Db,
  ) {
    this.logger = logger;
    this.db = db;

    this.schema = schema;
    this.collection = db.db.collection(this.schema.collectionName);
  }

  async getOne (user: any, id: string, options: any = {}) {
    this.logger.info('getOne');
    // // const query = await authorizeRead(user, id, options);

    // const query = {
    //   _id: id,
    // };

    // const results = await this.collection.find(query);

    // return results;
  }

  async getMany (user: any, options: any = {}) {
    this.logger.info('getMany');
    // const query = await authorizeRead(user, id, options);

    // const query = {};

    // const results = await this.collection.find(query);

    // return results;
  }

  async createOne (user: any, record: string, options: any = {}) {
    this.logger.info('createOne');
  }

  async updateOne (user: any, updates: string, options: any = {}) {
    this.logger.info('updateOne');
  }

  async deleteOne (user: any, id: string, options: any = {}) {
    this.logger.info('deleteOne');
  }

  async signUp (record: string, options: any = {}) {
    console.log(record);
    this.logger.info('signUp');
  }
}
