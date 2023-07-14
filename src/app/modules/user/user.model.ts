/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { IUser, UserModel } from './user.interface';

const UserSchema = new Schema<IUser, UserModel>(
  {
    _id: {
      type: String,

      default: () => uuidv4(),
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ENUM_USER_ROLE },
    password: { type: String, required: true, select: 0 },
    address: { type: String, required: true },
    email: { type: String },
  },
  { timestamps: true }
);

UserSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, '_id' | 'password' | 'role'> | null> {
  return await User.findOne({ phoneNumber });
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// will work for crate and seve methods
UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );

  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
