import { Iuser } from './../types/interfaces/user.inter';
import AppError from '../utils/appError';
import { Iwallet } from '../types/interfaces/wallet.inter';
import axios from 'axios';

const monoApiUrl = process.env.MONO_URL || ''

const monoApiKey = process.env.MONO_API_KEY || ''

// Helper function to create a wallet for the user
export const createWalletForUser = async (user: Iuser) => {

    const response = await axios.post(
        monoApiUrl,
        {
            userId: user._id,
        },
        {
            headers: {
                'Authorization': `Bearer ${monoApiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
};

// Helper function to create a bank transfer using Mono API
export const createBankTransfer = async (wallet: Iwallet | null, amount: number, currency: string) => {
    if (!wallet) {
        throw new AppError('Wallet not found', 404);
    }


    const response = await axios.post(
        monoApiUrl,
        {
            amount,
            currency,
            recipientAccountNumber: wallet.accountNumber,
            recipientBankCode: wallet.bankCode,
        },
        {
            headers: {
                'Authorization': `Bearer ${monoApiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
};

// Helper function to fund wallet with card
export const fundWalletWithCard = async (cardNumber: string, cardExpiry: string, cardCVV: string, amount: number): Promise<any> => {


    const response = await axios.post(
        monoApiUrl,
        {
            cardNumber,
            cardExpiry,
            cardCVV,
            amount,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${monoApiKey}`,
            },
        }
    );

    return response.data;
};

// Helper function to withraw funds from wallet
export const withdrawFunds = async (amount: number, recipientAccountNumber: string, recipientBankCode: string): Promise<any> => {

    const response = await axios.post(
        monoApiUrl,
        {
            amount,
            recipientAccountNumber,
            recipientBankCode,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${monoApiKey}`,
            },
        }
    );

    return response.data;
};

// Helper function to transfer funds to bank account
export const transferToBank = async (amount: number, recipientAccountNumber: string, recipientBankCode: string): Promise<any> => {

    const response = await axios.post(
        monoApiUrl,
        {
            amount,
            recipientAccountNumber,
            recipientBankCode,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${monoApiKey}`,
            },
        }
    );

    return response.data;
};
