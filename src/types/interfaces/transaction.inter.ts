import mongoose, { Document, Schema } from 'mongoose';
import { Iuser } from './user.inter';

export enum TransactionStatus {
    Failed = 'Failed',
    Successful = 'Successful',
}

export interface Itransaction extends Document {
    sender: Schema.Types.ObjectId | Iuser;
    recipient: Schema.Types.ObjectId | Iuser; 
    amount: number;
    type: string;
    paymentMethod: string;
    reference: string; 
    date: Date;
    status?: TransactionStatus[];
}
