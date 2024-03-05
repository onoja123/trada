import mongoose, { Document, Schema } from 'mongoose';
import { IOtp } from '../interfaces';
import { OtpType } from '../enums';

export interface IOtpModel extends IOtp, Document {}

const OtpSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: Object.values(OtpType),
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiration: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IOtpModel>('Otp', OtpSchema);
