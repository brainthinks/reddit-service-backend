import { generateRouterFromRoutes } from '../../controllers/utils';
import schema from './Newsletter.schema';
import routes from './Newsletter.routes';

const router = generateRouterFromRoutes(schema, routes);

export default router;
