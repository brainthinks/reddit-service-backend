import {
  Routers,
} from '../controllers/types';
import UserRouter from './User/User.router';
import NewsletterRouter from './Newsletter/Newsletter.router';

const routers: Routers = [
  UserRouter,
  NewsletterRouter,
];

export default routers;
