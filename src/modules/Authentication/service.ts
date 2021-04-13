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

  async authenticate (username: string, password: string, options: any = {}) {
    const user = await this.userService.collection.findOne({ username });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  serializeUser (user: any): string {
    return user._id.toString();
  }

  async deserializeUser (serializedUser: string): Promise<any> {
    const user = await this.userService.lookupById(serializedUser);

    return user;
  }
}
