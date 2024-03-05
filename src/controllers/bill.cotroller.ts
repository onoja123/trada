import { NextFunction, Request, Response } from 'express';
import { jsonAll, jsonOne } from '@/core/utils/response';
import { BillService } from '@/services/bills.service';
import { BillType } from '@/enums';
import { BillProduct, FlwPay, FlwValidate } from '@/interfaces';

const bill = new BillService();

const getBills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryName: BillType = req.params.categoryName as BillType;
        const bills = await bill.getBills(categoryName);

        return jsonAll<any[]>(res, 200, bills);
    } catch (e) {
        next(e);
    }
};

const validateBill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: FlwValidate = req.body;
        const result = await bill.validateBill(data);

        return jsonOne<any>(res, 200, result);
    } catch (e) {
        next(e);
    }
};

const payBill = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const data: FlwPay = req.body;
        const result = await bill.payBill(userId, data);

        return jsonOne<any>(res, 200, result);
    } catch (e) {
        next(e);
    }
};

export default {
    getBills,
    validateBill,
    payBill,
};
