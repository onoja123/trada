import { Response } from '@/interfaces';

const jsonAll = function <Res>(res: any, status: number, data: Res | Array<Res>, meta: Object = {}): Response<Res> {
    return res.status(status).json({
        data: data,
        meta: {
            ...meta,
        },
    });
};

const jsonOne = function <Res>(res: any, status: number, data: Res): Res {
    return res.status(status).json({
        data,
    });
};

export { jsonAll, jsonOne };