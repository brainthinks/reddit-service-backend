import {
  inject,
  injectable,
} from 'inversify';
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import moment from 'moment-timezone';

import { TYPES } from '../../types';
import { Logger } from '../../interfaces';
import UserService from './service';

@injectable()
export default class UserController {
  logger: Logger;
  userService: UserService;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.UserService) userService: UserService,
  ) {
    this.logger = logger;
    this.userService = userService;
  }

  async createOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.createOne');

    try {
      const actor = req.user;
      const record = req.body;

      const user = await this.userService.createOne(actor, record);

      res.status(200).send(user);
    }
    catch (error) {
      next(error);
    }
  }

  async updateOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.updateOne');

    try {
      const actor = req.user;
      const userId = req.params.userId;
      const updates = req.body;
      const partial = req.method === 'PATCH';

      const user = await this.userService.updateOne(actor, userId, updates, { partial });

      res.status(200).send(user);
    }
    catch (error) {
      next(error);
    }
  }

  async deleteOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.deleteOne');

    try {
      const actor = req.user;
      const userId = req.params.userId;

      const result = await this.userService.deleteOne(actor, userId);

      res.status(200).send({ success: result });
    }
    catch (error) {
      next(error);
    }
  }

  async getOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.getOne');

    try {
      const actor = req.user;
      const userId = req.params.userId;

      const user = await this.userService.getOne(actor, userId);

      res.status(200).send(user);
    }
    catch (error) {
      next(error);
    }
  }

  async getMany (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.getMany');

    try {
      const actor = req.user;

      const users = await this.userService.getMany(actor);

      res.status(200).send(users);
    }
    catch (error) {
      next(error);
    }
  }

  async signUp (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.SignUp');

    try {
      const user = req.body;

      const signedUpUser = await this.userService.signUp(user);

      res.status(200).send(signedUpUser);
    }
    catch (error) {
      next(error);
    }
  }

  async supportedTimeZones (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.supportedTimeZones');

    try {
      res.status(200).send(moment.tz.names());
    }
    catch (error) {
      next(error);
    }
  }
}
