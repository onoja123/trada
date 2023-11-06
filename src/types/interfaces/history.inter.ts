import { Document, Schema } from "mongoose";

export interface Ihistory extends Document{
    _user: Schema.Types.ObjectId;
    _wallet: Schema.Types.ObjectId;
    date: Date;
    amount: Number;
    bank: Boolean;
    reference: String;
    detail: String;
    from: String;
    status: String;
    initor: String;
    createdAt: Date;
}