import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ChangePinDto {
    @IsString()
    @IsNotEmpty()
    public oldPin: string;

    @IsString()
    @IsNotEmpty()
    public newPin: string;
}

export class ResetPinDto {
    @IsString()
    @IsNotEmpty()
    public otp: string;

    @IsString()
    @IsNotEmpty()
    public pin: string;
}

export class QrPayDto {
    @IsString()
    @IsNotEmpty()
    public qrData: string;

    @IsNumber()
    @IsNotEmpty()
    public amount: number;
}

export class WithdrawDto {
    @IsNumber()
    @IsNotEmpty()
    public amount: number;

    @IsString()
    @IsNotEmpty()
    public recipient: string;

    @IsString()
    @IsNotEmpty()
    public pin: string;
}

export class SendToUSerDto {
    @IsNumber()
    @IsNotEmpty()
    public amount: number;

    @IsString()
    @IsNotEmpty()
    public recipient: string;

    @IsString()
    @IsNotEmpty()
    public memo: string;
}

export class RequestFundsDto {
    @IsNumber()
    @IsNotEmpty()
    public amount: number;

    @IsString()
    @IsNotEmpty()
    public username?: string;

    @IsString()
    @IsNotEmpty()
    public tagNumber?: string;

    @IsString()
    @IsNotEmpty()
    public reason?: string;
}

export class TransferDto {
    @IsString()
    @IsNotEmpty()
    account_bank: string;

    @IsString()
    @IsNotEmpty()
    account_number: string;

    @IsNumber()
    @IsPositive()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsNotEmpty()
    narration: string;
}