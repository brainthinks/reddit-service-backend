import {
  Route,
  RouteMethods,
} from '../../types';
import AuthenticationController from '../Authentication/controller';
import NewsletterController from './controller';

export default function getNewsletterRoutes (
  authenticationController: AuthenticationController,
  newsletterController: NewsletterController,
): Route[] {
  const routes: Route[] = [
    {
      method: RouteMethods.get,
      path: '/:newsletterId',
      middleware: [
        newsletterController.getOne.bind(newsletterController),
      ],
    },
    {
      method: RouteMethods.get,
      path: '/',
      middleware: [
        newsletterController.getMany.bind(newsletterController),
      ],
    },
    {
      method: RouteMethods.post,
      path: '/',
      middleware: [
        newsletterController.createOne.bind(newsletterController),
      ],
    },
    {
      method: RouteMethods.put,
      path: '/:newsletterId',
      middleware: [
        newsletterController.updateOne.bind(newsletterController),
      ],
    },
    {
      method: RouteMethods.patch,
      path: '/:newsletterId',
      middleware: [
        newsletterController.updateOne.bind(newsletterController),
      ],
    },
    {
      method: RouteMethods.delete,
      path: '/:newsletterId',
      middleware: [
        newsletterController.deleteOne.bind(newsletterController),
      ],
    },
  ];

  return routes;
}
