import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FlwValidate {
    @IsNotEmpty()
    @IsString()
    public biller_code: string

    @IsNotEmpty()
    @IsString()
    public customer: string;

    @IsNotEmpty()
    @IsString()
    public item_code: string
}

export class FlwPay {
    @IsNotEmpty()
    @IsString()
    public country: string;

    @IsNotEmpty()
    @IsString()
    public customer: string;

    @IsNotEmpty()
    @IsNumber()
    public amount: number;

    @IsNotEmpty()
    @IsString()
    public type: string;

    @IsNotEmpty()
    @IsString()
    public reference: string;

    @IsString()
    pin: string;
}

export class FlwVa {
    @IsEmail()
    public email: string;

    @IsBoolean()
    public is_permanent?: boolean;

    @IsString()
    @IsNotEmpty()
    public bvn: string;

    @IsString()
    @IsNotEmpty()
    public tx_ref?: string;
}

export class FlwVerifyBank {
    @IsString()
    @IsNotEmpty()
    public account_number: string;

    @IsString()
    @IsNotEmpty()
    public account_bank: string;
}

export class FlwTransfer {
    @IsNotEmpty()
    @IsString()
    account_bank: string;

    @IsNotEmpty()
    @IsString()
    account_number: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    narration: string;

    @IsNotEmpty()
    @IsString()
    reference?: string;
}

export class BvnInitiate {
    @IsNotEmpty()
    @IsNumber()
    bvn: string;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsOptional()
    @IsString()
    redirect_url?: string;
}