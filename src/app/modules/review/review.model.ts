import { model, Schema } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const cowSchema = new Schema<IReview>(
  {
    review: { type: Number, required: true },
    comment: { type: String, required: true },

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

export const Review = model<IReview, ReviewModel>('Review', cowSchema);
