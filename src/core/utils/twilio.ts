import { VerifySid, twilioClient } from "@/core/config";

export const sendOTP = async (
    contactMedium: string,
    channel: string = "sms",
) => {
    try {
        const sent = await twilioClient.verify.v2
            .services(VerifySid)
            .verifications.create({ to: contactMedium, channel: channel });
        return sent.status;
    } catch (error) {
        console.log(error.message);
        return "errored";
    }
};

export const verifyOTP = async (
    contactMedium: string,
    otpCode: string
) => {
    try {
        const verify = await twilioClient.verify.v2
            .services(VerifySid)
            .verificationChecks.create({
                to: contactMedium,
                code: otpCode,
            });

        return verify.status;
    } catch (error) {
        console.log(error.message);
    }
};