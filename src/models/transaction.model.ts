import mongoose, { Document, Schema } from "mongoose";
import { Itransaction } from "../types/interfaces/transaction";

const transactionSchema = new Schema<Itransaction>({
	date: {
		type: Date,
		default: Date.now,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	bank: {
		type: String,
	},
    reference: {
		type: String,
	},
    detail: {
		type: String,
	},
	from: {
		type: String,
	},
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;