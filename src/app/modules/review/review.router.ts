import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.get('/:id', auth(ENUM_USER_ROLE.USER), ReviewController.getReview);

router.post(
  '/create-review',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(ReviewValidation?.createReviewkZodSchema),
  ReviewController.createReview
);

export const ReviewRouter = router;
