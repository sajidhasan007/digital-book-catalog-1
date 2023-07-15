import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendReponse from '../../../shared/sendResponse';
import { IReview } from './review.interface';
import { ReviewService } from './review.service';

const getReview: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paginationOptions = pick(req.query, paginationFields);
    const bookId = req.params.id;
    const result = await ReviewService.getAllReview(paginationOptions, bookId);
    sendReponse<IReview[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review retrive successfully!',
      meta: result?.meta,
      data: result?.data,
    });
    next();
  }
);

const createReview: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Book = req.body;
    const result = await ReviewService.createReview(Book, req.user);

    sendReponse<IReview>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review created successfully!',
      data: result,
    });
    next();
  }
);

export const ReviewController = {
  createReview,
  getReview,
};
