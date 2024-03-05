import { IWallet } from "./wallet";

export interface BillProduct {
    id?: number;
    biller_code: string;
    name: string;
    country: string;
    biller_name: string;
    item_code: string;
    short_name: string;
    fee: number;
    label_name: string;
    amount: number;
}


export interface BillResponse {
    updatedWallet: IWallet;
    result: any;
}