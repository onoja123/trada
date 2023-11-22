import axios from 'axios';

export interface BvnVerificationResponse {
    status: string; // or a more specific type based on the actual response
    // Add other properties as needed
  }
const flutterwaveApiUrl = process.env.FLW_URL || ''

const flutterwaveApiKey = process.env.FLW_API_KEY || 'FLWSECK_TEST-eab56b1d3cdf332da191b8dd2b04f22d-X'

// Helper function to verify bvn using lutterwave API
export const initateBvn = async (bvn: string, firstname: string, lastname:string): Promise<any> => {
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

// Helper function to verify bvn using flutterwave API
export const verifyBvn = async (reference: string): Promise<BvnVerificationResponse> => {
    try {
        const VerificationUrl = `https://api.flutterwave.com/v3/bvn/verifications/${reference}`;

        const response = await axios.get(VerificationUrl, {
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
