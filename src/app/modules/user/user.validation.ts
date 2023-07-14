import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    password: z.string({ required_error: 'Password is required' }),
    phoneNumber: z.string({ required_error: 'Phone is required' }),
    address: z.string({ required_error: 'Address is required' }),
    email: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
