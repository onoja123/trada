import { IsString } from 'class-validator';

export class SettlementDto {
    @IsString()
    bankName: string;

    @IsString()
    accountNumber: number;

    @IsString()
    accountName: string;
}
