import { Document, Schema } from 'mongoose';

export interface Iwallet extends Document {
    _user: Schema.Types.ObjectId;
    _transactions: Schema.Types.ObjectId[];
    balance: number;
    createdAt: Date;
}
