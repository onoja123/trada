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
  verifyBvn
}from '../services/kyc.service'

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
          return next(new AppError('Username is already taken', 400));
      }

      // Check if the email is already taken
      const existingEmail = await User.findOne({ email });

      if (existingEmail && existingEmail._id.toString() !== id) {
          return next(new AppError('Email is already taken', 400));
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
 * @description verify bvn
 * @route `/api/wallet/bvn`
 * @access PRIVATE
 * @type POST
 */
  export const BvnVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bvn } = req.body;

        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        if (!bvn) {
            return next(new AppError('BVN is required', 401));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        const isBvnValid = await verifyBvn(bvn);

        // Save BVN information in the KYC model
        const kyc = await Kyc.create({
            _user: user,
            bvn: isBvnValid,
            status: isBvnValid ? 'success' : 'failed',
        });

        if (isBvnValid) {
            res.status(200).json({
                success: true,
                message: 'BVN verified successfully',
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'BVN verification failed',
            });
        }
    } catch (error) {
      return next(new AppError(
        'Internal server error', 
        500
    ));
    }
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Generate qr for a user 
 * @route `/api/user/generateqr`
 * @access PRIVATE
 * @type POST
 */
export const generateQr = catchAsync(async(req:Request, res:Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        // Find user by ID or name
        const user = await User.findOne({ $or: [{ _id: id }, { name: id }] });
    
        if(!user){
            return next(new AppError(
                "User not found",
                404
            ))
        }
    
      // Generate QR code with user ID or name as data
      const qrData = `localhost:3000/${user._id}/${user.firstname}`;
      const qrCode = await qrcode.toDataURL(qrData);

      res.status(200).json({
        sucesss: true,
        message: "Qr Generated successfully",
        data: qrCode
      })
    
    } catch (error) {
      return next(new AppError(
        'Internal server error', 
        500
      )); 
    
    }
})


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
