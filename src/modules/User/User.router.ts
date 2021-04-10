import { generateRouterFromRoutes } from '../../controllers/utils';
import schema from './User.schema';
import routes from './User.routes';

const router = generateRouterFromRoutes(schema, routes);

export default router;
