import mongoose, { Document, Schema } from 'mongoose';
import { IKyc } from '../interfaces';

export interface IKycModel extends IKyc, Document { }

const KycSchema: Schema = new Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        govId: {
            type: String,
            required: true,
        },
        proof_of_id: {
            type: String,
            enum: ["passport", "nin", "drivers_license"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<IKycModel>('Kyc', KycSchema);
