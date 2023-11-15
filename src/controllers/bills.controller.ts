import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import {
    getAllBill,
    verifyBill
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
        const customFilters: Record<string, any> = req.query;

        // Call the service function to get bill categories with custom filters
        const categories = await getAllBill(customFilters);

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
export const validateBill = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the item code from the request parameters
        const { item_code } = req.params;

        // Check if the item code is provided
        if (!item_code) {
            return next(new AppError('Item code is required', 400));
        }

        // Use the verifyBill function to validate the bill
        const isValid = await verifyBill(item_code);

        // Respond based on the validation result
        res.status(200).json({
            success: true,
            isValid: isValid,
        });
    } catch (error) {
        console.error('Error validating bill:', error);
        return next(new AppError('Internal server error', 500));
    }
});

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
