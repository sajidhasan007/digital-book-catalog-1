import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IFavouriteList } from './favouriteList.interface';
import { FavouriteList } from './favouriteList.model';

const getAllFavouriteList = async (
  pagination: IPaginationOptions,
  userId: string
): Promise<IGenericResponse<IFavouriteList[]>> => {
  // sortOrder;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);

  const sortOptions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortOptions[sortBy] = sortOrder;
  }

  const result = await FavouriteList.find({ user: userId })
    .populate('user')
    .populate('book')
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);
  const total: number = result?.length;

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Book found');
  }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createFavouriteList = async (
  payload: IFavouriteList,
  user: JwtPayload | null
): Promise<IFavouriteList | null> => {
  const isExist = await FavouriteList.findOne({
    user: user?.userId,
    book: payload?.book,
  });

  if (isExist) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Duplicate FavouriteList in not allow'
    );
  }
  const response = await FavouriteList.create({
    ...payload,
    user: user?.userId,
  });
  if (!response) {
    throw new ApiError(400, 'Faield to add');
  }
  return response;
};

const deleteFavouriteList = async (
  payload: IFavouriteList,
  user: JwtPayload | null
): Promise<IFavouriteList | null> => {
  const isExist = await FavouriteList.findOne({
    user: user?.userId,
    book: payload?.book,
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Book found');
  }
  const response = await FavouriteList.findOneAndDelete({
    book: payload?.book,
  });
  if (!response) {
    throw new ApiError(400, 'Faield to delete');
  }
  return response;
};

export const FavouriteListService = {
  createFavouriteList,
  getAllFavouriteList,
  deleteFavouriteList,
};
