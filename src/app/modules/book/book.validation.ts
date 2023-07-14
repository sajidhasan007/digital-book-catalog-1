import { z } from 'zod';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    author: z.string({
      required_error: 'Author is required',
    }),
    genre: z.string({
      required_error: 'Genre is required',
    }),
    publicationDate: z.string({
      required_error: 'Publication date is required',
      invalid_type_error: 'Enter a valid date',
    }),
  }),
});

const updateBookZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .optional(),
    author: z
      .string({
        required_error: 'Author is required',
      })
      .optional(),
    genre: z
      .string({
        required_error: 'Genre is required',
      })
      .optional(),
    publicationDate: z
      .string({
        required_error: 'Publication date is required',
        invalid_type_error: 'Enter a valid date',
      })
      .optional(),
  }),
});

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
};
