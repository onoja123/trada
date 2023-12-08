import mongoose, { Schema } from 'mongoose';
import { Iwallet } from '../types/interfaces/wallet.inter';

const walletSchema = new Schema<Iwallet>(
    {
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        _transactions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        }],
        balance: {
            type: Number,
            default: 0,
        },
        account_number: {
            type: String,
        },
        bank_name: {
            type: String,
        },
        order_ref: {
            type: String,
        },
        flw_ref: {
            type: String,
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
