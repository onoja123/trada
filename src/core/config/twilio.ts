import { VERIFY_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '@/core/config';
import { Twilio } from 'twilio';

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
export const VerifySid = VERIFY_SERVICE_SID;

export const twilioClient = new Twilio(accountSid, authToken);