import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.router';
import { BookRouter } from '../modules/book/book.router';
import { FavouriteListRouter } from '../modules/favouriteList/favouriteList.router';
import { ReviewRouter } from '../modules/review/review.router';
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
  {
    path: '/review',
    route: ReviewRouter,
  },
  {
    path: '/favourite-list',
    route: FavouriteListRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
