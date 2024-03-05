import { NextFunction, Request, Response } from 'express';
import { jsonOne, jsonAll } from '@/core/utils/response';
import { TransactionService } from '@/services/transaction.service';

const transaction = new TransactionService();
const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await transaction.getAllTransactions();
    return jsonAll(res, 200, transactions);
  } catch (error) {
    next(error);
  }
};

const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, transactionId } = req.params;

    const result = await transaction.getTransaction(userId, transactionId);
    return jsonOne(res, 200, result);
  } catch (e) {
    next(e);
  }
};

const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const transactions = await transaction.getTransactions(userId);
    return jsonAll(res, 200, transactions);
  } catch (e) {
    next(e);
  }
};

export default {
  getAllTransactions,
  getTransaction,
  getTransactions,
};
