import { Schema, model, Document } from "mongoose";

export interface IPendingBvnVerification extends Document {
  bvn: string;
  user: Schema.Types.ObjectId;
  created: Date;
  reference: string;
}