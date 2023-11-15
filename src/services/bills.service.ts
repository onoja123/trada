import axios from 'axios';

const flutterwaveApiUrl = process.env.FLW_URL || ''

const flutterwaveApiKey = process.env.FLW_API_KEY || 'FLWSECK_TEST-eab56b1d3cdf332da191b8dd2b04f22d-X'

// Helper function to get all bils category using flutterwave API
export const getAllBill = async (filters?: Record<string, any>): Promise<any> => {
    try {
        const flutterwaveApiUrl = 'https://api.flutterwave.com/v3/bill-categories';

        const response = await axios.get(flutterwaveApiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${flutterwaveApiKey}`,
            },
            params: filters, // Add filters as query parameters
        });

        return response.data;
    } catch (error) {
        console.error('Error getting bill categories from Flutterwave:', error);
        throw new Error('Error getting bill categories from Flutterwave');
    }
};


// Helper function to verify bill using flutterwave API
export const verifyBill = async (item_code: string): Promise<boolean> => {
    try {
        const otpVerificationUrl = `https://api.flutterwave.com/v3/bill-items/${item_code}/validate`;

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

// Helper function to create bill payment using flutterwave API
export const billPayment = async (item_code: string): Promise<boolean> => {
    try {
        const otpVerificationUrl = `https://api.flutterwave.com/v3/bill-items/${item_code}/validate`;

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
