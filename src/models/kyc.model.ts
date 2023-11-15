import mongoose, { Document, Schema } from "mongoose";
import { Ikyc } from "../types/interfaces/kyc.inter";

const kycSchema = new Schema<Ikyc>(
  {
      _user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'user',
          required: true,
      },
      firstname: {
          type: String,
      },
      lastname: {
          type: String,
      },
      govId: {
          type: String,
      },
      proofOfId: {
          type: String,
      },
      bvn: {
          type: String,
      },
      createdAt: {
          type: Date,
          default: Date.now,
      },
  },
  {
      timestamps: true,
  }
);


const Kyc = mongoose.model<Ikyc>('Kyc', kycSchema)

export default Kyc;