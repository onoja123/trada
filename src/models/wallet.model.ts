import mongoose, { Document, Schema } from 'mongoose';
import { Iwallet } from '../types/interfaces/wallet.inter';

const walletSchema = new Schema<Iwallet>(
    {
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Assuming the reference model is 'User'
            required: true,
        },
        _transactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction', // Assuming the reference model is 'Transaction'
        }],
        balance: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Wallet = mongoose.model<Iwallet>('Wallet', walletSchema);

export default Wallet;
