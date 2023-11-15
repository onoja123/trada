import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import Transaction from '../models/transaction.model';


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Get all transactions
 * @route `/api/transaction/alltransactions`
 * @access PRIVATE
 * @type GET
 */
export const getAlltransactions = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        if (!req.user) {
            return next(new AppError(
                'User not authenticated', 
                401
            ));
        }

        const  transactions = await Transaction.findOne({ _id: req.user._id });

        if(!transactions){
            return next(new AppError(
                "No transaction found", 
                404
            ))  
        }

        res.status(200).json({
            success: true,
            data: transactions
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
 * @description Get One transaction
 * @route `/api/transaction/onetransaction/:id`
 * @access PRIVATE
 * @type GET
 */
export const getOneTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        const id = req.params.id;

        if (!id) {
            return next(new AppError('Transaction ID is required', 400));
        }

        const transaction = await Transaction.findOne({ _id: id, sender: req.user._id });

        if (!transaction) {
            return next(new AppError('Transaction not found', 404));
        }

        res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        console.error('Error getting one transaction:', error);
        return next(new AppError('Internal server error', 500));
    }
});
