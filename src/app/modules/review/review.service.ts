import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IReview } from './review.interface';
import { Review } from './review.model';

const getAllReview = async (
  pagination: IPaginationOptions,
  bookId: string
): Promise<IGenericResponse<IReview[]>> => {
  // sortOrder;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);

  const sortOptions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortOptions[sortBy] = sortOrder;
  }

  const result = await Review.find({ book: bookId })
    .populate('user')
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);
  const total: number = result?.length;

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
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

const createReview = async (
  payload: IReview,
  user: JwtPayload | null
): Promise<IReview | null> => {
  const isExist = await Review.findOne({
    user: user?.userId,
    book: payload?.book,
  });

  if (isExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Duplicate review in not allow');
  }
  const response = (
    await Review.create({ ...payload, user: user?.userId })
  ).populate('user');
  if (!response) {
    throw new ApiError(400, 'Faield to create');
  }
  return response;
};

export const ReviewService = {
  createReview,
  getAllReview,
};
