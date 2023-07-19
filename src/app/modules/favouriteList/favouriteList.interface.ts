import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';
import { IUser } from '../user/user.interface';

export type IFavouriteList = {
  user?: string | IUser;
  book: Types.ObjectId | IBook;
};

export type FavouriteListModel = Model<IFavouriteList, Record<string, unknown>>;
