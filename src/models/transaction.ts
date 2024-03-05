import mongoose, { Document, Schema } from 'mongoose';
import { ITransaction } from '../interfaces';
import { TransactionType, TransactionStatus } from '@/enums';

export interface ITransactionModel extends ITransaction, Document { }

const TransactionSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    reference: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      default: TransactionType.Debit,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
      required: true,
    },
    paymentMethod: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.Pending,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITransactionModel>('Transaction', TransactionSchema);
