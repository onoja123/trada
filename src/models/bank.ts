import mongoose, { Document, Schema } from 'mongoose';
import { IBank } from '../interfaces';

export interface IBankModel extends IBank, Document { }

const BankSchema: Schema = new Schema(
  {
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    default: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["personal", "beneficiary"],
      default: "personal",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IBankModel>('Bank', BankSchema);
