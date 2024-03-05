import mongoose, { Document, Schema } from 'mongoose';
import { IContribution } from '../interfaces';

export interface IContributionModel extends IContribution, Document { }

const ContributionSchema: Schema = new Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        reason: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<IContributionModel>('Contribution', ContributionSchema);
