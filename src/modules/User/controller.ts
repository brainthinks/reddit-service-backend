import { inject, injectable } from 'inversify';
import {
  Request,
  Response,
  NextFunction,
} from 'express';

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

  async createOne (req: Request, res: Response, next: NextFunction) {
    next();
  }

  async updateOne (req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;

    next();
  }

  async deleteOne (req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;

    next();
  }

  async getOne (req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;

    this.logger.info(userId);

    next();
  }

  async getMany (req: Request, res: Response, next: NextFunction) {
    next();
  }

  async signUp (req: Request, res: Response, next: NextFunction) {
    const user = req.body;

    const results = await this.userService.signUp(user);

    console.log(results);

    next();
  }
}
