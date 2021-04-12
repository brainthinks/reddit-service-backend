import { Route } from '../../types';
import Router from '../../lib/controllers/Router';
import NewsletterService from './service';

export default function getNewsletterRouter (
  newsletterService: NewsletterService,
  routes: Route[],
): Router {
  const router = new Router(newsletterService.schema.pluralName, routes);

  return router;
}
