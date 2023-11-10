import { Document, Schema } from "mongoose";

export interface Ikyc extends Document{
    _user: Schema.Types.ObjectId;
    govId: string;
    proofOfId: string;
    bvn: string;
    createdAt: Date;
}