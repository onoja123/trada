import mongoose, { Document, Schema } from 'mongoose';
import { IWallet } from '../interfaces';
import { AccountSchema } from './account';

export interface IWalletModel extends IWallet, Document { }

const WalletSchema: Schema = new Schema(
  {
    balance: {
      type: Number,
      required: true,
    },
    pin: {
      type: String,
    },
    accountDetails: AccountSchema,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IWalletModel>('Wallet', WalletSchema);
