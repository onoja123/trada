import { config } from "dotenv";

config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";

export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  DB_HOST
} = process.env;

export const {
  FLW_SECRET_KEY,
  FLW_BASE_URL,
} = process.env;


export const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  VERIFY_SERVICE_SID,
  REDIS_URI,
} = process.env;