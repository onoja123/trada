import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import Notification from '../models/notification.model';


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Get all notifications
 * @route `/api/notification/allnotification`
 * @access PRIVATE
 * @type GET
 */
export const getAllNotification = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
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
 * @description Update All Notification As Seen
 * @route `/api/notification/seen/:id`
 * @access PRIVATE
 * @type GET
 */
export const markAsSeen = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        if (!req.user) {
            return next(new AppError(
                'User not authenticated', 
                401
            ));
        }

        const data = await Notification.updateMany(
            {
              _user: req.user._id
            },
            {
              view: true
            }
          );

          if (!data) {
            return next(new AppError(
                '404 Content Do Not Exist Or Has Been Deleted', 
                404
            ));
        }
        res.status(200).json({
            success: true,
            data: data

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
 * @description Update All Notification As Seen
 * @route `/api/notification/seen/:id`
 * @access PRIVATE
 * @type GET
 */
export const countNotification = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        if (!req.user) {
            return next(new AppError(
                'User not authenticated', 
                401
            ));
        }

        const data = await Notification.count({
            _user: req.user._id,
            view: false
          });

        res.status(200).json({
            success: true,
            data: data
        })
        
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))  
    }
})


