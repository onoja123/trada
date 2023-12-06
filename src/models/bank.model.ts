import mongoose, { Document, Schema } from 'mongoose';
import { IBank } from '../types';

const bankSchema = new Schema<IBank>(
    {
        user: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        account_name: {
            type: String,
            required: true,
        },
        account_number: {
            type: Number,
            required: true,
        },
        account_bank: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Bank = mongoose.model<IBank>('Bank', bankSchema);

export default Bank;
