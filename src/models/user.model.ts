import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Iuser } from "../types/interfaces/user.inter";

const userSchema = new Schema<Iuser>({
	firstname: {
		type: String,
	},
	lastname:{
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		select: false,
	},
    phone:{
		type: String,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	image: {
		type: String,
		default: '',
	},
	isActive: {
		type: Boolean,
		required: true,
		default: false,
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
		select: false,
	},
	wallet: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Wallet',
			required: true,
		}
	],
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },
    otp: {
        type: Number,
    },
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	verifyEmailToken: {
		type: String,
		select: false,
	},
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
	  // Only hash the password if it's modified (new or changed)
	  return next();
	}
  
	try {
	  const hashedPassword = await bcrypt.hash(this.password, 12);
	  this.password = hashedPassword;
	} catch (error) {
	  // Handle the error, e.g., log it or return it
	  console.log(error);
	  // Pass the error to the next middleware or route handler
	  return next();
	}
  
	next(); // Call next to continue the middleware chain
  });
  

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY || '', {
      expiresIn: process.env.JWT_EXPIRES_IN || '',
    });
    return token;
};

userSchema.methods.correctPassword = async function(
    candidatePassword: string,
    userPassword: string
){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: any) {
    if (this.passwordChangedAt) {
      const changedTimestamp = String(
        this.passwordChangedAt.getTime() / 1000
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

const User = mongoose.model<Iuser>('User', userSchema)

export default User;