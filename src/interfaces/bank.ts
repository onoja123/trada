import { IUser } from './user';

export interface IBank {
  bankName: string;
  accountNumber: number;
  accountName: string;
  default: boolean;
  type: string;
  user: IUser;
}
