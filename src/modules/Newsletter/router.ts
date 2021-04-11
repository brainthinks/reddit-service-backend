import { generateRouterFromRoutes } from '../../controllers/utils';
import schema from './schema';
import routes from './routes';

const router = generateRouterFromRoutes(schema.pluralName, routes);

export default router;
