import axios from 'axios';

const monoApiUrl = process.env.MONO_URL || ''

const flwApiKey = process.env.MONO_API_KEY || 'FLWSECK_TEST-eab56b1d3cdf332da191b8dd2b04f22d-X'

// Helper function to verify bvn using Mono API
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
                    'Authorization': `Bearer ${flwApiKey}`,
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
                'Authorization': `Bearer ${flwApiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error verifying BVN with Flutterwave:', error);
        throw new Error('Error verifying BVN with Flutterwave');
    }
};
