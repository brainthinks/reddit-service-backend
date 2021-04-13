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

  async createOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('NewsletterController.createOne');

    try {
      const actor = req.user;
      const record = req.body;

      const newsletter = await this.newsletterService.createOne(actor, record);

      res.status(200).send(newsletter);
    }
    catch (error) {
      next(error);
    }
  }

  async updateOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('NewsletterController.updateOne');

    try {
      const actor = req.user;
      const newsletterId = req.params.newsletterId;
      const updates = req.body;
      const partial = req.method === 'PATCH';

      const newsletter = await this.newsletterService.updateOne(actor, newsletterId, updates, { partial });

      res.status(200).send(newsletter);
    }
    catch (error) {
      next(error);
    }
  }

  async deleteOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('NewsletterController.deleteOne');

    try {
      const actor = req.user;
      const newsletterId = req.params.newsletterId;

      const result = await this.newsletterService.deleteOne(actor, newsletterId);

      res.status(200).send({ success: result });
    }
    catch (error) {
      next(error);
    }
  }

  async getOne (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('NewsletterController.getOne');

    try {
      const actor = req.user;
      const newsletterId = req.params.newsletterId;

      const newsletter = await this.newsletterService.getOne(actor, newsletterId);

      res.status(200).send(newsletter);
    }
    catch (error) {
      next(error);
    }
  }

  async getMany (req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.debug('NewsletterController.getMany');

    try {
      const actor = req.user;

      const newsletters = await this.newsletterService.getMany(actor);

      res.status(200).send(newsletters);
    }
    catch (error) {
      next(error);
    }
  }
}
