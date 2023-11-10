import { Document, Schema } from "mongoose";

export interface Itransaction extends Document{
    _user: Schema.Types.ObjectId;
    _wallet: Schema.Types.ObjectId;
    date: Date;
    amount: Number;
    bank: string;
    reference: String;
    detail: String;
    from: String;
    status: String;
    initor: String;
    createdAt: Date;
}
