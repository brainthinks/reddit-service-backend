import {
  Routes,
  RouteMethods,
} from '../../controllers/types';
import {
  login,
  logout,
} from './controller';

const routes: Routes = [
  {
    method: RouteMethods.post,
    path: '/login',
    middleware: [
      login,
    ],
  },
  {
    method: RouteMethods.post,
    path: '/logout',
    middleware: [
      logout,
    ],
  },
];

export default routes;
