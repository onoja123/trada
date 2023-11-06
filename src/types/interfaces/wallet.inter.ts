import { Document, Schema } from "mongoose";

export interface Iwallet extends Document{
    _user: Schema.Types.ObjectId;
    amount: Number;
    currency: string;
    locked: Boolean;
    inflow: Number;
    outflow: Number;
    createdAt: Date;
}