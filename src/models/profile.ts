import mongoose, { Document, Schema } from 'mongoose';
import { IProfile } from '../interfaces';

export interface IProfileModel extends IProfile, Document { }

const ProfileSchema: Schema = new Schema(
    {
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        apartment: {
            type: String,
        },
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        postalCode: {
            type: String,
        }
    },
    { timestamps: true },
);

export default mongoose.model<IProfileModel>('Profile', ProfileSchema);
