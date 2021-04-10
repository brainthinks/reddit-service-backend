import {
  Routes,
  RouteMethods,
} from '../../controllers/types';
import {
  getOne,
  getMany,
  createOne,
  updateOne,
  deleteOne,
} from './Newsletter.controller';

const routes: Routes = [
  {
    method: RouteMethods.get,
    path: '/:newsletterId',
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
    path: '/',
    middleware: [
      createOne,
    ],
  },
  {
    method: RouteMethods.put,
    path: '/:newsletterId',
    middleware: [
      updateOne,
    ],
  },
  {
    method: RouteMethods.patch,
    path: '/:newsletterId',
    middleware: [
      updateOne,
    ],
  },
  {
    method: RouteMethods.delete,
    path: '/:newsletterId',
    middleware: [
      deleteOne,
    ],
  },
];

export default routes;
