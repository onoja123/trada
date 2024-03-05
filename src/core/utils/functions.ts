import * as jwt from 'jsonwebtoken';
import otpMaster from '../../models/otp';
import { BadRequestException } from '../../exceptions';
import User from "@/models/user";

const generateJWT = function (payload = {}, options = {}) {
  const privateKey = process.env.JWT_SECRETS;
  const defaultOptions = {
    expiresIn: 3 * 60 * 60 * 1000,
  };

  return jwt.sign(payload, privateKey, Object.assign(defaultOptions, options));
};

const generateForgotPasswordJWT = function (password: string, payload: object = {}, options: object = {}): string {
  const privateKey: any = process.env.JWT_SECRETS + password;
  const defaultOptions: object = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, privateKey, Object.assign(defaultOptions, options));
};

const validateToken = function (token: string): Object {
  try {
    const publicKey: any = process.env.JWT_SECRETS;
    let JWTToken = token.slice(7);
    return jwt.verify(JWTToken, publicKey);
  } catch (e) {
    throw new BadRequestException("Invalid token");
  }
};

const validateForgotPasswordJWT = function (password: string, token: string): Object {
  try {
    const publicKey: any = process.env.JWT_SECRETS + password;
    return jwt.verify(token, publicKey);
  } catch (e) {
    throw new BadRequestException('Password reset link was expired');
  }
};

const extractToken = function (token: string): string | null {
  if (token?.startsWith('Bearer ')) {
    return token.slice(7, token.length);
  }
  return null;
};

const generateRandomPassword = function (len: number): string {
  const randomString = 'abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let password: string = '';
  for (let index = 0; index < len; index++) {
    password += randomString[Math.ceil(Math.random() * (randomString.length - 1))];
  }

  return password;
};

const generateOtp = function (len: number): string {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < len; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

const verifyOtp = async function (userId: any, otp: string, type: string): Promise<any> {
  let existOtp = await otpMaster.findOne({
    userId,
    otp,
    type,
  });
  const currentDate = new Date();
  if (!existOtp || existOtp.otpExpiration < currentDate) {
    return null;
  }

  return existOtp._id;
};

const generateTagNumber = async function (): Promise<string> {
  const lastUser = await User.findOne({}, {}, { sort: { 'createdAt': -1 } });

  let count = 1;
  if (lastUser?.tagNumber) {
    const lastTagNumber = lastUser.tagNumber.slice(3);
    count = parseInt(lastTagNumber, 10) + 1;
  }

  const formattedCount = count.toString().padStart(3, '0');
  const tagNumber = `TRA${formattedCount}`;

  const existingUserWithSameTag = await User.findOne({ tagNumber });
  if (existingUserWithSameTag) {
    return generateTagNumber();
  }

  return tagNumber;
};

export {
  generateJWT,
  generateForgotPasswordJWT,
  validateToken,
  validateForgotPasswordJWT,
  extractToken,
  generateRandomPassword,
  generateOtp,
  verifyOtp,
  generateTagNumber,
};
