import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import bcrypt from "bcrypt";
import User from '../models/user.model';
import Kyc from '../models/kyc.model'
import Wallet from '../models/wallet.model';


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Get user wallet
 * @route `/api/wallet/getwallet`
 * @access PRIVATE
 * @type GET
 */
export const getWallet = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
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
                'User not found', 
                404
            ));
        }

		const wallet = await Wallet.findOne({ user: req.user })
			.populate({
				path: 'transactions',
				options: {
					sort: {
						date: -1,
					},
				},
			});

        if (!wallet && user.isActive === false) {
            return next(new AppError(
                'User not found', 
                404
            ));
        }

        res.status(200).json({
            success: true,
            data: wallet
        })
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description send Money to a trada user
 * @route `/api/wallet/sendmoney`
 * @access PRIVATE
 * @type POST
 */
export const sendMoneyToUser = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
    if (!req.user) {
        return next(new AppError(
            'User not authenticated', 
            401
        ));
    }

    // Find the user by their _id
    const user = await User.findOne({ _id: req.user._id }).select('+wallet');

    if (!user) {
        return next(new AppError(
            'User not found', 
            404
        ));
    }

    if (user.isActive === false) {
        return next(new AppError(
            'Please verify your account and try again.', 
            400
        ));
    }

    //check if the user has a wallet
	const wallet = await Wallet.findOne({ user: user._id });

    if (!wallet) {
        return next(new AppError(
            "You don't have a wallet", 
            404
        ));
    }
    const { amount, recipient, memo } = req.body;

    //validate the input
    if (!amount || !recipient){
        return next(new AppError(
            "Please enter an amount to send and a recipient'",
            400
        ))
    } 

    if (memo !== undefined && memo.length > 50){
        return next(new AppError(
            "Memo can't be longer than 50 characters'",
            400
        ))
    }

    //you can only send a minimum of $2.
    if (amount < 2){
        return next(new AppError(
            "You can only send a minimum of $2'",
            400
        ))
    }
    //check if the amount to send is more than the user's balance.
    if (amount > wallet.balance) {
        return next(new AppError(
            `You can't send more than $${wallet.balance}`,
            400
        ))
    }
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description fund wallet
 * @route `/api/wallet/fundwalbank`
 * @access PRIVATE
 * @type POST
 */
export const fundWalletBanktransfer = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))  
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description fund wallet
 * @route `/api/wallet/fundwalcard`
 * @access PRIVATE
 * @type POST
 */
export const fundWalletCard = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))  
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description withdraw Money account
 * @route `/api/wallet/withdraw`
 * @access PRIVATE
 * @type POST
 */
export const withdrawFunds = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))  
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description request money from another user
 * @route `/api/wallet/request`
 * @access PRIVATE
 * @type POST
 */
export const requestFunds = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))  
    }
})


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Transfer money from wallet to bank account
 * @route `/api/wallet/trasnfertobank`
 * @access PRIVATE
 * @type POST
 */
export const transferToBank = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))  
    }
})