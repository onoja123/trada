import { Iuser } from './../types/interfaces/user.inter';
import AppError from '../utils/appError';
import { Iwallet } from '../types/interfaces/wallet.inter';
import axios from 'axios';

const flwApiUrl = process.env.FLW_URL || ''

const flutterwaveApiKey = process.env.FLW_API_KEY || 'FLWSECK_TEST-eab56b1d3cdf332da191b8dd2b04f22d-X'

// Helper function to create a wallet for the user
export const createWalletForUser = async (user: Iuser, email: string, bvn: string,): Promise<Iwallet> => {
    try {
        const flutterwaveApiUrl = 'https://api.flutterwave.com/v3/virtual-account-numbers';

        const response = await axios.post(
            `${flutterwaveApiUrl}/virtual-account-numbers`,
            {
                user_id: user._id,
                bvn,
                email,
                "is_permanent": true,

            },
            {
                headers: {
                    'Authorization': `Bearer ${flutterwaveApiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error creating wallet with Flutterwave:', error);
        throw new AppError('Error creating wallet with Flutterwave', 500);
    }

};

// Helper function to fund wallet with card
export const fundWalletWithCard = async (cardNumber: string, cardExpiry: string, cardCVV: string, amount: number): Promise<any> => {


    const flwApiUrl = 'https://api.flutterwave.com/v3/virtual-account-numbers';
    const response = await axios.post(
        flwApiUrl,
        {
            cardNumber,
            cardExpiry,
            cardCVV,
            amount,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${flutterwaveApiKey}`,
            },
        }
    );

    return response.data;
};

// Helper function to withraw funds from wallet
export const withdrawFunds = async (amount: number, recipientAccountNumber: string, recipientBankCode: string): Promise<any> => {

    const flwApiUrl = 'https://api.flutterwave.com/v3/virtual-account-numbers';
    const response = await axios.post(
        flwApiUrl,
        {
            amount,
            recipientAccountNumber,
            recipientBankCode,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${flutterwaveApiKey}`,
            },
        }
    );

    return response.data;
};

// Helper function to transfer funds to bank account
export const transferToBank = async (account_bank: string, account_number: string, amount: string, currency: string, narration: string): Promise<any> => {

    const flwApiUrl = 'https://api.flutterwave.com/v3/transfers';

    const bankDetails = {
        account_bank,
        account_number,
        amount,
        currency,
        narration
    };

    const response = await axios.post(
        flwApiUrl,
        bankDetails,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${flutterwaveApiKey}`,
            },
        }
    );

    return response.data;
};
