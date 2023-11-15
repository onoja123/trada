import mongoose, { Document, Schema } from 'mongoose';
import { Contribution } from '../types/interfaces/contribution.inter';

const contributionSchema = new Schema<Contribution>(
    {
        users: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User', // Assuming you have a User model
                    required: true,
                },
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
    { timestamps: true }
);

const Contribution = mongoose.model<Contribution>('Contribution', contributionSchema);

export default Contribution;