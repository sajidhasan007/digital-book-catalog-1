import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters } from './book.interface';
import { Book } from './book.model';

// import httpStatus from "http-status";

const getAllBook = async (
  pagination: IPaginationOptions,
  filters: IBookFilters
): Promise<IGenericResponse<IBook[]>> => {
  // sortOrder;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);
  const { searchTerm, ...filtersData } = filters; // Add minPrice and maxPrice

  const sortOptions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortOptions[sortBy] = sortOrder;
  }

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .populate('seller')
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);
  const total = await Book.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createBook = async (payload: IBook): Promise<IBook | null> => {
  const response = (await Book.create(payload)).populate('seller');
  if (!response) {
    throw new ApiError(400, 'Faield to create');
  }
  return response;
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id).populate('seller');
  return result;
};

const updateBook = async (
  id: string,
  sellerId: string | undefined,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      sellerId as string,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  const isExist = await Book.findOne({ _id: id, seller: verifiedToken.userId });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  const result = await Book.findOneAndUpdate(
    { _id: id, seller: verifiedToken.userId },
    payload,
    {
      new: true,
    }
  );
  return result;
};
const deleteBook = async (
  id: string,
  sellerId: string | undefined
): Promise<IBook | null> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      sellerId as string,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const isExist = await Book.findOne({ _id: id, seller: verifiedToken.userId });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }
  const book = await Book.findOneAndDelete({
    _id: id,
    seller: verifiedToken.userId,
  });

  if (!book) {
    throw new ApiError(404, 'Failed to delete Book');
  }
  return book;
};

export const BookService = {
  createBook,
  getSingleBook,
  updateBook,
  getAllBook,
  deleteBook,
};
