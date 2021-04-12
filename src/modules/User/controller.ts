import { inject, injectable } from 'inversify';
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
      throw new Error('not implemented');
    }
    catch (error) {
      next(error);
    }
  }

  async updateOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.updateOne');

    try {
      throw new Error('not implemented');
    }
    catch (error) {
      next(error);
    }
  }

  async deleteOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('UserController.deleteOne');

    try {
      const actor = {};
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
      const actor = {};
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
      const actor = {};

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
