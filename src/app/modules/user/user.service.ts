import { ENUM_USER_ROLE } from '../../../enums/user';
import { IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (user: IUser): Promise<IUser | null> => {
  // If password is not given,set default password

  user.role = ENUM_USER_ROLE.USER;

  let newUserAllData = null;

  const newUser: IUser = await User.create(user);

  if (newUser) {
    newUserAllData = await User.findOne({ _id: newUser._id });
  }

  return newUserAllData;
};

export const UserService = {
  createUser,
};
