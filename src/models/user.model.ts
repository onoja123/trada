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
		unique: true,
		lowercase: true,
	},
    phone:{
		type: String,
	},
	password: {
		type: String,
		select: false,
	},
	pin: {
		type: String,
	},
	dateOfBirth: {
		type: Date
	},
	gender:{
		type: String
	},
	country: {
		type: String,
	},
	state:{
		type: String,
	},
	apartment:{
		type: String,
	},
	street: {
		type: String,
	},
	city:{
		type: String,
	},
	image: {
		type: String,
		default: '',
	},
	tagNumber:{
		type: String,
	},
	bvn:{
		type: String,
	},
	isIdentityVerified: {
		type: Boolean,
		default: false,
	  },
	  identityVerificationStatus: {
		type: String,
		default: "not-submited",
		enum: ["not-submited", "pending", "approved", "rejected"],
	  },	
	accountDetails: {
		type: Object,
		default: null,
	  },
	isActive: {
		type: Boolean,
		required: true,
		default: false,
	},
	dateJoined:{
		type: Date,
		defualt: Date.now()
	},	
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
	isKycVerified:{
		type: Boolean,
		required: true,
		default: false,
	},
	profileSet: {
		type: Boolean,
		required: true,
		default: false,
	},
	wallet: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Wallet',
			required: true,
		}
	],
	kyc: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Kyc',
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
        type: String,
    },
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	verifyEmailToken: {
		type: String,
		select: false,
	},
	transactions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Transaction',
			required: true,
		}
	],
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

// Match user entered password to hashed password in database
userSchema.methods.matchTransactionPin = function (enteredPin: any) {
	return bcrypt.compare(enteredPin, this.pin);
  };
  
const User = mongoose.model<Iuser>('User', userSchema)

export default User;


// export const verifyUserBvn = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { reference } = req.params;
  
//       if (!reference) {
//         return res.status(400).json({
//           success: false,
//           message: 'Reference is required',
//         });
//       }

//       console.log(reference);
  
//       const bvnFromReference = await verifyBvn(reference);
  
//       if (!bvnFromReference) {
//         return res.status(404).json({
//           success: false,
//           message: 'BVN not found for the given reference',
//         });
//       }
//             console.log(bvnFromReference);
//       if (!req.user) {
//         return next(new AppError(
//             'User not authenticated', 
//             401
//         ));
//     }

//       // Find the user by their _id
//       const user = await User.findOne({ _id: req.user._id });
  
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: 'User not found',
//         });
//       }
  
//       // Save BVN information in the KYC model
//       const kyc = await Kyc.create({
//         _user: user,
//         bvn: bvnFromReference,
//         firstname: user.firstname, // Add the appropriate fields from the user model
//         lastname: user.lastname, // Add the appropriate fields from the user model
//         status: true,
//       });
  
//       // Update user's bvnAttached field
//       user.isKycVerified = true;
  
//       // Save the updated user
//       await user.save();
  
//       // Log to check if BVN was added
//       console.log(`BVN added to user ${user._id}: ${bvnFromReference}`);
  
//       // Respond with success message
//       return res.status(200).json({
//         success: true,
//         message: 'BVN verified successfully',
//         data: kyc,
//       });
  
//     } catch (error) {
//       console.error('Error in BVN verification:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//       });
//     }
//   };