import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, MinLength, IsBoolean } from 'class-validator';

export class CreateUserDto {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;
}

export class VerifyOtpDto {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    @IsString()
    otp: string;

    @IsBoolean()
    @IsNotEmpty()
    resend?: string;
}
export class LoginDto {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}

export class VerifyForgetDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    otp: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}