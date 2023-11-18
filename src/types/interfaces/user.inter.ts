import { Document, Schema } from "mongoose";

export interface Iuser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    pin: string;
    dateOfBirth: Date;
    gender: string;
    passwordConfirm: string;
    country: string;
    state: string;
    apartment: string;
    street: string;
    city: string;
    postalCode: number;
    image?: string | '';
    tagNumber: string;
    bvn : string
    accountDetails: {
        number: string;
        bankName: string;
        flwRef: string;
        orderRef: string;
        createdAt: Date;
      };
    isIdentityVerified: boolean;
    identityVerificationStatus: string;
    dateJoined: Date;
    isActive: boolean;
    isKycVerified: boolean;
    profileSet: boolean;
    isAdmin: boolean;
    wallet: Schema.Types.ObjectId[];
    kyc: Schema.Types.ObjectId[]; 
    verificationToken: string;
    verificationTokenExpires: Date;
    otp: string | null;
    resetPasswordToken: number;
    resetPasswordExpire: Date;
    verifyEmailToken: string;
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    generateAuthToken(): string;
    changedPasswordAfter(JWTTimestamp: any): boolean;
    matchTransactionPin(enteredPin: any): string;
    transactions: Schema.Types.ObjectId[]; 
    createdAt: Date;
}
