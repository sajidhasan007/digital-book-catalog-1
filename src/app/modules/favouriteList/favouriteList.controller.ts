import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendReponse from '../../../shared/sendResponse';
import { IFavouriteList } from './favouriteList.interface';
import { FavouriteListService } from './favouriteList.service';

const getFavouriteList: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paginationOptions = pick(req.query, paginationFields);
    const bookId = req.params.id;
    const result = await FavouriteListService.getAllFavouriteList(
      paginationOptions,
      bookId
    );
    sendReponse<IFavouriteList[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'FavouriteList retrive favourite list!',
      meta: result?.meta,
      data: result?.data,
    });
    next();
  }
);

const createFavouriteList: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Book = req.body;
    const result = await FavouriteListService.createFavouriteList(
      Book,
      req.user
    );

    sendReponse<IFavouriteList>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Favourite listService created successfully!',
      data: result,
    });
    next();
  }
);

const deleteFavouriteList: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Book = req.body;
    const result = await FavouriteListService.deleteFavouriteList(
      Book,
      req.user
    );

    sendReponse<IFavouriteList>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Favourite listService created successfully!',
      data: result,
    });
    next();
  }
);

export const FavouriteListController = {
  createFavouriteList,
  getFavouriteList,
  deleteFavouriteList,
};
