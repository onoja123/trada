import mongoose, { Document, Schema } from 'mongoose';

export interface Contribution extends Document {
    users:  Schema.Types.ObjectId[];
    reason: string;
    amount: number;
    duration: number; // Duration in months, for example
    startDate: Date;
    endDate: Date;
}
