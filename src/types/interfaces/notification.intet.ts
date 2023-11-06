import { Document, Schema } from "mongoose";

export interface Inotification extends Document{
    _user: Schema.Types.ObjectId;
    title: Number;
    message: string;
    action: String;
    target: String;
    view: Boolean;
    createdAt: Date;
}
