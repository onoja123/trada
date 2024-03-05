import { IUser } from "./user";

export interface INotification {
    user: IUser;
    title: string;
    action: string;
    message: string;
    target: string;
    view: boolean;
}

export interface NotiResponse {
    notifications: INotification[];
    count: number;
}