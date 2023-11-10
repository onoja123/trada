import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

import axios from 'axios';

export const verifyBvn = async (bvn: string): Promise<boolean> => {
    try {
        const apiUrl = 'https://api.blocq.io/v1.0/kyc/verify-bvn';
        const apiKey = 'your-api-key'; // Replace with your actual API key

        const response = await axios.post(apiUrl, 
            { 
                bvn 
            }, 
            { 
                headers: { 
                'Authorization': `Bearer ${apiKey}` 
            } 
        });

        if (response.data.success) {
            // BVN verification successful
            return true;
        } else {
            // BVN verification failed
            return false;
        }
    } catch (error) {
        console.error('Error verifying BVN:', error);
        
        throw new Error('Error verifying BVN');
    }
};
