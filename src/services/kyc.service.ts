import axios from 'axios';
const monoApiUrl = 'https://api.withmono.com/v2'; // Common Mono API base URL

// Helper function to verify bvn using Mono API
export const verifyBvn = async (bvn: string): Promise<boolean> => {
    try {
        const bvnVerificationUrl = `${monoApiUrl}/lookup/bvn/initiate`;
        const monoApiKey = 'your-mono-api-key';

        const response = await axios.post(
            bvnVerificationUrl,
            {
                bvn,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${monoApiKey}`,
                },
            }
        );

        if (response.data.success) {
            // BVN verification successful
            return true;
        } else {
            // BVN verification failed
            return false;
        }
    } catch (error) {
        console.error('Error verifying BVN with Mono:', error);
        throw new Error('Error verifying BVN with Mono');
    }
};

// Helper function to verify bvn otp using Mono API
export const verifyOtpWithMono = async (code: string, reference: string): Promise<boolean> => {
    try {
        const otpVerificationUrl = `${monoApiUrl}/auth/verify`;

        const response = await axios.post(
            otpVerificationUrl,
            {
                code,
                reference,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.MONO_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.success) {
            // OTP verification successful
            return true;
        } else {
            // OTP verification failed
            return false;
        }
    } catch (error) {
        console.error('Error verifying OTP with Mono:', error);
        throw new Error('Error verifying OTP with Mono');
    }
};
