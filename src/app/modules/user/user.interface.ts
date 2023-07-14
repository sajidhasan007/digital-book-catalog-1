/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  _id: string;
  name: string;
  role: string;
  password: string;
  phoneNumber: string;
  address: string;
  email?: string;
};

export type UserModel = {
  isUserExist(id: string): Promise<Pick<IUser, '_id' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
