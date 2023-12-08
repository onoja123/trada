import { Document, Schema } from 'mongoose';

export interface Iwallet extends Document {
    _user: Schema.Types.ObjectId;
    _transactions: Schema.Types.ObjectId[];
    balance: number;
    account_number: string;
    bank_name: string;
    order_ref: string;
    flw_ref: string;
    createdAt: Date;
}
