import { z } from 'zod';

const createReviewkZodSchema = z.object({
  body: z.object({
    review: z.number({
      required_error: 'Review is required',
    }),
    comment: z.string({
      required_error: 'Comment is required',
    }),
  }),
});

export const ReviewValidation = {
  createReviewkZodSchema,
};
