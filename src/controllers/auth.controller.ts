import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import User from '../models/user.model';
import jwt from 'jsonwebtoken'; 
const { promisify } = require('util');
import { Iuser } from '../types/interfaces/user.inter';
import sendEmail from '../utils/sendEmail';
import otpGenerator from 'otp-generator';
import { Twilio } from "twilio";

const accountSid: string = process.env.TWILIO_ACCOUNT_SID|| '';
const authToken: string = process.env.TWILIO_AUTH_TOKEN || '';
const client = new Twilio(accountSid, authToken);


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
export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body;

  // Check for required fields
  if (!phone) {
    return res.status(401).send({
      success: false,
      message: 'Phone number is required',
    });
  }

  const existingNumber = await User.findOne({ phone });

  // Check if phone number exists
  if (existingNumber) {
    return res.status(400).json({
      success: false,
      message: 'The Phone number is already taken',
    });
  }

  const newUser = await User.create({
    phone
  });

  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  newUser.otp = otp;

  try {
    // Send OTP via Twilio
    const message = `Hi, thanks for signing up for TradaPay!🚀
    Your OTP ${otp} is, Enter this code to verify your account and 
    start exploring all that we have to offer.`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone, 
    });

    // If the OTP message was sent successfully, proceed to user creation
    await newUser.save({ validateBeforeSave: false });

    createSendToken(newUser, 201, res);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Couldn't create the user",
    });
  }
});


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
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check if email or phone and password exist
  const { email, phone, password } = req.body;

  // Check if either email or phone and password exist
  if ((!email && !phone) || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide either email or phone and password!',
    });
  }

  // Check if user exists and password is correct
  let user;
  if (email) {
    user = await User.findOne({ email }).select('+password');
  } else if (phone) {
    user = await User.findOne({ phone }).select('+password');
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User does not exist',
    });
  }

  if (user.isActive === false) {
    return res.status(400).json({
      success: false,
      message: 'Please verify your email or phone and try again.',
    });
  }

  if (!(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect email, phone, or password',
    });
  }

  createSendToken(user, 200, res);
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Resend verification otp to users email Controller
 * @route `/api/auth/resendverification`
 * @access Public
 * @type POST
 */

export const resendVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let user; // Declare user outside the try block

  try {
    user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account has already been verified',
      });
    }

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    await user.save({ validateBeforeSave: false });

    console.log(otp);

    const message = `
      Hi there ${user.firstname}!
      Here's a new code to verify your account.${otp}`;

    const emailSender = new sendEmail();

    await emailSender.sendTemplatedEmail({
      recipients: user.email,
      template: {
        name: 'Verification',
        subject: 'Verification Link 🚀!',
      },
      templateData: { message },
    });

    res.status(200).json({
      success: true,
      message: 'Verification link sent successfully!',
    });
  } catch (err) {
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Couldn't send the verification email. User not found.",
      });
    }

    user.otp = null;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: "Couldn't send the verification email",
    });
  }
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Forogot Password Controller
 * @route `/api/auth/forgotPassword`
 * @access Public
 * @type POST
 */

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user based on email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      console.log(`User not found for email: ${req.body.email}`);
      return res.status(404).json({
        success: false,
        message: 'There is no user with this email address',
      });
    }

    // Generate OTP
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Save OTP to the user
    user.otp = otp;
    await user.save({ validateBeforeSave: false });

    console.log(`Generated OTP for ${user.firstname}: ${otp}`);

    try {
      // Send email using the template
      const emailSender = new sendEmail();
      await emailSender.sendTemplatedEmail({
        recipients: user.email,
        template: {
          name: 'verification',
          subject: 'Verification Link 🚀!',
        },
        templateData: {
          user,
          otp,
        },
      });

      console.log(`Email sent successfully to ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Email sent successfully 🚀!',
      });
    } catch (err) {
      // Handle email sending error
      user.otp = null;
      await user.save({ validateBeforeSave: false });

      console.error('Error sending email:', err);

      return res.status(500).json({
        success: false,
        message: 'There was an error sending the email. Try again later!',
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    next(error); // Pass the error to the error handling middleware
  }
});



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