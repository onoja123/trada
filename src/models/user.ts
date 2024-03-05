import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../interfaces';
import { IProfileModel } from './profile';
import { IKycModel } from './kyc';

export interface IUserModel extends IUser, Document { }

const UserSchema: Schema = new Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    qrcode: {
      type: String,
    },
    image: {
      type: String,
    },
    tagNumber: {
      type: String,
    },
    bvn: {
      type: String,
    },
    password: {
      type: String,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      default: 'not-submitted',
      enum: ['not-submitted', 'pending', 'approved', 'rejected'],
    },
    isIdentityVerified: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },
    kyc: {
      type: Schema.Types.ObjectId,
      ref: 'Kyc',
    },
  },
  { timestamps: true },
);

// Create a new Profile document when a User is created
UserSchema.post('save', async function (doc, next) {
  if (!doc.profile) {
    const profile = await mongoose.model<IProfileModel>('Profile').create({});
    await this.updateOne({ profile: profile._id });
  }
  next();
});

// Create a new Kyc document when a User is created
UserSchema.post('save', async function (doc, next) {
  if (!doc.kyc) {
    const kyc = await mongoose.model<IKycModel>('Kyc').create({});
    await this.updateOne({ kyc: kyc._id });
  }
  next();
});

export default mongoose.model<IUserModel>('User', UserSchema);
