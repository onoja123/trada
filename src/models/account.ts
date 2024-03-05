import mongoose from 'mongoose';
import { IAccount } from '@/interfaces';

export const AccountSchema = new mongoose.Schema<IAccount>({
  account_number: {
    type: String,
  },
  account_bank: {
    type: String,
  },
  flwRef: {
    type: String,
  },
  orderRef: {
    type: String,
  }
});