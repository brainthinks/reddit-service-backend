import { injectable, inject } from 'inversify';
import { ObjectID, Collection } from 'mongodb';

import {
  TYPES, Schema, Service,
} from '../../types';
import { Logger } from '../../logger';
import Db from '../../services/Db';
import schema from './schema';
import validate from '../../lib/schemas/validator';

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

  async getOne (actor: any, id: string, options: any = {}): Promise<any> {
    this.logger.debug('UserService.getOne');

    const query = {
      _id: ObjectID.createFromHexString(id.toString()),
    };

    const userRecord = await this.collection.findOne(query);

    return userRecord;
  }

  async getMany (actor: any, options: any = {}): Promise<any[]> {
    this.logger.debug('UserService.getMany');

    const query = {};

    const userRecords = await this.collection.find(query).toArray();

    return userRecords;
  }

  async createOne (actor: any, record: string, options: any = {}): Promise<any> {
    this.logger.debug('UserService.createOne');
    throw new Error('not implemented');
  }

  async updateOne (actor: any, updates: string, options: any = {}): Promise<any> {
    this.logger.debug('UserService.updateOne');
    throw new Error('not implemented');
  }

  async deleteOne (actor: any, id: string, options: any = {}): Promise<boolean> {
    this.logger.debug('UserService.deleteOne');

    const query = {
      _id: ObjectID.createFromHexString(id.toString()),
    };

    const count = await this.collection.count(query);

    if (count === 0) {
      throw new Error(`Cannot delete non-existent user with id "${id}"`);
    }

    const result = await this.collection.deleteOne(query);

    console.log(result);

    return true;
  }

  async signUp (record: any, options: any = {}): Promise<any> {
    this.logger.debug('UserService.signUp');

    const user = {
      ...record,
    };

    await validate(this, user, {
      skipFields: [
        this.schema.fields.createdAt.name,
        this.schema.fields.updatedAt.name,
      ],
    });

    const { insertedId } = await this.collection.insertOne(user);
    const at = Date.now();

    user._id = insertedId;
    user.createdAt = {
      userId: user._id,
      at,
      message: `User ${user.username} signed up at ${at}`,
    };
    user.updatedAt = user.createdAt;

    await validate(this, user);

    const { modifiedCount } = await this.collection.updateOne({ _id: user._id }, { $set: user });

    if (modifiedCount !== 1) {
      throw new Error('Error while signing up');
    }

    return this.getOne(user, user._id);
  }
}
