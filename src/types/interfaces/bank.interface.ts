import { Document, Schema } from "mongoose";

export interface IBank extends Document {
   user: Schema.Types.ObjectId[];
   account_name: string;
   account_number: number;
   account_bank: string;
   type: string;
   createdAt: Date;
}