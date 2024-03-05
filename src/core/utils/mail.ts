import sendEmail from '@/core/utils/sendEmail';

const mail = new sendEmail();

export const sendForgetPinEmail = async (recipient: string, firstName: string, otp: string): Promise<void> => {
    const message = `
        Hi there ${firstName}!
        Here's a new code to verify your account.${otp}`;

    await mail.sendTemplatedEmail({
        recipients: recipient,
        template: {
            name: 'forget-pin',
            subject: 'Reset Pin OTP 🚀!',
        },
        templateData: { message },
    });
};

export const sendMoneyRequestEmail = async (
    recipient: string,
    senderName: string,
    requesterName: string,
    amount: number,
    reason: string
): Promise<void> => {
    await mail.sendTemplatedEmail({
        recipients: recipient,
        template: {
            name: 'money-request',
            subject: 'Money Request 🌟!',
        },
        templateData: {
            senderName,
            requesterName,
            amount,
            reason,
        },
    });
};