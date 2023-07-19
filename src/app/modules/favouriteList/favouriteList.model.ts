import { model, Schema } from 'mongoose';
import { FavouriteListModel, IFavouriteList } from './favouriteList.interface';

const FavouriteListSchema = new Schema<IFavouriteList>(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
  },
  { timestamps: true }
);

export const FavouriteList = model<IFavouriteList, FavouriteListModel>(
  'FavouriteList',
  FavouriteListSchema
);
