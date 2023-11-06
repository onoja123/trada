import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import bcrypt from "bcrypt";
import User from '../models/user.model';
import { Iuser } from "../types/interfaces/user.inter";
declare global {
    namespace Express {
      interface Request {
        user?: Iuser;
      }
    }
  }

export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // If the user exists, send their profile data as a JSON response
        res.status(200).json({
            status: 'success',
            data: {
                user, // You might want to omit sensitive data here
            },
        });
    } catch (error) {
        next(new AppError('Internal server error', 500));
    }
});

export const confirmPin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        const { pin } = req.body;

        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        const isTrue = await user.matchTransactionPin(pin);

        if (!isTrue) {
            return next(new AppError('Invalid Pin', 401));
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(new AppError('Internal server error', 500));
    }
});
