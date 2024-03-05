import { NextFunction, Request, Response } from 'express';
import { jsonOne } from "@/core/utils/response";
import { RequestService } from '@/services/request.service';
import { IRequest } from '@/interfaces';

const money = new RequestService();
const requestFunds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const data = req.body;

        await money.requestFunds(userId, data);

        return jsonOne<string>(res, 200, 'Request success');
    } catch (e) {
        next(e);
    }
};

const approveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req['tokenPayload'];
        const userId = payload['id'];
        const { requestId } = req.params;

        await money.approveRequest(userId, requestId);

        return jsonOne<string>(res, 200, 'Request Approved');
    } catch (e) {
        next(e);
    }
};

const declineRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.params;

        await money.declineRequest(requestId);

        return jsonOne<string>(res, 200, 'Request Declined');
    } catch (e) {
        next(e);
    }
};

export default {
    requestFunds,
    approveRequest,
    declineRequest,
}