export interface CreateFlwAccount {
                    email: string;
                    firstname: string;
                    lastname: string;
                    bvn: string;
                    tx_ref: string;
}

export interface GetAccount {
                    order_ref: string;
}

export interface FundWalletWithCard {
                    cardNumber: string,
                    cardExpiry: string,
                    cardCVV: string,
                    amount: number
}

export interface TransferToBank {
                    account_bank: string;
                    account_number: string;
                    amount: number;
                    currency: string;
                    narration: string;
}
