import { injectable, inject } from 'inversify';
import { ObjectID, Collection } from 'mongodb';

import { TYPES, Schema } from '../../types';
import { Logger } from '../../interfaces';
import Db from '../../services/Db';
import schema from './schema';
import validate from '../../lib/schemas/validator';
import sanitize from '../../lib/schemas/sanitize';

@injectable()
export default class UserService {
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

    const query: any = {};

    try {
      query._id = ObjectID.createFromHexString(id.toString());
    }
    catch (error) {
      query.username = id;
    }

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

    const sanitizedRecord = await sanitize(this, record, {
      skipFields: [
        this.schema.fields.createdAt.name,
        this.schema.fields.updatedAt.name,
      ],
    });

    const at = Date.now();

    sanitizedRecord.createdAt = {
      actor: actor._id,
      at,
      message: `User ${sanitizedRecord.username} updated by ${actor.username} at ${at}`,
    };
    sanitizedRecord.updatedAt = sanitizedRecord.createdAt;

    await validate(this, sanitizedRecord);

    const { insertedId } = await this.collection.insertOne(sanitizedRecord);

    return this.getOne(actor, insertedId);
  }

  async updateOne (actor: any, id: string, updates: string, options: any = {}): Promise<any> {
    this.logger.debug('UserService.updateOne');

    const user = await this.getOne(actor, id);

    const sanitizedUpdates = await sanitize(this, updates, {
      skipMissingFields: options.partial,
      skipFields: [
        this.schema.fields.createdAt.name,
        this.schema.fields.updatedAt.name,
      ],
    });

    const at = Date.now();

    sanitizedUpdates.updatedAt = {
      actor: actor._id,
      at,
      message: `User ${user.username} updated by ${actor.username} at ${at}`,
    };

    await validate(this, sanitizedUpdates, {
      skipMissingFields: options.partial,
    });

    const query = {
      _id: user._id,
    };

    const { modifiedCount } = await this.collection.updateOne(query, { $set: sanitizedUpdates });

    if (modifiedCount !== 1) {
      throw new Error(`Error while updating user ${user.username}`);
    }

    return this.getOne(actor, id);
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

    // console.log(result);

    return true;
  }

  async signUp (record: any, options: any = {}): Promise<any> {
    this.logger.debug('UserService.signUp');

    const user = await sanitize(this, record, {
      skipFields: [
        this.schema.fields.createdAt.name,
        this.schema.fields.updatedAt.name,
      ],
    });

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
      actor: user._id,
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

  async lookupById (id: string): Promise<any> {
    this.logger.debug('UserService.lookupById');

    const query = {
      _id: ObjectID.createFromHexString(id.toString()),
    };

    const user = await this.collection.findOne(query);

    return user;
  }
}
