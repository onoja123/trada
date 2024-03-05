import { NextFunction, Request, Response } from 'express';
import { jsonOne } from "@/core/utils/response";
import { WalletService } from '@/services/wallet.service';
import { IWallet } from '@/interfaces';
import { ChangePinDto, QrPayDto, ResetPinDto, SendToUSerDto, TransferDto } from '@/validators';

const wallet = new WalletService();
const getBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const balance = await wallet.getBalance(userId);

    return jsonOne<IWallet>(res, 200, balance);
  } catch (e) {
    next(e);
  }
};

const setWalletPin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { transactionPin } = req.body;

    await wallet.setPin(userId, transactionPin);

    return jsonOne<string>(res, 200, 'Pin Set');
  } catch (e) {
    next(e);
  }
};

const changePin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const data: ChangePinDto = req.body;

    await wallet.changePin(userId, data);

    return jsonOne<string>(res, 200, 'Pin Changed');
  } catch (e) {
    next(e);
  }
};

const forgetTransactionPin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];

    await wallet.requestForgetPin(userId);

    return jsonOne<string>(res, 200, 'OTP Sent');
  } catch (e) {
    next(e);
  }
};

const resetTransactionPin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const data: ResetPinDto = req.body;

    await wallet.resetpin(userId, data);

    return jsonOne<string>(res, 200, 'Transaction Pin Updated');
  } catch (e) {
    next(e);
  }
};

const sendMoneyToUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];
    const data: SendToUSerDto = req.body;

    await wallet.sendMoneyToUser(userId, data);

    return jsonOne<string>(res, 200, 'Money Sent');
  } catch (e) {
    next(e);
  }
};

const makeQrPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];
    const data: QrPayDto = req.body;

    await wallet.makeQrPayment(userId, data);

    return jsonOne<string>(res, 200, 'Money Sent');
  } catch (e) {
    next(e);
  }
};

const transferToBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];
    const data: TransferDto = req.body;

    await wallet.transferToBank(userId, data);

    return jsonOne<string>(res, 200, 'Transfer Sent');
  } catch (e) {
    next(e);
  }
};

export default {
  getBalance,
  setWalletPin,
  changePin,
  forgetTransactionPin,
  resetTransactionPin,
  sendMoneyToUser,
  makeQrPayment,
  transferToBank,
}