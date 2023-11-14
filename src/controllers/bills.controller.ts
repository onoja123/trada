import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import {
    getallBill
}from '../services/bills.service'


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Purchase cable bills
 * @route `/api/bils/purcahsebills`
 * @access PRIVATE
 * @type POST
 */
export const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // You can access query parameters using req.query
        const { filterParameter } = req.query;

        // Call the service function to get all bill categories with optional filter
        const categories = await getallBill();

        // Respond with the retrieved categories
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Error getting bill categories:', error);
        return next(new AppError('Internal server error', 500));
    }
});


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Purchase airtime
 * @route `/api/bils/purcahseairtime`
 * @access PRIVATE
 * @type POST
 */
export const validateBill = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
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
