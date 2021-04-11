import {
  Routes,
  RouteMethods,
} from '../../controllers/types';
import {
  getOne,
  getMany,
  signUp,
  createOne,
  updateOne,
  deleteOne,
} from './controller';

const routes: Routes = [
  {
    method: RouteMethods.get,
    path: '/:userId',
    middleware: [
      getOne,
    ],
  },
  {
    method: RouteMethods.get,
    path: '/',
    middleware: [
      getMany,
    ],
  },
  {
    method: RouteMethods.post,
    path: '/signUp',
    middleware: [
      signUp,
    ],
  },
  {
    method: RouteMethods.post,
    path: '/',
    middleware: [
      createOne,
    ],
  },
  {
    method: RouteMethods.put,
    path: '/:userId',
    middleware: [
      updateOne,
    ],
  },
  {
    method: RouteMethods.patch,
    path: '/:userId',
    middleware: [
      updateOne,
    ],
  },
  {
    method: RouteMethods.delete,
    path: '/:userId',
    middleware: [
      deleteOne,
    ],
  },
];

export default routes;
