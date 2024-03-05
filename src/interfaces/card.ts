import { IUser } from './user';

export interface ICard {
  user: IUser;
  cardId: string;
  customerId: string;
  pan: string;
  expiry: string;
  brand: string;
  balance: number;
  active: boolean;
  channels: [
    {
      atm: boolean;
      pos: boolean;
      web: boolean;
      mobile: boolean;
    },
  ];
}
