import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';
import { IUser } from '../user/user.interface';

export type IReview = {
  review: number;
  comment: string;
  user: Types.ObjectId | IUser;
  book: Types.ObjectId | IBook;
};

export type ReviewModel = Model<IReview, Record<string, unknown>>;
