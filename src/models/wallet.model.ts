import mongoose, { Document, Schema } from "mongoose";
import { Iwallet } from "../types/interfaces/wallet.inter";

const walletSchema = new Schema<Iwallet>({
    _user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      },
      _transaction: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      },
      balance: {
        type: Number,
        defaul: 0
    },
      amount: {
          type: Number,
          default: 0
        },
      currency: {
        type: String,
        default: 'naira'
      },
  
      locked: {
        type: Boolean,
        default: false
      },
      inflow: {
        type: Number,
        default: 0
      },
      outflow: {
        type: Number,
        default: 0
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
    },  
);

const Wallet = mongoose.model<Iwallet>('Wallet', walletSchema)

export default Wallet;