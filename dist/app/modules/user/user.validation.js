"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        phoneNumber: zod_1.z.string({ required_error: 'Phone is required' }),
        address: zod_1.z.string({ required_error: 'Address is required' }),
        email: zod_1.z.string().optional(),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
};
