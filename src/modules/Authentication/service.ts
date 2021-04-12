import {
  injectable,
  inject,
} from 'inversify';

import { TYPES } from '../../types';
import {
  Logger,
  Db,
} from '../../interfaces';
import UserService from '../User/service';

@injectable()
export default class AuthenticationService {
  logger: Logger;
  db: Db;
  userService: UserService;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.Db) db: Db,
    @inject(TYPES.UserService) userService: UserService,
  ) {
    this.logger = logger;
    this.db = db;
    this.userService = userService;
  }

  async login (user: any, options: any = {}) {
    try {
      const validUser = await this.userService.getOne(user, user._id);

      // @todo - do some passport stuff
    }
    catch (error) {
      this.logger.error([
        `Unable to login as user with id: ${user._id}`,
        error,
      ]);
    }
  }

  async logout (user: any, options: any = {}) {

  }
}
