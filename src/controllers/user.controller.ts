import { NextFunction, Request, Response } from 'express';
import { jsonOne } from '@/core/utils/response';
import { UserService } from '@/services/user.service';
import { IProfile, IUser, UserResponse } from '@/interfaces';
import { ChangePasswordDto } from '@/validators';

const user = new UserService();
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await user.getUsers();

    return jsonOne<any>(res, 200, data);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];

    const data = await user.getUser(userId);
    return jsonOne<UserResponse>(res, 200, data);
  } catch (error) {
    next(error);
  }
};

const setUpAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const response = await user.setUpAddress(userId, data);
    return jsonOne<IProfile>(res, 200, response);
  } catch (error) {
    next(error);
  }
};

const setUpAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const response = await user.setUpAccount(userId, data);
    return jsonOne<IProfile>(res, 200, response);
  } catch (error) {
    next(error);
  }
};

const initiateBvnVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const response = await user.initiateBvnVerification(userId, data);
    return jsonOne<any>(res, 200, response);
  } catch (error) {
    next(error);
  }
};

const verifyAndCreateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payload } = req.body;

    const userService = new UserService();
    await userService.verifyAndCreateAccount(payload);

    return res.status(200).json({
      success: true,
      message: 'BVN verification successful',
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];

    const response = await user.updateAvatar(userId, req.body.avatar);
    return jsonOne<any>(res, 200, response);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];
    const data: ChangePasswordDto = req.body;

    const response = await user.changePassword(userId, data);
    return jsonOne<IUser>(res, 200, response);
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUser,
  setUpAddress,
  setUpAccount,
  initiateBvnVerification,
  verifyAndCreateAccount,
  updateAvatar,
  changePassword,
};
