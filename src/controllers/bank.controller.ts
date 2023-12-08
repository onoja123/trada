import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import User from '../models/user.model';
import {
    getUserBanksFromFlw,
    verifyBankAccount
}from '../services/bank.service'
import Bank from '../models/bank.model';


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Transfer money from wallet to bank account
 * @route `/api/bank/allbanks`
 * @access PRIVATE
 * @type POST
 */
export const getUserBanks = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        // Assuming you have a user ID stored in req.user._id
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
        // Assuming you have a user ID stored in req.user._id
        const userId = req.user._id;

        // Call the helper function to get user banks from flw
        const userBanks = await getUserBanksFromFlw(userId);

        // Handle the response accordingly
        res.status(200).json({
            success: true,
            data: userBanks,
        });
        
    } catch (error) {
        console.error('Error getting user banks from Mono:', error);
        return next(new AppError(
            'Internal server error', 
            500
        ));
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Verify user bank account
 * @route `/api/bank/verifyacc`
 * @access PRIVATE
 * @type POST
 */
export const verifyBank = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract bank details from the request body
        const { account_number, account_bank } = req.body;

        const verificationResult = await verifyBankAccount(account_number, account_bank);

        // Handle the response accordingly
        res.status(200).json({
            success: true,
            data: verificationResult,
        });
    } catch (error) {
        console.error('Error verifying bank account:', error);
        return next(new AppError('Internal server error', 500));
    }
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Add bank details
 * @route `/api/bank`
 * @access PRIVATE
 * @type POST
 */
export const addBank = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { account_name, account_number, account_bank, type } = req.body;

        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            console.log('User not found');
            return next(new AppError('User not found', 404));
        }

        // Create a new bank instance
        const newBank = new Bank({
            user: [user._id],
            account_name,
            account_number,
            account_bank,
            type,
        });

        // Save the new bank instance to the database
        const savedBank = await newBank.save();

        // Respond with the saved bank details
        res.status(201).json({
            success: true,
            data: savedBank,
        });
    } catch (error) {
        console.error('Error adding bank account:', error);
        return next(new AppError('Internal server error', 500));
    }
});

/**
 * @description Get user banks with a specified type
 * @route `/api/bank/getbanks/:type`
 * @access PRIVATE
 * @type GET
 */
export const getBanks = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;

        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            console.log('User not found');
            return next(new AppError('User not found', 404));
        }

        // Populate banks based on the specified type
        const banks = await Bank.find({ user: user._id, type });

        res.status(200).json({
            success: true,
            data: banks,
        });
    } catch (error) {
        console.error('Error getting user banks:', error);
        return next(new AppError('Internal server error', 500));
    }
});

/**
 * @description Get a specific bank by ID
 * @route `/api/bank/getbank/:bankId`
 * @access PRIVATE
 * @type GET
 */
export const getBank = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bankId } = req.params;

        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            console.log('User not found');
            return next(new AppError('User not found', 404));
        }

        // Find the specified bank by ID
        const bank = await Bank.findOne({ _id: bankId, user: user._id });

        if (!bank) {
            console.log('Bank not found');
            return next(new AppError('Bank not found', 404));
        }

        res.status(200).json({
            success: true,
            data: bank,
        });
    } catch (error) {
        console.error('Error getting bank:', error);
        return next(new AppError('Internal server error', 500));
    }
});
