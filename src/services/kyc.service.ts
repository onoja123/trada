import axios from 'axios';

const flutterwaveApiUrl = process.env.FLW_URL || ''

const flutterwaveApiKey = process.env.FLW_API_KEY || 'FLWSECK_TEST-eab56b1d3cdf332da191b8dd2b04f22d-X'

// Helper function to verify bvn using lutterwave API
export const initateBvn = async (bvn: string, firstname: string, lastname:string): Promise<boolean> => {
    try {
        const bvnVerificationUrl = 'https://api.flutterwave.com/v3/bvn/verifications';

        const bankDetails = {
            bvn,
            firstname,
            lastname,
        };

        const response = await axios.post(
            bvnVerificationUrl,
            bankDetails,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${flutterwaveApiKey}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error verifying BVN with Flutterwave:', error);
        throw new Error('Error verifying BVN with Flutterwave');
    }
};

// Helper function to verify bvn otp using flutterwave API
export const verifyBvn = async (reference: string): Promise<boolean> => {
    try {
        const otpVerificationUrl = `https://api.flutterwave.com/v3/bvn/verifications/${reference}`;

        const response = await axios.get(otpVerificationUrl, {
            headers: {
                'Authorization': `Bearer ${flutterwaveApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error verifying BVN with Flutterwave:', error);
        throw new Error('Error verifying BVN with Flutterwave');
    }
};
