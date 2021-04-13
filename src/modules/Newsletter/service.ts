import { injectable, inject } from 'inversify';
import { ObjectID, Collection } from 'mongodb';

import {
  TYPES,
  Schema,
} from '../../types';
import {
  Logger,
  Config,
} from '../../interfaces';
import Db from '../../services/Db';
import schema from './schema';
import validate from '../../lib/schemas/validator';
import sanitize from '../../lib/schemas/sanitize';
import UserService from '../User/service';
import Scheduler from './scheduler';

@injectable()
export default class NewsletterService {
  logger: Logger;
  config: Config;
  db: Db;
  userService: UserService;
  schema: Schema;
  collection: Collection;
  scheduler: Scheduler;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Config) config: Config,
    @inject(TYPES.Db) db: Db,
    @inject(TYPES.UserService) userService: UserService,
  ) {
    this.logger = logger;
    this.config = config;
    this.db = db;
    this.userService = userService;
    this.schema = schema;
    this.collection = db.db.collection(this.schema.collectionName);

    this.scheduler = new Scheduler(
      this.logger,
      this.config,
      this,
      this.userService,
    );
  }

  async initialize (): Promise<void> {
    const newsletters = await this.collection.find().toArray();

    // @todo - schedule each job individually via cursor
    await this.scheduler.initialize(newsletters);
  }


  async getOne (actor: any, id: string, options: any = {}): Promise<any> {
    this.logger.debug('NewsletterService.getOne');

    const query = {
      _id: ObjectID.createFromHexString(id.toString()),
    };

    const newsletterRecord = await this.collection.findOne(query);

    return newsletterRecord;
  }

  async getMany (actor: any, options: any = {}): Promise<any> {
    this.logger.debug('NewsletterService.getMany');

    const query = {};

    const newsletterRecords = await this.collection.find(query).toArray();

    return newsletterRecords;
  }

  async createOne (actor: any, record: string, options: any = {}): Promise<any> {
    this.logger.debug('NewsletterService.createOne');

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
      message: `Newsletter ${sanitizedRecord.title} updated by ${actor.username} at ${at}`,
    };
    sanitizedRecord.updatedAt = sanitizedRecord.createdAt;

    await validate(this, sanitizedRecord);

    const { insertedId } = await this.collection.insertOne(sanitizedRecord);

    const newsletter = await this.getOne(actor, insertedId);

    this.scheduler.scheduleJob(newsletter);

    return newsletter;
  }

  async updateOne (actor: any, id: string, updates: string, options: any = {}): Promise<any> {
    this.logger.debug('NewsletterService.updateOne');

    const newsletter = await this.getOne(actor, id);

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
      message: `Newsletter ${newsletter.title} updated by ${actor.username} at ${at}`,
    };

    await validate(this, sanitizedUpdates, {
      skipMissingFields: options.partial,
    });

    const query = {
      _id: newsletter._id,
    };

    const { modifiedCount } = await this.collection.updateOne(query, { $set: sanitizedUpdates });

    if (modifiedCount !== 1) {
      throw new Error(`Error while updating newsletter ${newsletter._id}`);
    }

    const updatedNewsletter = await this.getOne(actor, id);

    this.scheduler.scheduleJob(updatedNewsletter);

    return updatedNewsletter;
  }

  async deleteOne (actor: any, id: string, options: any = {}): Promise<any> {
    this.logger.debug('NewsletterService.deleteOne');

    const query = {
      _id: ObjectID.createFromHexString(id.toString()),
    };

    const count = await this.collection.count(query);

    if (count === 0) {
      throw new Error(`Cannot delete non-existent newsletter with id "${id}"`);
    }

    const result = await this.collection.deleteOne(query);

    this.scheduler.destroyJob(id);

    // console.log(result);

    return true;
  }
}
