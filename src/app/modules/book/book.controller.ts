import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendReponse from '../../../shared/sendResponse';
import { bookFilterableFields } from './book.constant';
import { IBook } from './book.interface';
import { BookService } from './book.service';
const getAllBook: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paginationOptions = pick(req.query, paginationFields);
    const filters = pick(req.query, bookFilterableFields);
    const result = await BookService.getAllBook(paginationOptions, filters);
    sendReponse<IBook[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrive successfully!',
      meta: result?.meta,
      data: result?.data,
    });
    next();
  }
);

const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Book = req.body;
    const result = await BookService.createBook(Book);
    sendReponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book created successfully!',
      data: result,
    });
    next();
  }
);

const getSingleBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await BookService.getSingleBook(id);

    sendReponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrive successfully!',
      data: result,
    });
    next();
  }
);

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const sellerId = req.headers.authorization;

  const result = await BookService.updateBook(id, sellerId, updatedData);

  sendReponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully !',
    data: result,
  });
});
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = req.headers.authorization;

  const result = await BookService.deleteBook(id, token);

  sendReponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book delete successfully !',
    data: result,
  });
});
export const BookController = {
  createBook,
  getSingleBook,
  updateBook,
  getAllBook,
  deleteBook,
};
