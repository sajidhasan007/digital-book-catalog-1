import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookController } from './book.controller';
import { BookValidation } from './book.validation';

const router = express.Router();
router.get('/:id', BookController.getSingleBook);

router.patch(
  '/:id',
  validateRequest(BookValidation.updateBookZodSchema),
  auth(ENUM_USER_ROLE.USER),
  BookController.updateBook
);
router.get('/', BookController.getAllBook);
router.delete('/:id', auth(ENUM_USER_ROLE.USER), BookController.deleteBook);

router.post(
  '/create-book',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(BookValidation.createBookZodSchema),
  BookController.createBook
);

export const BookRouter = router;
