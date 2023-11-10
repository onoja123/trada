import { Document, Schema } from "mongoose";

export interface Iwallet extends Document{
    _user: Schema.Types.ObjectId;
    _transaction: Schema.Types.ObjectId;
    balance: Number;
    amount: Number;
    currency: string;
    locked: Boolean;
    inflow: Number;
    outflow: Number;
    createdAt: Date;
}