import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import User from '../models/user.model';
import jwt from 'jsonwebtoken'; 
const { promisify } = require('util');
import { Iuser } from '../types/interfaces/user.inter';
import sendEmail from '../utils/sendEmail';
import otpGenerator from 'otp-generator';
import twilio from 'twilio';

// const accountSid = 'YOUR_TWILIO_ACCOUNT_SID' || ''
// const authToken = 'YOUR_TWILIO_AUTH_TOKEN' || ''
// const client = new twilio(accountSid, authToken);


declare global {
    namespace Express {
      interface Request {
        user?: Iuser;
      }
    }
  }
const signToken = (id: string): string => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY || '', {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
  
  
const createSendToken = (user: Iuser, statusCode: number, res: Response): void => {
    const token = signToken(user._id);
  
    const expiresIn =
      process.env.JWT_COOKIE_EXPIRES_IN &&
      Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000;
  
    const cookieOptions: { [key: string]: any } = {
      expiresIn: expiresIn ? new Date(Date.now() + expiresIn) : undefined,
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.status(statusCode).cookie('jwt', token, cookieOptions).json({
      success: true,
      token,
      data: {
        user,
      },
    });
  };
  
// /**
//  * @author Okpe Onoja <okpeonoja18@gmail.com>
//  * @description Signup  Controller
//  * @route `/api/auth/signup`
//  * @access Public
//  * @type POST
//  */
// export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const { phone } = req.body;

//   // Check for required fields
//   if (!phone) {
//     return res.status(401).send({
//       success: false,
//       message: 'Phone number is required',
//     });
//   }

//   const existingNumber = await User.findOne({ phone });

//   // Check if phone number exists
//   if (existingNumber) {
//     return res.status(400).json({
//       success: false,
//       message: 'The Phone number is already taken',
//     });
//   }

//   const newUser = await User.create({
//     phone,
//     otp: '1234',
//   });

//   const otp = otpGenerator.generate(4, {
//     upperCaseAlphabets: false,
//     specialChars: false,
//     lowerCaseAlphabets: false,
//   });

//   newUser.otp = otp;

//   try {
//     // Send OTP via Twilio
//     const message = `Hi there, Welcome to Trada 🚀
//     Before doing anything, we recommend verifying your account to use most of the features available,
//     here is your OTP verification code: ${otp}`;

//     await client.messages.create({
//       body: message,
//       from: 'YOUR_TWILIO_PHONE_NUMBER',
//       to: phone, // User's phone number
//     });

//     // If the OTP message was sent successfully, proceed to user creation
//     await newUser.save({ validateBeforeSave: false });

//     createSendToken(newUser, 201, res);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       success: false,
//       message: "Couldn't create the user",
//     });
//   }
// });


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Verify Users Email Controller
 * @route `/api/auth/verify`
 * @access Public
 * @type POST
 */

export const verify = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { otpCode } = req.body;

    if (!otpCode) {
      return res.status(401).send({
        success: false,
        message: 'Please provide an otp code',
      });
    }

    const user = await User.findOne({ otp: otpCode });
    
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'This otp code has expired or is invalid',
      });
    }
  
    if (user.isActive === true) {
      user.otp = null;
      return res.status(400).send({
        success: false,
        message: 'Your account has already been verified..',
      });
    }
  
    //then change the user's status to active
    user.isActive = true;
    user.isAdmin = true;
  
    user.otp = null;
  
    await user.save({ validateBeforeSave: false });
  
    createSendToken(user, 200, res);
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Login in User Controller
 * @route `/api/auth/login`
 * @access Public
 * @type POST
 */

export const login = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
      // Check if user and password exist
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return res.status(400).send({
      success: false,
      message: 'Please provide email and password!', 
    });
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User does not exist',
    });
  }

  if (user.isActive === false) {
    return res.status(400).json({
      success: false,
      message: 'Please verify your email and try again.',
    });
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).send({
      success: false,
      message: 'Incorrect email or password', 
    });
    
  }


  createSendToken(user, 200, res);
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Resend verification otp to users email Controller
 * @route `/api/auth/resendverification`
 * @access Public
 * @type POST
 */

export const resendVerification = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  
    if (user.isActive === true) {
      return res.status(400).json({
        success: false,
        message: 'Account has already been verified',
      });
    }
  
  const otp = (user.otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  }));
  await user.save({ validateBeforeSave: false });

    console.log(otp)
    const message = `
      Hi there ${user.firstname}!
      Here's a new code to verify your account.${otp}`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verification Link 🚀!',
        message,
      });
      res.status(200).json({
        success: true,
        message: 'Verification link sent successfully!',
      });
    } catch (err) {
      user.otp = null;
      await user.save({ validateBeforeSave: false });
  
      return res.status(500).json({
        success: false,
        message: "Couldn't send the verification email",
      });
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Forogot Password Controller
 * @route `/api/auth/forgotPassword`
 * @access Public
 * @type POST
 */

export const forgotPassword = catchAsync(async(req:Request, res:Response, next: NextFunction) => {
  //Get user based on email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'There is no user with this email address',
    });
  }

  const otp = (user.otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  }));
  await user.save({ validateBeforeSave: false });

  console.log(otp);

  const message = `
    Hi ${user.firstname}
    We heard you are having problems with your password.
    here is your otp vefication code ${otp}
    Otp expires in 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Forgot password',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Email sent sucessfully 🚀!',
    });
  } catch (err) {
    user.otp = null;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: 'There was an error sending the email. Try again later!',
    });
  }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Reset Password Controller
 * @route `/api/auth/resetpassword`
 * @access Public
 * @type POST
 */

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {

    // Get user based on the token
    const { otpCode } = req.body;

    if (!otpCode) {
      return res.status(401).json({
        success: false,
        message: 'Please provide an otp code',
      });
    }

    const user = await User.findOne({ otp: otpCode });


    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This otp code has expired or is invalid',
      });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.otp = null;


    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: 'An error occurred while resetting the password',
    });
  }
});



export const logOut = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
})

export const protect = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in! Please log in to get access.",
      });
    }
  
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
  
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token does no longer exist.",
      });
    }
  
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: "User recently changed password, please login again!",
      });
    }
  
    req.user = currentUser;
    next();
})