import { IUser } from './user';

export interface AuthInterface {
  user: IUser;
  accessToken: string;
}
