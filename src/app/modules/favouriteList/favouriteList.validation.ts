import { z } from 'zod';

const createFavouriteListkZodSchema = z.object({
  body: z.object({
    book: z.string({
      required_error: 'book is required',
    }),
  }),
});

export const FavouriteListValidation = {
  createFavouriteListkZodSchema,
};
