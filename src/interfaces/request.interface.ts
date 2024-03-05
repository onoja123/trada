import { IUser } from "./user";

export interface IRequest {
    user: IUser;
    amount: number;
    reason: string;
    status: string;
    receiver: IUser;
}