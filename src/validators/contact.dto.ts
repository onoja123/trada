import { IsString, IsEmail } from 'class-validator';

export class ContactDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    description: string;
}
