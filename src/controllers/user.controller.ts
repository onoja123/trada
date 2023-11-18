import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import bcrypt from "bcrypt";
import User from '../models/user.model';
import Kyc from '../models/kyc.model'
import qrcode from 'qrcode';
import generateTagNumber from '../utils/tagGen';
import { Iuser } from "../types/interfaces/user.inter";
import {
  BvnVerificationResponse,
  initateBvn,
  verifyBvn
}from '../services/kyc.service'
import { createVirtualAccountNumber } from '../services/payment.service';

declare global {
    namespace Express {
      interface Request {
        user?: Iuser;
      }
    }
  }



/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Get user profile
 * @route `/api/user/getprofile`
 * @access PRIVATE
 * @type GET
 */
export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.user) {
        return next(new AppError(
            'User not authenticated', 
            401
        ));
    }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
          return next(new AppError(
              'User not not found', 
              404
          ));
      }

        res.status(200).json({
            status: 'success',
            data: {
                user, 
            },
        });
    } catch (error) {
        next(new AppError(
          'Internal server error', 
          500
      ));
    }
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Setup residence address
 * @route `/api/user/setaddress`
 * @access PRIVATE
 * @type PUT
 */
export const setResiAdd = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return next(new AppError(
              'User not authenticated', 
              401
          ));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if(!user){
          console.log('User not found');
            return next(new AppError(
              'User not found', 
              404
          ));
        }

        if(user.isActive === false){
          console.log('User not verified with OTP');
            return next(new AppError(
              'Please verify your otp and try again', 
              401
          ));
        }

        const { 
            country,
            state,
            apartment,
            street,
            city,
            postalCode
        } = req.body;

        const data = {
          country,
          state,
          apartment,
          street,
          city,
          postalCode
        };

        const newData = await User.findOneAndUpdate({ _id: id }, data, { new: true });

        if (!newData) {
          return next(new AppError(
              'Cannot set Residence address, please try again', 
              400
          ));
      }

      await newData.save();
      res.status(201).json({
        success: true,
        message: 'Residence address successfully added',
        data: newData,
      });

    } catch (error) {
        next(new AppError(
          'Internal server error', 
          500
      ));
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Setup user account
 * @route `/api/user/setaccount`
 * @access PRIVATE
 * @type PUT
 */
export const setUpAcc = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
  try {

      const { id } = req.params;

      if (!req.user) {
        return next(new AppError(
          'User not authenticated', 
          401
      ));
    }

    // Find the user by their _id
    const user = await User.findOne({ _id: req.user._id });

    if(!user){
        return next(new AppError(
          'User not found', 
          404
      ));
    }

    if(user.isActive === false){
        return next(new AppError(
          'Please verify your otp and try again', 
          401
      ));
    }

      if (!user.isKycVerified === false) {
        return next(new AppError(
          'Please verify your bvn and try again', 
          404
      ));
    }

      const { 
        firstname,
        lastname,
        username,
        email,
        password,
        dateOfBirth,
        gender,
    } = req.body;

      // Check if the username is already taken
      const existingUsername = await User.findOne({ username });

      if (existingUsername && existingUsername._id.toString() !== id) {
          return next(new AppError(
            'Username is already taken', 
            400
        ));
      }

      // Check if the email is already taken
      const existingEmail = await User.findOne({ email });

      if (existingEmail && existingEmail._id.toString() !== id) {
          return next(new AppError(
            'Email is already taken', 
            400
        ));
      }
        // Generate tagNumber
      const tagNumber = await generateTagNumber();
                
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

        const data = {
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword, 
            dateOfBirth,
            gender,
            tagNumber,
        };

    const newUser = await User.findOneAndUpdate({ _id: id }, data, { new: true }).select('+password')

    if (!newUser) {
      return next(new AppError(
          'Cannot set profile, please try again', 
          400
      ));
  }

    newUser.profileSet = true;
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: newUser,
    });

  } catch (error) {
    console.log(error)
    return next(new AppError(
      'Internal server error', 
      500
  ))
  }
})

  /**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description initial bvn verification
 * @route `/api/user/setupBvn`
 * @access PRIVATE
 * @type POST
 */
  export const InititateBvnVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bvn, firstname, lastname } = req.body;
        console.log(req.body);

        if (!req.user) {
            return next(new AppError(
              'User not authenticated', 
              401
          ));
        }

        if (!bvn) {
            return next(new AppError('BVN is required', 401));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        const isBvnValid = await initateBvn(bvn, firstname, lastname);
        console.log(isBvnValid);


        if (isBvnValid) {
            res.status(200).json({
                success: true,
                isBvnValid,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'BVN verification failed',
            });
        }
    } catch (error) {
        console.error('Error in BVN verification:', error);
        return next(new AppError(
          'Internal server error', 
          500
      ));
    }
});

  /**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description verify bvn
 * @route `/api/user/verifybvn/:reference`
 * @access PRIVATE
 * @type POST
 */
  export const verifyUserBvn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reference } = req.params;
  
      if (!reference) {
        return res.status(400).json({
          success: false,
          message: 'Reference is required',
        });
      }
  
      if (!req.user) {
        return next(new AppError('User not authenticated', 401));
      }
  
      // Find the user by their _id
      const user = await User.findOne({ _id: req.user._id });
  
      if (!user) {
        return next(new AppError('User not found', 404));
      }
  
      const isBvnValid = await verifyBvn(reference);
  
      if (!isBvnValid) {
        return res.status(400).json({
          success: false,
          message: 'BVN verification failed',
        });
      }
  
      // If BVN verification is successful, create a virtual account number for the user
      if (isBvnValid.status === 'COMPLETED') {
        await createVirtualAccountNumber(user, user.email, user.bvn);
      }
  
      // Log the data from the reference
      console.log('BVN verification successful. Logging data:', isBvnValid);
  
      // Continue with any additional logic or response as needed
      return res.status(200).json({
        success: true,
        message: 'BVN verified successfully',
        data: isBvnValid, // You can include additional data if needed
      });
    } catch (error) {
      console.error('Error in BVN verification:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  
  
  

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Generate qr for a user 
 * @route `/api/user/generateqr`
 * @access PRIVATE
 * @type POST
 */
export const generateQr = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (!req.user) {
      return next(new AppError(
        'User not authenticated', 
        401
    ));
  }
      // Use req.user._id instead of req.params.id
      const userId = req.user._id;

      // Check if user ID is available
      if (!userId) {
          return next(new AppError(
              'User ID is required',
              400
          ));
      }

      // Find user by ID
      const user = await User.findById(userId);

      // Check if user exists
      if (!user) {
          return next(new AppError(
              'User not found',
              404
          ));
      }

      // Generate QR code with user ID and firstname as data
      const qrData = `localhost:3000/${user._id}/${user.firstname}`;
      const qrCode = await qrcode.toDataURL(qrData);

      res.status(200).json({
          success: true,
          message: 'QR Code generated successfully',
          data: qrCode,
      });

  } catch (error) {
      console.error('Error generating QR code:', error);
      return next(new AppError(
          'Internal server error',
          500
      ));
  }
});


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Setup user pin
 * @route `/api/user/setpin`
 * @access PRIVATE
 * @type POST
 */
export const setupPin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
      if (!req.user) {
          return next(new AppError(
            'User not authenticated', 
            401
        ));
      }

      const { pin } = req.body;

      const user = await User.findOne({ _id: req.user._id });

      if (!user) {
          return next(new AppError(
            'User not found', 
            404
        ));
      }

      // Check if the user already has a PIN set up
      if (user.pin) {
          return next(new AppError(
            'Transaction PIN already set up', 
            400
        ));
      }

        // Hash the new PIN
        const hashedPin = await bcrypt.hash(pin, 12);

        // Set up and save the new hashed PIN
        user.pin = hashedPin;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Pin setup successfully",
            data: user,
        });

  } catch (error) {
      console.error('Error setting up PIN:', error);
      next(new AppError(
        'Internal server error', 
        500
    ));
  }
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description change user pin
 * @route `/api/user/confirmpin`
 * @access PRIVATE
 * @type POST
 */
export const changePin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
      if (!req.user) {
          return next(new AppError(
            'User not authenticated', 
            401
        ));
      }

      const { oldPin, newPin } = req.body;

      const user = await User.findOne({ _id: req.user._id });

      if (!user) {
          return next(new AppError(
            'User not found', 
            404
        ));
      }

      // Verify the old PIN
      const isOldPinValid = await user.matchTransactionPin(oldPin);

      if (!isOldPinValid) {
          return next(new AppError(
            'Invalid Old Pin', 
            401
        ));
      }

      // Hash and set up the new PIN
      user.pin = newPin;
      await user.save();

      res.status(200).json({
          success: true,
          message: "Pin changed successfully",
          data: user,
      });

  } catch (error) {
      console.error('Error changing PIN:', error);
      next(new AppError(
        'Internal server error', 
        500
    ));
  }
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description confirm user pin
 * @route `/api/user/confirmpin`
 * @access PRIVATE
 * @type POST
 */
export const confirmPin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
      if (!req.user) {
          return next(new AppError(
            'User not authenticated', 
            401
        ));
      }

      const { pin } = req.body;

      const user = await User.findOne({ _id: req.user._id });

      if (!user) {
          return next(new AppError(
            'User not found', 
            404
        ));
      }

      const isTrue = await user.matchTransactionPin(pin);

      if (!isTrue) {
          return next(new AppError(
            'Invalid Pin', 
            401
        ));
      }

      res.status(200).json({
          success: true,
          data: user,
      });

  } catch (error) {
      next(new AppError(
        'Internal server error', 
        500
    ));
  }
});
