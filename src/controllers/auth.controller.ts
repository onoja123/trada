import { NextFunction, Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { jsonOne } from '@/core/utils';
import { CreateUserDto, LoginDto, VerifyOtpDto } from '@/validators';
import { AuthInterface } from '@/interfaces';

const auth = new AuthService();
const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateUserDto = req.body;
    const response = await auth.signUp(data);

    return jsonOne(res, 201, response);
  } catch (error) {
    next(error);
  }
};

const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: VerifyOtpDto = req.body;
    const response = await auth.verify(data);

    return jsonOne(res, 200, response);
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginDto = req.body;
    const response = await auth.login(data);
    return jsonOne<AuthInterface>(res, 200, response);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body;
    const response = await auth.forgetPassword(email);
    return jsonOne(res, 200, response);
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const response = await auth.VerifyForgetPassword(data);
    return jsonOne(res, 200, response);
  } catch (e) {
    next(e);
  }
};

export default {
  signUp,
  verify,
  login,
  forgotPassword,
  resetPassword,
};
