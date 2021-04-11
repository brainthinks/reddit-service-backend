import { Logger } from '../logger';
import UserService from './User/service';
// import NewsletterService from './Newsletter/service';
// import AuthenticationService from './Authentication/service';

export default function createServices (logger: Logger, db: any) {
  const userService = UserService(logger, db).factory();
  // const newsletterService = NewsletterService.asSingleton();
  // const authenticationService = AuthenticationService.asSingleton();

  const services = [
    userService,
    // newsletterService,
    // authenticationService,
  ];

  return services;
}
