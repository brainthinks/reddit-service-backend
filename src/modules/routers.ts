import {
  Routers,
} from '../controllers/types';
import { Logger } from '../logger';
import UserRouter from './User/router';
import NewsletterRouter from './Newsletter/router';
import AuthenticationRouter from './Authentication/router';

export default function getRouters (logger: Logger) {
  const routers: Routers = [
    UserRouter,
    NewsletterRouter,
    AuthenticationRouter,
  ];

  return routers;
}
