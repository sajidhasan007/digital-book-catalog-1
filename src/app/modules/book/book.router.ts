import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookController } from './book.controller';
import { BookValidation } from './book.validation';

const router = express.Router();
router.get('/:id', BookController.getSingleBook);

router.patch(
  '/:id',
  validateRequest(BookValidation.updateBookZodSchema),
  BookController.updateBook
);
router.get('/', BookController.getAllBook);
router.delete('/:id', BookController.deleteBook);

router.post(
  '/create-cow',

  validateRequest(BookValidation.createBookZodSchema),
  BookController.createBook
);

export const BookRouter = router;
