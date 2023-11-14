import { Iuser } from './../types/interfaces/user.inter';
import AppError from '../utils/appError';
import { Iwallet } from '../types/interfaces/wallet.inter';
import axios from 'axios';

const monoApiUrl = process.env.MONO_URL || ''

const monoApiKey = process.env.MONO_API_KEY || 'FLWSECK_TEST-eab56b1d3cdf332da191b8dd2b04f22d-X'

export const getUserBanksFromFlw = async (userId: string): Promise<any> => {
    try {
        const monoApiUrl = `https://api.flutterwave.com/v3/banks/NG`;

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
                'Authorization': `Bearer ${monoApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        throw new Error('Error adding bank to wallet');
    }
};

export const verifyBankAccount = async (account_number: string, account_bank: string): Promise<any> => {
    try {
        const apiUrl = 'https://api.flutterwave.com/v3/accounts/resolve';

        const bankDetails = {
            account_number: account_number,
            account_bank: account_bank,
        };
        const response = await axios.post(apiUrl, bankDetails, {
            headers: {
                'Authorization': `Bearer ${monoApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error verifying bank account', error);
        throw new Error('Error verifying bank account');
    }
};
