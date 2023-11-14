import { Iuser } from './../types/interfaces/user.inter';
import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import bcrypt from "bcrypt";
import User from '../models/user.model';
import Kyc from '../models/kyc.model'
import Wallet from '../models/wallet.model';
import { Iwallet } from '../types/interfaces/wallet.inter';
import {
    getUserBanksFromFlw,
    addBankToWallet,
    verifyBankAccount
}from '../services/bank.service'


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
 * @description Add bank details
 * @route `/api/bank/addbank`
 * @access PRIVATE
 * @type POST
 */
export const addBank = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

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
        // Assuming you have a wallet ID stored in req.user.walletId
        const walletId = req.params.id;

        // Extract bank details from the request body
        const { bankName, accountNumber, accountHolderName } = req.body;

        // Validate bank details (add more validation as needed)

        // Call the helper function to add the bank to the wallet
        const addedBank = await addBankToWallet(walletId, {
            bankName,
            accountNumber,
            accountHolderName,
        });

        // Handle the response accordingly
        res.status(200).json({
            success: true,
            data: addedBank,
        });
    } catch (error) {
        console.error('Error adding bank to wallet:', error);
        return next(new AppError(
            'Internal server error', 
            500
        ));
    }
});


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
        console.log(req.body)

        const verificationResult = await verifyBankAccount(account_number, account_bank);
        console.log(verificationResult)

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
