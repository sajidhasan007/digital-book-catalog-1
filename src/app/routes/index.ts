import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BookRouter } from '../modules/book/book.router';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/book',
    route: BookRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
