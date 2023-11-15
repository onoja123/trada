import { NextFunction, Request, Response } from 'express';
import Contribution from "../models/contribution.model";
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';


export const startContribution = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

})