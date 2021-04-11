import { generateRouterFromRoutes } from '../../controllers/utils';
import routes from './routes';

const router = generateRouterFromRoutes('auth', routes);

export default router;
