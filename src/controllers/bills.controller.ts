import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import bcrypt from "bcrypt";
import User from '../models/user.model';
import Kyc from '../models/kyc.model'
import Wallet from '../models/wallet.model';
import { Iuser } from "../types/interfaces/user.inter";


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Purchase cable bills
 * @route `/api/bils/purcahsebills`
 * @access PRIVATE
 * @type POST
 */
export const payCableBills = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
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
 * @description Purchase airtime
 * @route `/api/bils/purcahseairtime`
 * @access PRIVATE
 * @type POST
 */
export const purchaseAirtime = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
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
 * @description Purchase data
 * @route `/api/bils/purcahsedata`
 * @access PRIVATE
 * @type POST
 */
export const purchaseData = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))  
    }
})
