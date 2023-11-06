import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Inotification } from "../types/interfaces/notification.intet";

const notificationSchema = new Schema<Inotification>({
    _user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      },
    title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      action: {
        type: String,
        required: false
      },
      target: {
        type: String,
        required: false
      },
      view: {
        type: Boolean,
        required: true,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
    },  
);

const Notification = mongoose.model<Inotification>('Notification', notificationSchema)

export default Notification;