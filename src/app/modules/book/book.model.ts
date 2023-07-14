import { model, Schema } from 'mongoose';
import { BookModel, IBook } from './book.interface';

const cowSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publicationDate: { type: String, required: true },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Book = model<IBook, BookModel>('Book', cowSchema);
