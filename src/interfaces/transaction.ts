import { TransactionStatus, TransactionType } from "@/enums";
import { IUser } from "./user";

export interface ITransaction {
  title: string;
  recipient?: IUser;
  reference: string;
  type: TransactionType;
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
  sender: IUser;
}

export interface TransactionResponse {
  transactions: ITransaction[];
  totalAmount: number;
}