import { IUser } from './user';

export interface IAccount {
  account_number: string;
  account_bank: string;
  flwRef: string;
  orderRef: string;
}

export interface IWallet {
  balance: number;
  user: IUser;
  pin: string;
  account?: IAccount;
}

export interface IContribution {
  users: IUser[];
  reason: string;
  amount: number;
  duration: number;
  startDate: Date;
  endDate: Date;
}