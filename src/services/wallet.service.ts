import { CreateFlwAccount, FundWalletWithCard, GetAccount } from '../types';
import AppError from '../utils/appError';
import axios from 'axios';

const flutterwaveApiKey = process.env.FLW_API_KEY;

// Helper function to create a wallet for the user
export const createVirtualAccountNumber = async (data: CreateFlwAccount): Promise<any> => {
    try {
        const flutterwaveApiUrl = 'https://api.flutterwave.com/v3';

        const response = await axios.post(
            `${flutterwaveApiUrl}/virtual-account-numbers`,
            {
                data,
                is_permanent: true,
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

export const getAccount = async (data: GetAccount) => {
    try {
        const url = 'https://api.flutterwave.com/v3';

        const response = await axios.get(
            `${url}/virtual-account-numbers/${data.order_ref}`,
            {
                headers: {
                    'Authorization': `Bearer ${flutterwaveApiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error getting account with Flutterwave:', error);
        throw new AppError('Error getting account with Flutterwave', 500);
    }
};

// Helper function to fund wallet with card
export const fundWalletWithCard = async (data: FundWalletWithCard): Promise<any> => {

    const flwApiUrl = 'https://api.flutterwave.com/v3/virtual-account-numbers';
    const response = await axios.post(
        flwApiUrl,
        {
            data,
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


// Helper function to create virtual with card
export const createCard = async (cardNumber: string, cardExpiry: string, cardCVV: string, amount: number): Promise<any> => {


    const flwApiUrl = 'ttps://api.flutterwave.com/v3/virtual-cards';
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

// Helper function to fund wallet with card
export const fundCard = async (cardNumber: string, cardExpiry: string, cardCVV: string, amount: number): Promise<any> => {


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


// Helper function to withdraw funds from card
export const withdrawCard = async (cardNumber: string, cardExpiry: string, cardCVV: string, amount: number): Promise<any> => {


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