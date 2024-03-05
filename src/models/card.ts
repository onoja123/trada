import mongoose, { Document, Schema } from 'mongoose';
import { ICard } from '../interfaces';

export interface ICardModel extends ICard, Document {}

const CardSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
    },
    currency: {
      type: String,
    },
    pan: {
      type: String,
      required: true,
      unique: true,
    },
    expiry: {
      type: String,
    },
    brand: {
      type: String,
    },
    balance: {
      type: Number,
      required: false,
      default: 0,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    channels: [
      {
        atm: {
          type: Boolean,
          required: true,
          default: true,
        },
        pos: {
          type: Boolean,
          required: true,
          default: true,
        },
        web: {
          type: Boolean,
          required: true,
          default: true,
        },
        mobile: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<ICardModel>('Card', CardSchema);
