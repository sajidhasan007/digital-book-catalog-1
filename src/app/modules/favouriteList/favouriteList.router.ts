import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FavouriteListController } from './favouriteList.controller';
import { FavouriteListValidation } from './favouriteList.validation';

const router = express.Router();

router.get('/:id', FavouriteListController.getFavouriteList);

router.post(
  '/create-favourite',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(FavouriteListValidation?.createFavouriteListkZodSchema),
  FavouriteListController.createFavouriteList
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(FavouriteListValidation?.createFavouriteListkZodSchema),
  FavouriteListController.deleteFavouriteList
);

export const FavouriteListRouter = router;
