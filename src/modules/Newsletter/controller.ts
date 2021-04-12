import {
  injectable,
  inject,
} from 'inversify';
import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { TYPES } from '../../types';
import { Logger } from '../../interfaces';
import NewsletterService from './service';

@injectable()
export default class NewsletterController {
  logger: Logger;
  newsletterService: NewsletterService;

  constructor (
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.NewsletterService) newsletterService: NewsletterService,
  ) {
    this.logger = logger;
    this.newsletterService = newsletterService;
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
}
