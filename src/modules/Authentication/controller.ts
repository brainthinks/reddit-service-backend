import { injectable, inject } from 'inversify';
import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { TYPES } from '../../types';
import { Logger } from '../../interfaces';
import AuthenticationService from './service';

@injectable()
export default class AuthenticationController {
  logger: Logger;
  authenticationService: AuthenticationService;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.AuthenticationService) authenticationService: AuthenticationService,
  ) {
    this.logger = logger;
    this.authenticationService = authenticationService;
  }

  async login (req: Request, res: Response, next: NextFunction) {
    next();
  }

  async logout (req: Request, res: Response, next: NextFunction) {
    next();
  }
}
