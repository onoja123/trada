import mongoose, { Document, Schema } from "mongoose";
import { Itransaction } from "../types/interfaces/transaction.inter";

const transactionSchema = new Schema<Itransaction>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    reference: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Transaction = mongoose.model<Itransaction> ('Transaction', transactionSchema);

export default Transaction;
