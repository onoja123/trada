import { NextFunction, Request, Response } from 'express';
import { jsonOne } from '@/core/utils/response';
import { BankService } from '@/services/bank.service';
import { SettlementDto } from '@/validators';
import { IBank } from '@/interfaces';

const bank = new BankService();
const addBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];
    const data: SettlementDto = req.body;

    const result = await bank.addBank(userId, data);

    return jsonOne<IBank>(res, 200, result);
  } catch (e) {
    next(e);
  }
};

const editBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];
    const accountId = req.params.accountId;
    const data: SettlementDto = req.body;

    const result = await bank.editBank(userId, accountId, data);

    return jsonOne<IBank>(res, 200, result);
  } catch (e) {
    next(e);
  }
};

const deleteBank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params;

    const result = await bank.deleteBank(accountId);

    return jsonOne<string>(res, 200, result);
  } catch (e) {
    next(e);
  }
};

const getUserBanks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req['tokenPayload'];
    const userId = payload['id'];

    const banks = await bank.getUserBanks(userId);

    return jsonOne<IBank>(res, 200, banks);
  } catch (e) {
    next(e);
  }
};

const getBanks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banks = await bank.getBanks();

    return jsonOne<IBank>(res, 200, banks);
  } catch (e) {
    next(e);
  }
};

export default {
  addBank,
  editBank,
  deleteBank,
  getUserBanks,
  getBanks,
};
