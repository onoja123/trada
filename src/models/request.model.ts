import mongoose, { Document, Schema } from 'mongoose';
import { IRequest } from '../interfaces';

export interface IRequestModel extends IRequest, Document { }

const RequestSchema: Schema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Declined"],
            default: "Pending",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<IRequestModel>('Request', RequestSchema);
