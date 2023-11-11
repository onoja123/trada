import { Iuser } from './../types/interfaces/user.inter';
import AppError from '../utils/appError';
import { Iwallet } from '../types/interfaces/wallet.inter';
import axios from 'axios';

const monoApiUrl = process.env.MONO_URL || ''

const monoApiKey = process.env.MONO_API_KEY || ''

export const getUserBanksFromMono = async (userId: string): Promise<any> => {
    try {
        const monoApiUrl = `https://api.withmono.com/v1/accounts/${userId}/banks`;
        const monoApiKey = 'your-mono-api-key'; // Replace with your actual Mono API key

        const response = await axios.get(monoApiUrl, {
            headers: {
                'Authorization': `Bearer ${monoApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        throw new Error('Error getting user banks from Mono');
    }
};

export const addBankToWallet = async (walletId: string, bankDetails: any): Promise<any> => {
    try {
        // Replace the following URL with the actual endpoint for adding a bank to the wallet
        const apiUrl = `https://api.example.com/wallets/${walletId}/banks`;
        const apiKey = 'your-api-key'; // Replace with your actual API key

        const response = await axios.post(apiUrl, bankDetails, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        throw new Error('Error adding bank to wallet');
    }
};

export const verifyBankAccount = async (bankDetails: any): Promise<any> => {
    try {
        // Replace the following URL with the actual endpoint for verifying a bank account
        const apiUrl = 'https://api.example.com/verify-bank';
        const apiKey = 'your-api-key'; // Replace with your actual API key

        const response = await axios.post(apiUrl, bankDetails, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        throw new Error('Error verifying bank account');
    }
};
