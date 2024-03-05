import mongoose, { Document, Schema } from 'mongoose';
import { INotification } from '../interfaces';

export interface INotificationModel extends INotification, Document { }

const NotificationSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        action: {
            type: Number,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        target: {
            type: String,
            default: false,
        },
        view: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<INotificationModel>('Notification', NotificationSchema);
