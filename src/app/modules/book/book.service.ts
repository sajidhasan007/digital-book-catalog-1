import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
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
    .populate('user')
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);
  let total: number = await Book.countDocuments(whereConditions);
  if (andConditions.length === 0) {
    total = result.length;
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

const createBook = async (
  payload: IBook,
  user: JwtPayload | null
): Promise<IBook | null> => {
  const response = (
    await Book.create({ ...payload, user: user?.userId })
  ).populate('user');
  if (!response) {
    throw new ApiError(400, 'Faield to create');
  }
  return response;
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id).populate('user');
  return result;
};

const updateBook = async (
  id: string,
  user: JwtPayload | null,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  const book: IBook | null = await Book.findOne({ _id: id });
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  if (book?.user !== user?.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your are not elegible to update this book'
    );
  }

  const result = await Book.findOneAndUpdate(
    { _id: id, user: user?.userId },
    payload,
    {
      new: true,
    }
  );
  if (!result) {
    throw new ApiError(404, 'Failed to update Book');
  }
  return result;
};
const deleteBook = async (
  id: string,
  user: JwtPayload | null
): Promise<IBook | null> => {
  const book: IBook | null = await Book.findOne({ _id: id });
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  if (book?.user !== user?.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your are not elegible to delete this book'
    );
  }
  const result = await Book.findOneAndDelete({
    _id: id,
    user: user?.userId,
  });

  if (!result) {
    throw new ApiError(404, 'Failed to delete Book');
  }
  return result;
};

export const BookService = {
  createBook,
  getSingleBook,
  updateBook,
  getAllBook,
  deleteBook,
};
