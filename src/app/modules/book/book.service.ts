import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { filterFalsyValues } from '../../../shared/lib';
import { FavouriteList } from '../favouriteList/favouriteList.model';
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
  const { searchTerm, publicationDate, ...filtersData } = filters; // Add minPrice and maxPrice

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
  // const nonEmptyFilters = Object.entries(filtersData).reduce(
  //   (acc, [field, value]) => {
  //     if (value) {
  //       acc[field] = value;
  //     }
  //     return acc;
  //   },
  //   {}
  // );
  console.log(publicationDate);

  const NewFiltersData = filterFalsyValues(filtersData);

  if (Object.keys(NewFiltersData).length) {
    andConditions.push({
      $and: Object.entries(NewFiltersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // const publicationDate = '1945';

  if (publicationDate) {
    const year = parseInt(publicationDate); // Convert the publicationDate to an integer
    andConditions.push({
      $expr: {
        $eq: [{ $year: { $toDate: '$publicationDate' } }, year],
      },
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

const getSingleBook = async (
  id: string,
  token: string | undefined | null
): Promise<IBook | null> => {
  let verifiedUser = null;
  let isFavourite = null;
  console.log('my token is = ', token);
  if (token) {
    verifiedUser = jwtHelpers.verifyToken(
      token as string,
      config.jwt.secret as Secret
    );
    console.log('book', id, 'user', verifiedUser?.userId);
    if (verifiedUser) {
      isFavourite = await FavouriteList.findOne({
        book: id,
        user: verifiedUser?.userId,
      });
    }
  }
  // console.log('my favourite data is = ', isFavourite);

  const result: IBook | null = await Book.findById(id).populate('user');

  if (isFavourite) {
    // result = { ...result, isFavourite: true };
    // const updateResult = Book.findOneAndUpdate(
    //   { _id: id },
    //   { isFavourite: true },
    //   {
    //     new: true,
    //   }
    // );
    // console.log('my update result is = ', updateResult);
  }
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
